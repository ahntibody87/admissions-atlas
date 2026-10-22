(() => {
 'use strict';
 const data = window.ATAA_SUBJECTS, $ = id => document.getElementById(id);
 const query=$('subject-query'), zone=$('subject-zone'), uni=$('subject-university'), results=$('subject-results'), more=$('subject-more');
 let limit=30, filtered=[];
 const norm=s=>s.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,'');
 const searchable=data.map(r=>norm([r.zone,r.region,r.university,r.department,r.core,r.recommended,r.note].join(' ')));
 const node=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;};
 const options=(select,values,label)=>{select.replaceChildren(new Option(label,''),...values.map(v=>new Option(v,v)));};
 options(zone,[...new Set(data.map(r=>r.zone))],'전체 권역');
 function universities(){options(uni,[...new Set(data.filter(r=>!zone.value||r.zone===zone.value).map(r=>r.university))].sort((a,b)=>a.localeCompare(b,'ko')),'전체 대학');}
 function render(){
  const tokens=query.value.trim().split(/\s+/).filter(Boolean).map(norm);
  filtered=data.filter((r,i)=>(!zone.value||r.zone===zone.value)&&(!uni.value||r.university===uni.value)&&tokens.every(t=>searchable[i].includes(t)));
  $('subject-count').textContent=`검색 결과 ${filtered.length.toLocaleString()}개 · ${Math.min(limit,filtered.length)}개 표시`;
  results.replaceChildren();
  for(const r of filtered.slice(0,limit)){
   const card=node('article','','subject-card');card.append(node('p',`${r.zone} · ${r.region} · ${r.university}`,'subject-meta'),node('h3',r.department));
   const dl=document.createElement('dl');
   for(const [label,value] of (r.combined?[['반영과목 안내',r.core]]:[['핵심과목',r.core],['권장과목',r.recommended]])){dl.append(node('dt',label),node('dd',value||'원본에 별도 기재 없음'));}
   card.append(dl);if(r.note&&r.note!=='-'){const d=document.createElement('details');d.append(node('summary','비고 확인'),node('p',r.note));card.append(d);}
   card.append(node('small',`원본 Sheet1 · ${r.id}행`));results.append(card);
  }
  if(!filtered.length)results.append(node('p','검색 결과가 없습니다. 검색어를 줄이거나 필터를 초기화해 보세요.','empty-state'));
  more.hidden=limit>=filtered.length;
 }
 query.addEventListener('input',()=>{limit=30;render();});zone.addEventListener('change',()=>{universities();limit=30;render();});uni.addEventListener('change',()=>{limit=30;render();});
 $('subject-reset').addEventListener('click',()=>{query.value='';zone.value='';universities();limit=30;render();query.focus();});more.addEventListener('click',()=>{limit+=30;render();});universities();render();
})();
