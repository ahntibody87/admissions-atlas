(() => {
'use strict';
const subjects=[['국어',100,45,[2,3],88,5],['수학',100,30,[2,3,4],83,5],['영어',100,45,[2,3],80,8],['탐구 1',50,20,[2,3],42,3],['탐구 2',50,20,[2,3],39,4]];
const form=document.querySelector('#scores');
document.querySelector('#subjects').innerHTML=subjects.map(([name,max,count,points,score,wrong],i)=>`<section class="score-card"><h2>${name}</h2><label>원점수 / ${max}<input id="s${i}" type="number" min="0" max="${max}" step="1" value="${score}" required></label><label>틀린 개수 / ${count}문항<input id="w${i}" type="number" min="0" max="${count}" step="1" value="${wrong}" required></label><label>추가로 맞힐 개수<input id="a${i}" type="number" min="0" max="${wrong}" step="1" value="0" required></label><label>추가 정답 한 문제 배점<select id="p${i}">${points.map(p=>`<option>${p}</option>`).join('')}</select></label></section>`).join('');
const val=id=>Number(document.getElementById(id).value);
function calculate(){
 const error=document.querySelector('#error'),out=document.querySelector('#result'); error.textContent=''; out.innerHTML='';
 if(!form.checkValidity()){error.textContent='모든 점수와 틀린 개수, 추가 정답 수를 범위 안의 정수로 입력하세요.';return;}
 let before=0,after=0,wrongTotal=0,added=0,eng=[];
 for(let i=0;i<subjects.length;i++){
 const [name,max,count,points]=subjects[i],s=val('s'+i),w=val('w'+i),a=val('a'+i),p=val('p'+i),lost=max-s;
 if(lost<w*Math.min(...points)||lost>w*Math.max(...points)||a>w||a*p>lost||(lost-a*p)<(w-a)*Math.min(...points)||(lost-a*p)>(w-a)*Math.max(...points)){
 error.textContent=`${name}: 점수·오답 수·추가 정답의 배점이 서로 맞지 않습니다. 남은 오답의 배점도 확인하세요.`;return;}
 wrongTotal+=w;added+=a;
 if(i===2)eng=[s,s+a*p];else {before+=s;after+=s+a*p;}
 }
 const grade=s=>Math.min(9,Math.max(1,Math.ceil((90-s)/10)+1));
 const rows=[['건국대 스마트ICT',252],['건국대 융합생명공학',248],['건국대 산업공학',244],['건국대 지리학',238]];
 const state=(s,t)=>s<t-3?'참고선 아래':s>t+3?'참고선 위':'참고선 부근';
 out.innerHTML=`<h2>현재 → 목표 시나리오</h2><p class="metric">국수탐 ${before} → ${after} / 300점</p><p>전체 오답 ${wrongTotal} → ${wrongTotal-added}개 · ${added}문제 추가 정답<br>영어 ${eng[0]} → ${eng[1]}점 (${grade(eng[0])} → ${grade(eng[1])}등급)</p><p>아래는 합격 가능성이 아닌 연수 표와의 원점수 비교입니다.</p>`+rows.map(([name,t])=>`<div class="result-row"><strong>${name}</strong> · 참고 ${t}점<br>${state(before,t)} → ${state(after,t)} · ${after<t?`참고선까지 ${t-after}점`:`참고선보다 ${after-t}점 높음`}</div>`).join('')+(after<235||after>255?'<p>수록된 사례 범위를 벗어났습니다. 이 점수에 해당하는 대학 목록을 추정하지 않습니다.</p>':'');
}
form.addEventListener('input',()=>{subjects.forEach((_,i)=>{document.getElementById('a'+i).max=val('w'+i);});calculate();});
form.addEventListener('submit',e=>{e.preventDefault();calculate();});
form.addEventListener('reset',()=>setTimeout(()=>{subjects.forEach((s,i)=>document.getElementById('a'+i).max=s[5]);calculate();},0));
calculate();
})();
