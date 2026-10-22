(() => {
 'use strict';
 const data = window.ATAA_SUBJECTS, $ = id => document.getElementById(id);
 const query=$('subject-query'), zone=$('subject-zone'), uni=$('subject-university'), results=$('subject-results');
 if (!data || !query) return;
 const norm=s=>s.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,'');
 const searchable=data.map(r=>norm([r.zone,r.region,r.university,r.department,r.core,r.recommended,r.note].join(' ')));
 const node=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
 const options=(select,values,label)=>{select.replaceChildren(new Option(label,''),...values.map(v=>new Option(v,v)));};
 options(zone,[...new Set(data.map(r=>r.zone))],'전체 권역');
 function universities(){options(uni,[...new Set(data.filter(r=>!zone.value||r.zone===zone.value).map(r=>r.university))].sort((a,b)=>a.localeCompare(b,'ko')),'전체 대학');}
 function render(){
  const tokens=query.value.trim().split(/\s+/).filter(Boolean).map(norm);
  const filtered=data.filter((r,i)=>(!zone.value||r.zone===zone.value)&&(!uni.value||r.university===uni.value)&&tokens.every(t=>searchable[i].includes(t)));
  $('subject-count').textContent=`검색 결과 ${filtered.length.toLocaleString()}개 / 전체 ${data.length.toLocaleString()}개`;
  const fragment=document.createDocumentFragment();
  let previousUniversity='';
  for(const r of filtered){
   const row=document.createElement('tr');
   if(previousUniversity && previousUniversity!==r.university)row.className='university-start';
   previousUniversity=r.university;
   row.append(node('td',r.zone),node('td',r.region),node('td',r.university));
   const department=node('th',r.department);department.scope='row';row.append(department);
   if(r.combined){const cell=node('td',r.core||'—');cell.colSpan=2;cell.className='combined-subjects';row.append(cell);}
   else row.append(node('td',r.core||'—'),node('td',r.recommended||'—'));
   row.append(node('td',r.note||'—'));fragment.append(row);
  }
  if(!filtered.length){const row=document.createElement('tr'),cell=node('td','검색 결과가 없습니다. 검색어를 줄이거나 필터를 초기화해 보세요.');cell.colSpan=7;cell.className='subject-empty';row.append(cell);fragment.append(row);}
  results.replaceChildren(fragment);
  document.querySelector('.subject-table-wrap').scrollTop=0;
 }
 query.addEventListener('input',render);
 zone.addEventListener('change',()=>{universities();render();});uni.addEventListener('change',render);
 $('subject-reset').addEventListener('click',()=>{query.value='';zone.value='';universities();render();query.focus();});
 universities();render();
})();
