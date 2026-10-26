const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../mist-town/game.js'),'utf8');
const engine=require('../mist-town/game.js');
assert.equal(engine.cases.length,24);
for(const c of engine.cases){assert.deepEqual(engine.models(c),[c.answer]);assert.equal(engine.deductions(c).at(-1).after,1);assert.equal(engine.candidates(c).length,1);const wrong=Array(c.n).fill(null);wrong[0]=!(c.answer&1);assert.equal(engine.candidates(c,wrong).length,0);}
const els={};function el(id){return els[id]??={innerHTML:'',textContent:'',value:'',open:false,firstElementChild:{textContent:''},listeners:{},addEventListener(k,f){this.listeners[k]=f},showModal(){this.open=true},close(){this.open=false},scrollIntoView(){}};}
const store={};const ctx={document:{getElementById:el,querySelector:el},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},console,module:{exports:{}}};vm.createContext(ctx);vm.runInContext(source,ctx);
for(let n=0;n<24;n++){const c=engine.cases[n];el('judge').onclick();assert.match(el('feedback').firstElementChild.textContent,/請先/);el('readAll').onclick();assert.match(el('clues').innerHTML,new RegExp(c.n+' / '+c.n));for(let i=0;i<c.n;i++){el('people').onclick({target:{closest:q=>q==='[data-mark]'?{dataset:{mark:String(i),value:String(!!(c.answer&(1<<i)))}}:null}});}el('notes').value='筆記';el('notes').oninput();el('judge').onclick();assert.match(el('feedback').innerHTML,/判定正確/);assert.equal(JSON.parse(store['mist-town-v1']).ratings[n],3);el('explain').onclick();assert.match(el('modalContent').innerHTML,/逐句驗證/);el('modal').close();if(n<23)el('next').onclick();}
assert.equal(Object.keys(JSON.parse(store['mist-town-v1']).wins).length,24);
el('restart').onclick();el('modalContent').onclick({target:{id:'confirmRestart',closest:()=>null}});assert.equal(JSON.parse(store['mist-town-v1']).states[23].notes,'筆記');
for(let i=0;i<3;i++)el('hint').onclick();assert.equal(el('hint').disabled,true);assert.match(el('hintText').textContent,/身分提示/);
const restored=engine.normalize(JSON.parse(store['mist-town-v1']));assert.equal(restored.ratings[23],3);assert.equal(restored.states[23].hints,3);
assert.throws(()=>engine.normalize(null));
console.log('PASS: 24 unique solutions, deduction chains, partial contradictions, 24 full game flows, ratings, notes, restart, 3 hints and save normalization.');


const before=JSON.parse(store['mist-town-v1']).states[23].marks;
el('people').onclick({target:{closest:q=>q==='[data-mark]'?{dataset:{mark:'0',value:'true'}}:null}});
assert.equal(JSON.parse(store['mist-town-v1']).states[23].marks[0],true);
el('undoMark').onclick();assert.deepEqual(JSON.parse(store['mist-town-v1']).states[23].marks,before);
assert.match(el('analysis').textContent,/已撤銷/);
const first=engine.cases[0];assert.match(engine.conflict(first,[true,true,null,null],[]),/超過/);
assert.match(engine.conflict(first,[false,false,false,false],[]),/不足/);
for(const c of engine.cases){const wrong=Array.from({length:1<<c.n},(_,m)=>m).find(m=>m!==c.answer&&m.toString(2).split('1').length-1===c.k);const marks=Array.from({length:c.n},(_,i)=>!!(wrong&(1<<i)));assert.match(engine.conflict(c,marks,Array.from({length:c.n},(_,i)=>i)),/違反說話規則/);assert.doesNotMatch(engine.conflict(c,marks,[]),/違反說話規則/);}
console.log('PASS: undo persistence, wolf-count bounds and evidence-based conflict messages for all 24 cases.');

// Random generation must stay deterministic and uniquely solvable across all difficulties.
for(const level of [0,6,12])for(let seed=1;seed<=100;seed++){const c=engine.makeCase(level,seed);assert.deepEqual(engine.models(c),[c.answer]);assert.deepEqual(c,engine.makeCase(level,seed));}
const clickModal=id=>el('modalContent').onclick({target:{id,closest:()=>null}});
el('hypothesis').onclick();clickModal('saveHypothesis');const snap=JSON.parse(store['mist-town-v1']).states[23].marks;
el('people').onclick({target:{closest:q=>q==='[data-mark]'?{dataset:{mark:'0',value:'true'}}:null}});clickModal('restoreHypothesis');assert.deepEqual(JSON.parse(store['mist-town-v1']).states[23].marks,snap);
assert.deepEqual(engine.normalize(JSON.parse(store['mist-town-v1'])).states[23].hypothesis,snap);
const mainBefore=store['mist-town-v1'];
const randomCtx={...ctx,location:{search:'?seed=73519&level=6'},URLSearchParams,module:{exports:{}}};vm.createContext(randomCtx);vm.runInContext(source,randomCtx);assert.equal(store['mist-town-v1'],mainBefore);assert.match(el('caseNo').textContent,/73519/);assert.ok(store['mist-town-random-6-73519']);
const randomCase=engine.makeCase(6,73519);el('readAll').onclick();for(let i=0;i<randomCase.n;i++)el('people').onclick({target:{closest:q=>q==='[data-mark]'?{dataset:{mark:String(i),value:String(!!(randomCase.answer&(1<<i)))}}:null}});el('judge').onclick();assert.equal(JSON.parse(store['mist-town-random-6-73519']).ratings[0],3);assert.equal(store['mist-town-v1'],mainBefore);
const reloadCtx={...ctx,location:{search:'?seed=73519&level=6'},URLSearchParams,module:{exports:{}}};vm.createContext(reloadCtx);vm.runInContext(source,reloadCtx);assert.match(el('clues').innerHTML,/本案已破獲/);
console.log('PASS: 300 deterministic unique random cases, hypothesis restore/normalization, random full flow and reload, main save isolation.');

for(const c of engine.cases){assert.deepEqual(engine.evidenceRows(c,[]),[]);for(let person=0;person<c.n;person++){const rows=engine.evidenceRows(c,[0],person);assert.ok(rows.every(r=>r.speaker===0));assert.ok(rows.every(r=>r.speaker===person||r.statement.a===person||(r.statement.t!=='role'&&r.statement.b===person)));}}
el('evidence').onclick();assert.match(el('modalContent').innerHTML,/證詞整理板/);
const pinId='0-0';el('modalContent').onclick({target:{closest:q=>q==='[data-pin]'?{dataset:{pin:pinId}}:null}});assert.deepEqual(JSON.parse(store['mist-town-random-6-73519']).states[0].pins,[pinId]);assert.match(el('modalContent').innerHTML,/已釘選/);
el('modalContent').onclick({target:{id:'pinnedOnly',closest:()=>null}});assert.match(el('modalContent').innerHTML,/顯示 1 則證詞/);
el('modalContent').onclick({target:{closest:q=>q==='[data-pin]'?{dataset:{pin:pinId}}:null}});assert.match(el('modalContent').innerHTML,/目前篩選下沒有證詞/);
const pinSave=JSON.parse(mainBefore);pinSave.states[0].pins=['0-0','0-0','99-99','<script>',12];assert.deepEqual(engine.normalize(pinSave).states[0].pins,['0-0']);
assert.equal(typeof el('continueCase').onclick,'function');
console.log('PASS: evidence read boundary, resident relation filters, pin toggle/save/filter, invalid pin normalization, persistent continuation control.');

assert.equal(engine.taipeiDay(new Date('2026-10-25T15:59:59Z')),'2026-10-25');
assert.equal(engine.taipeiDay(new Date('2026-10-25T16:00:00Z')),'2026-10-26');
assert.equal(engine.dailySpec('2026-02-29'),null);assert.equal(engine.dailySpec('bad'),null);assert.ok(engine.dailySpec('2028-02-29'));
for(let d=1;d<=31;d++){const spec=engine.dailySpec('2026-10-'+String(d).padStart(2,'0'));const c=engine.makeCase(spec.level,spec.seed);assert.deepEqual(engine.models(c),[c.answer]);}
assert.equal(engine.milestones({}).filter(m=>m.value>=m.target).length,0);
assert.equal(engine.milestones(JSON.parse(mainBefore)).filter(m=>m.value>=m.target).length,6);
assert.equal(engine.milestones({wins:{},ratings:{0:3}})[4].value,0);
const beforeDailyMain=store['mist-town-v1'],beforeDailyRandom=store['mist-town-random-6-73519'];
const dailyCtx={...ctx,location:{search:'?daily=2026-10-26'},URLSearchParams,module:{exports:{}}};vm.createContext(dailyCtx);vm.runInContext(source,dailyCtx);
assert.match(el('caseTitle').textContent,/每日委託.*2026-10-26/);
const spec=engine.dailySpec('2026-10-26'),dc=engine.makeCase(spec.level,spec.seed);el('readAll').onclick();for(let i=0;i<dc.n;i++)el('people').onclick({target:{closest:q=>q==='[data-mark]'?{dataset:{mark:String(i),value:String(!!(dc.answer&(1<<i)))}}:null}});el('judge').onclick();assert.equal(JSON.parse(store['mist-town-daily-2026-10-26']).ratings[0],3);
assert.equal(store['mist-town-v1'],beforeDailyMain);assert.equal(store['mist-town-random-6-73519'],beforeDailyRandom);
el('dailyCase').onclick();assert.equal((el('modalContent').innerHTML.match(/class="dailyCard/g)||[]).length,7);
el('achievements').onclick();assert.ok(el('modalContent').innerHTML.includes('已達成 6 / 6'));
const dailyReload={...ctx,location:{search:'?daily=2026-10-26'},URLSearchParams,module:{exports:{}}};vm.createContext(dailyReload);vm.runInContext(source,dailyReload);assert.match(el('clues').innerHTML,/本案已破獲/);
(async()=>{const raw={game:'mist-town',version:2,daily:'2026-10-25',challenge:{seed:spec.seed,level:spec.level},data:JSON.parse(store['mist-town-daily-2026-10-26'])};await el('modalContent').listeners.change({target:{id:'importSave',files:[{size:100,text:async()=>JSON.stringify(raw)}]}});assert.match(el('importStatus').textContent,/對應的每日委託日期/);raw.daily='2026-10-26';await el('modalContent').listeners.change({target:{id:'importSave',files:[{size:100,text:async()=>JSON.stringify(raw)}]}});assert.match(el('modalContent').innerHTML,/確認匯入存檔/);console.log('PASS: Taipei midnight, calendar validation, 31 daily unique cases, six milestones, daily flow/reload/isolation and date-matched import.');})().catch(e=>{console.error(e);process.exitCode=1;});


for(const c of engine.cases){
 const blank=Array(c.n).fill(null);
 const without=engine.forcedMoves(c,blank,[]);
 assert.equal(without.possible,engine.candidates(c,blank,[]).length);
 assert.deepEqual(without.forced,[],'wolf count alone cannot identify an individual');
 for(let readCount=1;readCount<=c.n;readCount++){
  const read=Array.from({length:readCount},(_,i)=>i),step=engine.forcedMoves(c,blank,read);
  const all=engine.candidates(c,blank,read);
  assert.equal(step.possible,all.length);
  for(const f of step.forced)assert.ok(all.every(m=>!!(m&(1<<f.index))===f.wolf));
  if(readCount===c.n){assert.equal(step.possible,1);assert.equal(step.forced.length,c.n);}
 }
}
assert.equal(typeof el('nextStep').onclick,'function');
el('nextStep').onclick();
assert.match(el('analysis').textContent,/所有居民都已標記/);
console.log('PASS: evidence-limited forced deductions across 24 cases, no hidden testimony leak, next-step UI on completed cases.');
