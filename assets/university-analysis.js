/* Shared interactions for the 28 additional university analyses. */
(async function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = n => Number(n).toLocaleString('ko-KR');
  const count = n => n ? number(n) : '—';
  const sum = a => a.reduce((s,n) => s+n,0);
  const normalize = s => String(s).replace(/\s/g,'').toLowerCase();
  const pair = (a,b) => `<span class="old-number">${count(a)}</span><span class="count-arrow" aria-label="에서">→</span><span class="new-number">${count(b)}</span>`;
  const difference = n => `<span class="${n>0?'positive':n<0?'negative':'unchanged'}">${n>0?'+':''}${number(n)}</span>`;
  let data;
  try {
    const response = await fetch(document.body.dataset.analysisSource);
    if (!response.ok) throw new Error('자료를 불러오지 못했습니다.');
    data = await response.json();
  } catch (error) {
    $('department-status').textContent = '자료를 불러오지 못했습니다. 새로고침해 주세요.';
    $('department-body').innerHTML = '<tr><td class="filter-empty">네트워크 연결을 확인한 뒤 다시 열어 주세요. 위 전형별 설명은 계속 확인할 수 있습니다.</td></tr>';
    return;
  }
  let mode = 'current';
  const hasChange = r => r.before.some((n,i) => n!==r.after[i]);
  const maxCore = Math.max(...Object.values(data.totals).flatMap(t=>t.core),1);
  $('core-bars').innerHTML = data.chartColumns.map((c,i) => `<div class="core-bar"><span>${escape(c)}</span><div class="bar-track" aria-hidden="true"><i id="bar-${i}"></i></div><strong id="bar-count-${i}"></strong></div>`).join('');
  function showYear(year) {
    const t = data.totals[year];
    document.querySelectorAll('[data-year]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.year===String(year))));
    $('early-count').textContent = number(t.early);
    $('regular-count').textContent = number(t.regular);
    const sameScope = data.slug!=='uos';
    $('early-share').textContent = sameScope?(t.early/t.all*100).toFixed(1)+'%':'정원 내';
    $('regular-share').textContent = sameScope?(t.regular/t.all*100).toFixed(1)+'%':'정원 내·외';
    $('early-fill').style.width = (t.early/(t.early+t.regular)*100)+'%';
    $('total-label').textContent = sameScope?`${year}학년도 전체 ${number(t.all)}명`:`${year}학년도 총괄 · 모집별 범위 상이`;
    $('other-enrollment').textContent = t.other?` · 기타 모집 ${number(t.other)}명 포함`:'';
    t.core.forEach((n,i)=>{
      $('bar-'+i).style.width = (n/maxCore*100)+'%';
      $('bar-count-'+i).textContent = number(n);
    });
  }
  document.querySelectorAll('[data-year]').forEach(b=>b.addEventListener('click',()=>showYear(b.dataset.year)));
  showYear('2028');
  function renderChanges() {
    $('changes-body').innerHTML = data.changes.filter(r=>!$('changes-only').checked||r[3]!==false).map(r=>`<tr><td class="row-title">${escape(r[0])}</td><td class="previous">${escape(r[1])}</td><td class="current">${escape(r[2])}</td></tr>`).join('');
  }
  $('changes-only').addEventListener('change',renderChanges);
  renderChanges();
  function updateCollegeOptions() {
    const prior = $('college-filter').value;
    const items = mode==='compare'?data.comparisons:data.departments;
    const values = [...new Set(items.map(r=>r.college).filter(Boolean))];
    $('college-filter').innerHTML = '<option value="">전체</option>'+values.map(c=>`<option value="${escape(c)}">${escape(c)}</option>`).join('');
    if(values.includes(prior)) $('college-filter').value=prior;
    $('college-filter').disabled = values.length<2;
    $('college-label').textContent = data.comparisonType==='track'&&mode==='compare'?'비교 구분':values.some(c=>c.includes('대학'))?'단과대학':'자료 구분';
  }
  updateCollegeOptions();
  const groups = [...new Set(data.departments.flatMap(r=>(r.group||'').split('·')).filter(Boolean))];
  $('group-filter').disabled = groups.length===0;
  if(!groups.length) $('group-filter').innerHTML='<option value="">자료 미표기</option>';
  function renderDepartments() {
    const compare = mode==='compare';
    const columns = compare?data.compareColumns:data.columns;
    const items = compare?data.comparisons:data.departments;
    const q=normalize($('department-query').value),college=$('college-filter').value,group=$('group-filter').value;
    const rows = items.filter(r=>(!q||normalize(r.name+r.college+(r.note||'')).includes(q))&&(!college||r.college===college)&&(!group||compare||(r.group||'').split('·').includes(group))&&(!compare||!$('department-changes-only').checked||hasChange(r)));
    $('group-filter-field').hidden=compare;
    $('department-changes-control').hidden=!compare;
    $('department-table').classList.toggle('table-diff',compare);
    $('department-status').textContent = `${rows.length} / ${items.length}개 ${compare?(data.comparisonType==='track'?'전형':'비교 항목'):'모집단위'}`;
    const trackCompare=compare&&data.comparisonType==='track';
    $('department-caption').textContent=compare?`2027학년도와 2028학년도 ${trackCompare?'전형별':'모집단위별'} 모집인원 비교`:'2028학년도 핵심 전형 모집단위별 인원';
    const title=trackCompare?'전형':'모집단위';
    $('department-head').innerHTML = '<tr><th scope="col">'+title+'</th>'+columns.map(c=>`<th scope="col">${escape(c)}</th>`).join('')+(compare?'<th scope="col">수시 증감</th><th scope="col">정시 증감</th>':'<th scope="col">정시 모집군</th>')+'</tr>';
    const earlyDelta=r=>sum(r.after.slice(0,data.compareRegularStart))-sum(r.before.slice(0,data.compareRegularStart));
    const regularDelta=r=>sum(r.after.slice(data.compareRegularStart))-sum(r.before.slice(data.compareRegularStart));
    $('department-body').innerHTML = rows.length?rows.map(r=>'<tr><td>'+escape(r.name)+`<small>${escape(r.college)}</small>`+(r.note?`<small>${escape(r.note)}</small>`:'')+'</td>'+(compare?r.before.map((n,i)=>`<td>${pair(n,r.after[i])}</td>`).join('')+`<td>${difference(earlyDelta(r))}</td><td>${difference(regularDelta(r))}</td>`:r.counts.map(n=>`<td>${count(n)}</td>`).join('')+`<td>${r.group?escape(r.group.split('·').map(g=>g+'군').join('·')):groups.length?'—':'미표기'}</td>` )+'</tr>').join(''):`<tr><td colspan="${columns.length+(compare?3:2)}" class="filter-empty">검색 결과가 없습니다. 학과명이나 필터를 바꿔 보세요.</td></tr>`;
    const totals = key=>rows.reduce((a,r)=>a.map((n,i)=>n+r[key][i]),columns.map(()=>0));
    const after=totals(compare?'after':'counts'),before=compare?totals('before'):null;
    $('department-foot').innerHTML = '<tr><th scope="row">'+(rows.length===items.length?'전체':'검색 결과')+' 합계</th>'+(compare?before.map((n,i)=>`<td>${pair(n,after[i])}</td>`).join('')+`<td>${difference(earlyDelta({before,after}))}</td><td>${difference(regularDelta({before,after}))}</td>`:after.map(n=>`<td>${number(n)}</td>`).join('')+'<td>—</td>')+'</tr>';
    $('table-view-note').textContent=(compare?(trackCompare?'제공 자료의 비교 범위에 따라 전형별 인원을 표시합니다. 2027 모집단위별 수치를 추정하지 않았습니다. ':'각 칸은 2027 → 2028 인원입니다. 학과 개편·통합 행의 범위는 출처·비교 기준을 함께 확인하세요. '):'‘—’는 해당 전형 모집인원 없음. ')+data.tableNote;
  }
  document.querySelectorAll('[data-table-mode]').forEach(b=>b.addEventListener('click',()=>{
    mode=b.dataset.tableMode;
    document.querySelectorAll('[data-table-mode]').forEach(e=>e.setAttribute('aria-pressed',String(e===b)));
    updateCollegeOptions();renderDepartments();
  }));
  $('department-query').addEventListener('input',renderDepartments);
  ['college-filter','group-filter','department-changes-only'].forEach(id=>$(id).addEventListener('change',renderDepartments));
  $('reset-filters').addEventListener('click',()=>{
    ['department-query','college-filter','group-filter'].forEach(id=>$(id).value='');
    $('department-changes-only').checked=false;renderDepartments();
  });
  renderDepartments();
  const links=[...document.querySelectorAll('.section-nav a')];
  const sections=links.map(a=>document.querySelector(a.hash));
  let scheduled=false;
  function updateSection(){
    const current=sections.filter(s=>s.getBoundingClientRect().top<=130).at(-1)||sections[0];
    links.forEach(a=>{const active=a.hash==='#'+current.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});scheduled=false;
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateSection);}}, {passive:true});
  updateSection();
})();

