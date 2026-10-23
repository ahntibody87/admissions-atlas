(function(root){
'use strict';
const subjects=[{name:'국어',max:100,n:45,points:[2,3],step:1},{name:'수학',max:100,n:30,points:[2,3,4],step:1},{name:'영어',max:100,n:45,points:[2,3],step:1},{name:'통합사회',max:50,n:25,points:[1.5,2,2.5],step:.5},{name:'통합과학',max:50,n:25,points:[1.5,2,2.5],step:.5}];
const tables=subjects.map(s=>{const a=[new Set([0])];for(let n=1;n<=s.n;n++)a.push(new Set([...a[n-1]].flatMap(x=>s.points.map(p=>x+p*2))));return a;});
function valid(i,score,wrong){const s=subjects[i],t=tables[i];return Number.isFinite(score)&&Number.isInteger(wrong)&&wrong>=0&&wrong<=s.n&&score>=0&&score<=s.max&&t[wrong].has((s.max-score)*2)&&t[s.n-wrong].has(score*2);}
function nearest(values,old){return values.reduce((a,b)=>Math.abs(b-old)<Math.abs(a-old)?b:a);}
function adjust(i,score,wrong,kind,value){const s=subjects[i];if(kind==='score'){const ws=Array.from({length:s.n+1},(_,n)=>n).filter(w=>valid(i,value,w));if(!ws.length)return null;return {score:value,wrong:nearest(ws,wrong)};}const scores=Array.from({length:s.max/s.step+1},(_,n)=>n*s.step).filter(v=>valid(i,v,value));if(!scores.length)return null;return {score:nearest(scores,score),wrong:value};}
const total=a=>a.reduce((n,s,i)=>n+(i===2?0:s.score),0), wrong=a=>a.reduce((n,s,i)=>n+(i===2?0:s.wrong),0);
const grade=s=>Math.min(9,Math.max(1,Math.ceil((90-s)/10)+1));
const api={subjects,valid,adjust,total,wrong,grade};if(typeof module!=='undefined')module.exports=api;else root.RegularModel=api;
})(typeof window!=='undefined'?window:globalThis);
