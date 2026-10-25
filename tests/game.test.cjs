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

