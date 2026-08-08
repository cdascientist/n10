/* =====================================================================
   pool.js — parallel.js-compatible worker pool
   ---------------------------------------------------------------------
   A live fleet of Web Workers shares the particle simulation, the energy
   veins, and map() sharding. Sandboxed frames / strict CSPs block
   blob: workers — LocalWorker runs the SAME job source on the main
   thread behind an identical postMessage surface, so the scene still
   builds, just with a smaller particle budget.

   Pure JS — no THREE, no DOM. Safe to import anywhere.
   ===================================================================== */

/* ── 01 ── worker source: physics + veins + map/bench jobs ─────────── */
/* This string becomes a Blob URL instantiated in real workers (and eval'd
   into LocalWorker). All state lives per-worker; postMessage is the only
   interface, mirroring parallel.js semantics. */
const WORKER_SRC = `
let ID=0,OFF=0,N=0,pos=null,vel=null,B=null,seed=1;
function rnd(){ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }
/* grow a jagged crack: walk forward, occasionally fork into a child vein */
function vein(x,z,ang,len,depth,out,B){
  let steps=Math.max(2,Math.floor(len/0.55));
  for(let i=0;i<steps;i++){
    const nx=x+Math.cos(ang)*0.55, nz=z+Math.sin(ang)*0.55;
    if(nx<B.x0||nx>B.x1||nz<B.z0||nz>B.z1) return;
    out.push(x,0.012,z,nx,0.012,nz);
    x=nx; z=nz; ang+=(rnd()-0.5)*0.85;
    if(depth>0&&rnd()<0.07) vein(x,z,ang+(rnd()-0.5)*1.9,len*0.42,depth-1,out,B);
  }
}
self.onmessage=function(e){
  const m=e.data;
  if(m.job==='init'){
    /* assign this worker its band of the particle field */
    ID=m.id; OFF=m.offset; N=m.count; B=m.bounds; seed=(m.seed>>>0)||1;
    pos=new Float32Array(N*3); vel=new Float32Array(N*3);
    for(let i=0;i<N;i++){
      pos[i*3]=B.x0+rnd()*(B.x1-B.x0);
      pos[i*3+1]=0.05+rnd()*3.8;
      pos[i*3+2]=B.z0+rnd()*(B.z1-B.z0);
      vel[i*3]=(rnd()-0.5)*0.3; vel[i*3+1]=0.05+rnd()*0.26; vel[i*3+2]=(rnd()-0.5)*0.3;
    }
    self.postMessage({job:'ready',id:ID});
  }
  else if(m.job==='step'){
    /* one physics timestep for every mote this worker owns */
    if(!pos){ self.postMessage({job:'idle',id:ID}); return; }
    const dt=Math.min(m.dt,0.05), t=m.t;
    for(let i=0;i<N;i++){
      const k=i*3;
      const x=pos[k],y=pos[k+1],z=pos[k+2];
      vel[k]  +=Math.sin(y*1.7+t*0.7+i*0.013)*dt*0.4;
      vel[k+2]+=Math.cos(x*1.3+t*0.5+i*0.017)*dt*0.4;
      vel[k]*=0.985; vel[k+2]*=0.985;
      let nx=x+vel[k]*dt, ny=y+vel[k+1]*dt, nz=z+vel[k+2]*dt;
      if(ny>4.0){ ny=0.03; nx=B.x0+rnd()*(B.x1-B.x0); nz=B.z0+rnd()*(B.z1-B.z0); }
      if(nx<B.x0) nx=B.x1; else if(nx>B.x1) nx=B.x0;
      if(nz<B.z0) nz=B.z1; else if(nz>B.z1) nz=B.z0;
      pos[k]=nx; pos[k+1]=ny; pos[k+2]=nz;
    }
    const out=pos.slice();
    self.postMessage({job:'step',id:ID,offset:OFF,count:N,buf:out.buffer},[out.buffer]);
  }
  else if(m.job==='veins'){
    /* etch a batch of cracks inside a region band */
    seed=(m.seed>>>0)||7; const out=[];
    for(let i=0;i<m.seeds;i++){
      const x=m.region.x0+rnd()*(m.region.x1-m.region.x0);
      const z=m.region.z0+rnd()*(m.region.z1-m.region.z0);
      vein(x,z,rnd()*Math.PI*2,7+rnd()*13,2,out,m.bounds);
    }
    const buf=Float32Array.from(out);
    self.postMessage({job:'veins',id:ID,tag:m.tag,buf:buf.buffer},[buf.buffer]);
  }
  else if(m.job==='map'){
    /* parallel.js-style map: fn serialised over the wire, applied per item */
    const fn=new Function('return '+m.fn)();
    const res=m.items.map(fn);
    self.postMessage({job:'map',id:ID,tag:m.tag,res:res});
  }
  else if(m.job==='bench'){
    /* quick CPU probe used to size the fleet */
    const t0=Date.now(); let s=0;
    for(let i=1;i<m.n;i++) s+=Math.sqrt(i)*Math.sin(i*0.001);
    self.postMessage({job:'bench',id:ID,tag:m.tag,ms:Date.now()-t0,v:s});
  }
};`;

/* ── 02 ── LocalWorker: identical surface, main-thread execution ───── */
export class LocalWorker {
  constructor(src) {
    this.onmessage = null;
    this.onerror = null;
    /* a fake `self` host whose postMessage routes back through the
       LocalWorker's own onmessage on the next macrotask */
    const host = { onmessage: null, postMessage: m => {
      if (this.onmessage) setTimeout(() => this.onmessage({ data: m }), 0);
    }};
    new Function('self', src)(host);   // run the worker source against the host
    this._host = host;
  }
  postMessage(m) {
    setTimeout(() => {
      try { this._host.onmessage({ data: m }); }
      catch (e) { console.warn(e); }
    }, 0);
  }
  terminate() { this._host.onmessage = null; }
}

/* ── 03 ── Pool: fleet management + parallel.js-style map ──────────── */
export class Pool {
  constructor() {
    this.mode = 'worker';
    try { this.url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' })); }
    catch (e) { this.url = null; this.mode = 'inline'; }
    this.workers = [];
    this.busy = [];
    this.handlers = {};
    this.tag = 0;
    this.pending = {};
    this.hw = navigator.hardwareConcurrency || 4;
    this.max = Math.max(2, Math.min(16, this.hw * 2));  // generous ceiling
    this.min = 2;
  }

  /* Verify a real worker can start AND reply before committing the fleet. */
  probe() {
    if (this.mode === 'inline') return Promise.resolve('inline');
    return new Promise(res => {
      let w;
      try { w = new Worker(this.url); }
      catch (e) { this.mode = 'inline'; return res('inline'); }
      const done = ok => {
        try { w.terminate(); } catch (e) {}
        this.mode = ok ? 'worker' : 'inline';
        res(this.mode);
      };
      const timer = setTimeout(() => done(false), 1600);
      w.onmessage = () => { clearTimeout(timer); done(true); };
      w.onerror   = () => { clearTimeout(timer); done(false); };
      try { w.postMessage({ job: 'bench', n: 1000, tag: 0 }); }
      catch (e) { clearTimeout(timer); done(false); }
    });
  }

  /* spawn one worker (or LocalWorker fallback) and wire its reply routing */
  spawn() {
    const id = this.workers.length;
    let w = null;
    if (this.mode === 'worker') {
      try { w = new Worker(this.url); w.onerror = ev => { console.warn('worker error', ev.message); }; }
      catch (e) { this.mode = 'inline'; }
    }
    if (!w) w = new LocalWorker(WORKER_SRC);
    w.onmessage = e => {
      const m = e.data;
      if (m.job === 'step' || m.job === 'idle') this.busy[m.id] = false;
      if (m.tag !== undefined && this.pending[m.tag]) { this.pending[m.tag](m); delete this.pending[m.tag]; }
      const h = this.handlers[m.job]; if (h) h(m);
    };
    this.workers.push(w); this.busy.push(false);
    return id;
  }

  /* grow/shrink the fleet within [min, max] */
  resize(n) {
    n = Math.max(this.min, Math.min(this.max, n));
    while (this.workers.length < n) this.spawn();
    while (this.workers.length > n) { this.workers.pop().terminate(); this.busy.pop(); }
    return this.workers.length;
  }

  on(job, fn) { this.handlers[job] = fn; }
  each(build) { this.workers.forEach((w, i) => w.postMessage(build(i))); }

  /* parallel.js-style: pool.map(array, fn) → Promise, sharded across workers */
  map(items, fn) {
    const shards = [], n = this.workers.length;
    for (let i = 0; i < n; i++) shards.push([]);
    items.forEach((it, i) => shards[i % n].push(it));
    return Promise.all(shards.map((items, i) => new Promise(res => {
      if (!items.length) return res([]);
      const tag = ++this.tag;
      this.pending[tag] = m => res(m.res);
      this.workers[i].postMessage({ job: 'map', fn: fn.toString(), items, tag });
    }))).then(parts => [].concat(...parts));
  }

  /* fire a job at worker i and resolve on its tagged reply (with timeout) */
  request(i, msg, timeout = 4000) {
    return new Promise(res => {
      const tag = ++this.tag;
      let settled = false;
      const finish = m => { if (!settled) { settled = true; delete this.pending[tag]; res(m); } };
      this.pending[tag] = finish;
      setTimeout(() => finish(null), timeout);
      try { this.workers[i].postMessage(Object.assign({ tag }, msg)); }
      catch (e) { finish(null); }
    });
  }

  get size() { return this.workers.length; }
}
