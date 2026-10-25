'use strict';
const names=['艾琳','洛恩','米菈','奧斯','伊凡','希雅','諾亞','薇拉'];
const jobs=['藥草師','守鐘人','旅店主人','鐵匠','巡林員','占星學徒','渡船人','書記官'];
const colors=['#657e69','#727479','#976f5b','#6c797e','#507d79','#7d6684','#78815e','#83665d'];
const titles=['鐘聲之後','渡口的腳印','不熄的燈','失蹤的信件','雨夜訪客','鏡中的人','封鎖的石橋','沉默的證人','黑森林密約','第十三聲鐘','月蝕前夕','最後的審判'];
const stories=['鎮鐘在午夜多響了一次。四名居民聚集在廣場，只有一人知道真正的原因。','河岸留下了凌亂的足跡。渡船已離岸，說謊的人卻仍留在人群之中。','旅店最後一盞燈始終沒有熄滅。住客們的證詞，指向截然不同的身分。','封蠟完好的信封裡空無一物。有人不希望警長知道那份名單。','暴雨封住出鎮的道路。陌生訪客早已混入居民，現在只能相信邏輯。','古鏡碎裂的聲音驚醒了整座鎮。誰在利用別人的證詞掩護自己？','石橋被鎖住，鑰匙卻在廣場中央。每個人都說自己與此事無關。','檔案室的燭火下，居民終於願意開口。聽起來最合理的話，也可能是謊言。','森林裡的盟約重見天日。這一次，狼群不只藏在一個人的影子裡。','鐘樓再度傳來不該存在的第十三聲。互相指認的證詞形成了一個圈。','月亮即將被黑影吞沒。你必須從交錯的關係中找出三名偽裝者。','所有人站在廣場上。將每一句話放回正確的位置，讓霧鎮迎來黎明。'];
titles.push('荒井回聲','霜封的窗','破碎的徽章','地下藏書室','兩封告密信','沒有乘客的船','晚宴缺席者','銀燭台','森林邊界','最後一班馬車','雙重誓言','霧散之時');
stories.push('枯井底傳來陌生的回聲。八個人的說法，並不像初聽時那麼一致。','霜花封住窗戶，屋裡卻有人留下新鮮的爪痕。今夜，誰值得信任？','巡夜人的徽章斷成兩半。你收齊了居民的證詞，準備從陣營關係找出破綻。','地窖裡的書頁被人撕去。相同陣營、不同陣營，兩句話之間藏著答案。','兩封告密信送到警署，沒有一封署名。你決定親自詢問每一位居民。','渡船空著回到岸邊。所有人都留在霧鎮，所有證詞都必須重新檢視。','晚宴結束時，壁爐裡多了一件披風。身分的判斷不能只靠第一印象。','燭台在午夜被移動。嫌疑人互相保證，你卻注意到那些保證之間的矛盾。','出鎮的路已被藤蔓封死。居民們的關係交錯，真相仍然只有一個。','馬車停在空曠的廣場。離開之前，你必須確認誰一直在編造謊言。','有人宣誓，有人沉默。把每份證詞各自拆開，便能看見偽裝的裂縫。','最後一夜的霧開始散去。完成這份卷宗，讓每個人的身分回到應有的位置。');
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function bits(mask,n){return Array.from({length:n},(_,i)=>!!(mask&(1<<i)));}
function count(mask){let c=0;while(mask){c+=mask&1;mask>>>=1;}return c;}
function truth(s,m){const a=!!(m&(1<<s.a)),b=!!(m&(1<<s.b));return s.t==='role'?a===s.v:s.t==='same'?a===b:s.t==='diff'?a!==b:Number(a)+Number(b)===s.v;}
function words(s){return s.t==='role'?names[s.a]+'是'+(s.v?'狼人':'好人')+'。':s.t==='same'?names[s.a]+'和'+names[s.b]+'屬於相同陣營。':s.t==='diff'?names[s.a]+'和'+names[s.b]+'屬於不同陣營。':names[s.a]+'和'+names[s.b]+'之中，恰好有'+s.v+'名狼人。';}
function valid(c,m){return count(m)===c.k&&c.statements.every((ss,i)=>ss.every(s=>truth(s,m)!==!!(m&(1<<i))));}
function models(c){return Array.from({length:1<<c.n},(_,m)=>m).filter(m=>valid(c,m));}
function makeCase(index){const n=index<3?4:index<6?5:index<9?6:8,k=index<3?1:index<9?2:3,r=rng(7129+index*431);const all=Array.from({length:1<<n},(_,m)=>m).filter(m=>count(m)===k);const answer=all[Math.floor(r()*all.length)],statements=Array.from({length:n},()=>[]),pool=[];
 for(let i=0;i<n;i++){for(let a=0;a<n;a++){if(a===i)continue;for(const v of [false,true])pool.push({i,t:'role',a,v});if(index>1)for(let b=a+1;b<n;b++){if(b===i)continue;pool.push({i,t:'same',a,b},{i,t:'diff',a,b});if(index>5)for(let v=0;v<=2;v++)pool.push({i,t:'count',a,b,v});}}}
 const choices=pool.filter(s=>truth(s,answer)!==!!(answer&(1<<s.i)));let possible=all.slice();
 for(let i=0;i<n;i++){const opts=choices.filter(s=>s.i===i);const s=opts[Math.floor(r()*opts.length)];statements[i].push(s);possible=possible.filter(m=>truth(s,m)!==!!(m&(1<<i)));}
 while(possible.length>1){let best=null,bestScore=-1;for(const s of choices){if(statements[s.i].includes(s))continue;const remaining=possible.filter(m=>truth(s,m)!==!!(m&(1<<s.i))).length;const score=(possible.length-remaining)*10-statements[s.i].length+r();if(remaining<possible.length&&score>bestScore){best=s;bestScore=score;}}if(!best)throw Error('No unique puzzle');statements[best.i].push(best);possible=possible.filter(m=>truth(best,m)!==!!(m&(1<<best.i)));}
 return {n,k,answer,statements,title:titles[index],story:stories[index]};}
const cases=Array.from({length:24},(_,i)=>makeCase(i));

function candidates(c,marks=Array(c.n).fill(null),read=Array.from({length:c.n},(_,i)=>i)){
 return Array.from({length:1<<c.n},(_,m)=>m).filter(m=>count(m)===c.k&&marks.every((v,i)=>v===null||v===!!(m&(1<<i)))&&read.every(i=>c.statements[i].every(s=>truth(s,m)!==!!(m&(1<<i)))));
}
function deductions(c){
 let remaining=Array.from({length:1<<c.n},(_,m)=>m).filter(m=>count(m)===c.k);const result=[];
 c.statements.forEach((ss,i)=>ss.forEach(s=>{const before=remaining.length;remaining=remaining.filter(m=>truth(s,m)!==!!(m&(1<<i)));result.push({i,s,before,after:remaining.length});}));
 return result;
}
function conflict(c,marks,read){
 const wolves=marks.filter(v=>v===true).length,unknown=marks.filter(v=>v===null).length;
 if(wolves>c.k)return '已標記 '+wolves+' 名狼人，超過本案的 '+c.k+' 名。請取消部分狼人標記。';
 if(wolves+unknown<c.k)return '剩餘未判定人數不足以滿足 '+c.k+' 名狼人，請重新檢查好人標記。';
 if(!marks.includes(null)){const m=marks.reduce((a,v,i)=>a|(v?1<<i:0),0);for(const i of read){const bad=c.statements[i].find(s=>truth(s,m)===marks[i]);if(bad)return names[i]+'被標記為'+(marks[i]?'狼人':'好人')+'，但「'+words(bad)+'」在這組判定中為'+(truth(bad,m)?'真':'假')+'，違反說話規則。';}}
 return '目前標記無法同時滿足已讀證詞。可撤銷上一步，再逐一檢查不同假設。';
}
function normalize(raw){
 if(!raw||typeof raw!=='object'||!raw.states||!raw.wins)throw Error('存檔格式不正確');
 const out={current:0,states:{},wins:{},ratings:{}};
 if(Number.isInteger(raw.current)&&raw.current>=0&&raw.current<cases.length)out.current=raw.current;
 cases.forEach((c,i)=>{const s=raw.states[i];if(s&&Array.isArray(s.marks)&&s.marks.length===c.n){out.states[i]={marks:s.marks.map(v=>typeof v==='boolean'?v:null),read:Array.isArray(s.read)?[...new Set(s.read.filter(v=>Number.isInteger(v)&&v>=0&&v<c.n))]:[],notes:typeof s.notes==='string'?s.notes.slice(0,2000):'',hints:Number.isInteger(s.hints)?Math.max(0,Math.min(3,s.hints)):0,attempts:Number.isInteger(s.attempts)?Math.max(0,Math.min(9999,s.attempts)):0,checks:Number.isInteger(s.checks)?Math.max(0,Math.min(9999,s.checks)):0};}
 if(raw.wins[i]===true)out.wins[i]=true;const rating=raw.ratings?.[i];if(out.wins[i]&&Number.isInteger(rating)&&rating>=1&&rating<=3)out.ratings[i]=rating;});
 return out;
}
if(typeof module!=='undefined')module.exports={cases,models,valid,truth,candidates,deductions,normalize,conflict};
function avatar(i){return '<svg viewBox="0 0 90 115" aria-hidden="true"><circle cx="45" cy="48" r="38" fill="'+colors[i]+'" opacity=".3"/><path d="M8 115Q8 78 31 76L59 76Q84 80 84 115" fill="'+colors[i]+'"/><path d="M29 77L45 97 61 77" fill="#d5c6a5"/><path d="M32 60H58V82L45 88 32 82" fill="#ad947a"/><ellipse cx="45" cy="46" rx="22" ry="29" fill="#c8b394"/><path d="'+(i%3===0?'M22 62Q14 15 44 12Q76 12 68 67L60 44 51 25 28 45Z':i%3===1?'M20 38L25 15 60 12 71 39 59 30 30 32Z':'M22 56Q14 12 43 15Q71 10 69 60L59 34 30 36Z')+'" fill="#243032"/><path d="M32 49H39M51 49H58" stroke="#3a3b35" stroke-width="2"/><path d="M40 64Q45 67 51 63" fill="none" stroke="#715b4d"/><path d="M45 98V115" stroke="#d9bc80" opacity=".5"/></svg>';}

if(typeof document!=='undefined'){
const $=id=>document.getElementById(id);
let saved={current:0,states:{},wins:{},ratings:{}},storageOK=true,archiveFilter='all',pendingImport=null;
try{const raw=localStorage.getItem('mist-town-v1');if(raw)saved=normalize(JSON.parse(raw));}catch(e){storageOK=false;}
let current=saved.current;
let markHistory=[];
function fresh(n){return {marks:Array(n).fill(null),read:[],notes:'',hints:0,attempts:0,checks:0};}
function state(){return saved.states[current]??=(fresh(cases[current].n));}
function save(){saved.current=current;try{localStorage.setItem('mist-town-v1',JSON.stringify(saved));storageOK=true;}catch(e){storageOK=false;}$('storageStatus').textContent=storageOK?'進度已儲存於此瀏覽器':'無法自動儲存，請匯出備份';}
function stars(n){return n?'★'.repeat(n)+'☆'.repeat(3-n):'';}
function modal(html){$('modalContent').innerHTML=html;if(!$('modal').open)$('modal').showModal();}
function message(text,type='error'){$('feedback').innerHTML='<div class="'+type+'"></div>';$('feedback').firstElementChild.textContent=text;}
function hintMessage(level){
 const c=cases[current],step=deductions(c).find(x=>x.after<x.before);
 if(level===1)return '先假設其中一人是狼人：他的每一句證詞都必須為假。再檢查其餘證詞與已知狼數是否相容。';
 if(level===2)return '從'+names[step.i]+'的「'+words(step.s)+'」開始。若他是好人，這句必須成立；若他是狼人，整句必須為假。「恰好一狼」為假，表示零狼或兩狼，不是直接判定兩人皆好。';
 return '身分提示：'+names[0]+'是'+((c.answer&1)?'狼人，所以他的每句話都必須為假。':'好人，所以他的每句話都必須為真。')+'再將這個結果帶回其他證詞。';
}
function render(){
 const c=cases[current],s=state();
 $('caseNo').textContent='CASE '+String(current+1).padStart(2,'0')+' / '+cases.length+' · '+(current<12?'第一卷／霧鎮初夜':'第二卷／長夜回聲');
 $('caseTitle').textContent=c.title;$('story').textContent=c.story;
 $('population').textContent=c.n+' 位居民';$('wolves').textContent=c.k+' 名狼人';$('difficulty').textContent=current<3?'初探':current<6?'疑雲':current<9?'迷局':current<12?'深夜':'長夜';
 $('progress').textContent=Object.keys(saved.wins).length+'/'+cases.length;
 $('marked').textContent=s.marks.filter(x=>x!==null).length+'/'+c.n+' 已標記';
 $('quickStatus').textContent=s.marks.filter(x=>x!==null).length+'/'+c.n+' 已標記 · 狼人 '+s.marks.filter(x=>x===true).length+'/'+c.k;
 $('notes').value=s.notes;$('hintText').textContent=s.hints?hintMessage(s.hints):'';
 $('hint').textContent=s.hints>=3?'✧ 提示已全部展開':'✧ '+['推理方向','指出關鍵證詞','揭露一人身分'][s.hints]+' · '+(s.hints+1)+'/3';
 $('hint').disabled=s.hints>=3;
 $('people').innerHTML=Array.from({length:c.n},(_,i)=>'<article class="person '+(s.marks[i]===true?'wolf':s.marks[i]===false?'good':'')+'"><button class="portrait" data-read="'+i+'" style="--shade:'+colors[i]+'55" aria-expanded="'+s.read.includes(i)+'">'+avatar(i)+'<div><div class="num">NO. '+String(i+1).padStart(2,'0')+'</div><div class="name">'+names[i]+'</div><div class="job">'+jobs[i]+'</div></div><span class="expand">'+(s.read.includes(i)?'證詞已記錄 ✓':'詢問證詞 ↗')+'</span></button><div class="testimony '+(!s.read.includes(i)?'unread':'')+'">'+(s.read.includes(i)?c.statements[i].map(x=>'「'+words(x)+'」').join('<br>'):'尚未詢問 · 點選上方人物聽取證詞')+'</div><div class="mark"><button data-mark="'+i+'" data-value="false" class="'+(s.marks[i]===false?'active':'')+'" aria-pressed="'+(s.marks[i]===false)+'">◇ 好人</button><button data-mark="'+i+'" data-value="true" class="'+(s.marks[i]===true?'active':'')+'" aria-pressed="'+(s.marks[i]===true)+'">♧ 狼人</button></div></article>').join('');
 $('clues').innerHTML='<div class="clue"><b>01</b> 狼人恰好 '+c.k+' 名，目前標記 '+s.marks.filter(v=>v===true).length+' 名。</div><div class="clue"><b>02</b> 已取得 '+s.read.length+' / '+c.n+' 人的證詞。</div><div class="clue"><b>03</b> '+(saved.wins[current]?'本案已破獲 '+stars(saved.ratings[current]):'所有證詞合起來只有一組解答。')+'</div>';
 $('caseActions').innerHTML='<button id="readAll">一次詢問所有人</button><button id="undoMark" '+(!markHistory.length?'disabled':'')+'>↶ 撤銷標記</button><button id="restart">重新調查</button>'+(saved.wins[current]?'<button id="review">回顧解答</button>':'');
 $('undoMark').onclick=()=>{if(!markHistory.length)return;s.marks=markHistory.pop();$('feedback').innerHTML='';$('analysis').textContent='已撤銷上一步標記。';save();render();$('undoMark').focus?.();};
 $('readAll').onclick=()=>{s.read=Array.from({length:c.n},(_,i)=>i);save();render();};
 $('restart').onclick=()=>modal('<h2>重新調查本案？</h2><p>清除本案的身分標記、詢問紀錄與本輪提示次數。保留筆記、已破案紀錄與最佳星級。</p><button class="primary" id="confirmRestart">重新開始本案</button>');
 if($('review'))$('review').onclick=explanation;
 $('storageStatus').textContent=storageOK?'進度已儲存於此瀏覽器':'無法自動儲存，請匯出備份';
}
function explanation(){
 const c=cases[current],steps=deductions(c);
 modal('<div class="eyebrow">CASE CLOSED · '+stars(saved.ratings[current])+'</div><h2>真相重見月光</h2><p>狼人是：'+names.filter((_,i)=>i<c.n&&(c.answer&(1<<i))).join('、')+'。</p><h3>如何一步步排除？</h3><p>先列出符合「'+c.k+' 名狼人」的 '+steps[0].before+' 種組合。每加入一句證詞，只保留「好人說真話、狼人說假話」的組合。</p><ol class="deductions">'+steps.filter(x=>x.before!==x.after).map(x=>'<li><b>'+names[x.i]+'：</b>「'+words(x.s)+'」<span class="elimination">'+x.before+' 種 → '+x.after+' 種</span></li>').join('')+'</ol><p>逐句篩選後只剩一組；其餘證詞也必須符合這組結果。</p><h3>逐句驗證</h3>'+c.statements.map((ss,i)=>'<p><strong>'+names[i]+' · '+((c.answer&(1<<i))?'狼人':'好人')+'</strong><br>'+ss.map(x=>words(x)+' → '+(truth(x,c.answer)?'真':'假')).join('<br>')+'</p>').join(''));
}
$('people').onclick=e=>{
 const read=e.target.closest('[data-read]'),mark=e.target.closest('[data-mark]'),s=state();
 if(read){const i=+read.dataset.read;if(!s.read.includes(i))s.read.push(i);}
 if(mark){markHistory.push(s.marks.slice());if(markHistory.length>50)markHistory.shift();const i=+mark.dataset.mark,v=mark.dataset.value==='true';s.marks[i]=s.marks[i]===v?null:v;}
 if(read||mark){$('feedback').innerHTML='';$('analysis').textContent='';save();render();const selector=mark?'[data-mark="'+mark.dataset.mark+'"][data-value="'+mark.dataset.value+'"]':'[data-read="'+read.dataset.read+'"]';document.querySelector(selector)?.focus?.();}
};
$('notes').oninput=()=>{state().notes=$('notes').value.slice(0,2000);save();};
$('hint').onclick=()=>{state().hints=Math.min(3,state().hints+1);save();render();};
$('check').onclick=()=>{
 const s=state(),c=cases[current];if(!s.read.length){$('analysis').textContent='先詢問至少一位居民，再檢查目前推論。';return;}
 s.checks++;const n=candidates(c,s.marks,s.read).length;
 $('analysis').textContent=n===0?conflict(c,s.marks,s.read):'依目前標記、已讀證詞與狼數，尚有 '+n+' 種可能。'+(s.read.length<c.n?'還有未詢問的居民，取得證詞後再判斷。':'若已完成所有標記，就可以提交判定。');
 save();
};
$('judge').onclick=()=>{
 const c=cases[current],s=state();
 if(s.marks.includes(null)){message('請先為每位居民標記好人或狼人。');return;}
 s.attempts++;const m=s.marks.reduce((a,v,i)=>a|(v?1<<i:0),0);
 if(m===c.answer){
 const rating=s.hints===0&&s.checks===0&&s.attempts===1?3:s.hints<=1?2:1;
 saved.wins[current]=true;saved.ratings[current]=Math.max(saved.ratings[current]||0,rating);save();render();
 $('feedback').innerHTML='<div class="success"><div class="rating">'+stars(rating)+'</div>✓ 判定正確！'+(current===cases.length-1?'霧已散去，最後一份卷宗完成。':'霧鎮又離黎明近了一步。')+'<p>本輪提交 '+s.attempts+' 次 · 使用提示 '+s.hints+' 層 · 推論檢查 '+s.checks+' 次</p><button id="explain">查看推理過程</button><button id="next">'+(current<cases.length-1?'前往下一案 →':'回到案件卷宗 →')+'</button></div>';
 $('explain').onclick=explanation;$('next').onclick=()=>current<cases.length-1?load(current+1):chapters();
 }else{
 let reason='你標記的狼人數不符合本案已知人數。';
 if(count(m)===c.k){reason='目前判定與證詞不相容。先詢問所有居民，再比對每句話。';
 for(const i of s.read){const bad=c.statements[i].find(x=>truth(x,m)===s.marks[i]);if(bad){reason='你將'+names[i]+'標記為'+(s.marks[i]?'狼人':'好人')+'，但「'+words(bad)+'」在你的判定中為'+(truth(bad,m)?'真':'假')+'，與說話規則矛盾。';break;}}}
 message('尚有矛盾。'+reason);save();
 }
};
function load(i){current=i;markHistory=[];state();save();$('feedback').innerHTML='';$('analysis').textContent='';render();if($('modal').open)$('modal').close();$('caseTitle').scrollIntoView({behavior:'smooth',block:'start'});}
function chapters(){
 const completed=Object.keys(saved.wins).length,totalStars=Object.values(saved.ratings).reduce((a,b)=>a+b,0);
 modal('<div class="eyebrow">THE CASE ARCHIVE</div><h2>二十四夜・案件卷宗</h2><div class="archiveStats"><span><b>'+completed+'</b> / 24 已破獲</span><span><b>'+totalStars+'</b> / 72 星</span></div><p>第一卷學習基本判斷，第二卷挑戰八人關係謎局。所有案件皆可自由選擇。</p><div class="filters">'+[['all','全部'],['open','未破案'],['done','已破案']].map(([v,t])=>'<button data-filter="'+v+'" aria-pressed="'+(archiveFilter===v)+'" class="'+(archiveFilter===v?'active':'')+'">'+t+'</button>').join('')+'</div><div class="chapterlist">'+cases.map((c,i)=>({c,i})).filter(({i})=>archiveFilter==='all'||(archiveFilter==='done'?!!saved.wins[i]:!saved.wins[i])).map(({c,i})=>'<button data-case="'+i+'" class="'+(i===current?'current':'')+'">'+String(i+1).padStart(2,'0')+' · '+c.title+'<small>'+c.n+' 人 / '+c.k+' 狼 '+(saved.wins[i]?' · '+(stars(saved.ratings[i])||'已破獲 ✓'):'')+'</small></button>').join('')+'</div><p class="subtle">三星：第一次提交正確，未使用提示或推論檢查。二星：最多使用第一層提示；其餘成功破案得一星。保留歷次最佳星級。</p>');
}
$('chapters').onclick=()=>{archiveFilter='all';chapters();};
$('modalContent').onclick=e=>{
 const b=e.target.closest('[data-case]'),f=e.target.closest('[data-filter]');
 if(b)load(+b.dataset.case);if(f){archiveFilter=f.dataset.filter;chapters();}
 if(e.target.id==='confirmRestart'){const notes=state().notes;saved.states[current]=fresh(cases[current].n);state().notes=notes;load(current);}
 if(e.target.id==='confirmImport'&&pendingImport){saved=pendingImport;pendingImport=null;load(saved.current);message('存檔已匯入，繼續調查吧。','success');}
};
$('rules').onclick=()=>modal('<div class="eyebrow">HOW TO PLAY · V2</div><h2>你的武器，是邏輯。</h2><ol><li>點選居民卡片取得證詞，也能「一次詢問所有人」。</li><li><b>好人每一句都為真，狼人每一句都為假。</b>如果同一人說兩句，每句都必須各自符合規則。</li><li>狼人數是可靠資訊。「相同陣營」指兩人同為好人或同為狼人。「恰好一名狼人」為假時，可能是零名或兩名。</li><li>點選「好人／狼人」標記，再次點選可清除。</li><li>「檢查目前推論」只使用已讀證詞、已知狼數與目前標記，未讀證詞不會暗中參與判定。</li><li>三階段提示依序提供方向、關鍵證詞、最後才揭露一人身分。</li><li>全員標記後提交。錯誤可以重試；過關後查看排除過程與逐句驗證。</li></ol><p>本作為原創固定邏輯謎題。職業、外貌、氣氛敘事都不是證據；每個案件的身分獨立，不沿用上案答案。</p><p>星級：無提示、無檢查、第一次提交正確為三星；最多使用第一層提示為二星；其餘破案為一星。重玩保留最佳紀錄。</p><p>更換瀏覽器或新版遊戲檔前，請先「匯出存檔」，再於新檔案匯入。</p>');
$('backup').onclick=()=>modal('<div class="eyebrow">SAVE & RESTORE</div><h2>帶走你的調查進度</h2><p>存檔包含每案的筆記、身分標記、完成紀錄與星級。換電腦或更新遊戲檔時，可以再匯入。</p><button id="exportSave" class="primary">下載存檔 JSON</button><label class="fileLabel">匯入存檔<input id="importSave" type="file" accept=".json,application/json"></label><p id="importStatus" aria-live="polite"></p>');
$('modalContent').addEventListener('click',e=>{
 if(e.target.id!=='exportSave')return;
 const blob=new Blob([JSON.stringify({game:'mist-town',version:2,data:saved},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mist-town-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('modalContent').addEventListener('change',async e=>{
 if(e.target.id!=='importSave')return;const file=e.target.files[0];if(!file)return;
 try{if(file.size>200000)throw Error('檔案過大，請選擇本遊戲匯出的 JSON 存檔。');const raw=JSON.parse(await file.text());if(raw.game!=='mist-town'||raw.version!==2)throw Error('這不是支援的霧鎮存檔。');pendingImport=normalize(raw.data);modal('<h2>確認匯入存檔</h2><p>這份存檔已完成 '+Object.keys(pendingImport.wins).length+' 個案件。匯入會取代目前瀏覽器的進度；建議先保留目前的匯出備份。</p><button id="confirmImport" class="primary">確認匯入</button>');}
 catch(err){$('importStatus').textContent='無法匯入：'+err.message;}
});
document.querySelector('.close').onclick=()=>{$('modal').close();pendingImport=null;};
$('jumpNotes').onclick=()=>{$('investigation').scrollIntoView({behavior:'smooth',block:'start'});$('notes').focus({preventScroll:true});};
$('jumpPeople').onclick=()=>{$('people').scrollIntoView({behavior:'smooth',block:'start'});document.querySelector('[data-read]')?.focus({preventScroll:true});};
render();save();
}


