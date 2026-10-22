(function () {
  'use strict';
  const data = window.ATAA_KONKUK;
  const $ = id => document.getElementById(id);
  const number = n => n.toLocaleString('ko-KR');
  const count = n => n ? number(n) : '—';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pair = (a,b) => `<span class="old-number">${count(a)}</span><span class="count-arrow" aria-label="에서">→</span><span class="new-number">${count(b)}</span>`;
  const difference = n => `<span class="${n>0?'positive':n<0?'negative':'unchanged'}">${n>0?'+':''}${number(n)}</span>`;
  const sum = values => values.reduce((a,b)=>a+b,0);
  let mode = 'current';

  $('core-bars').innerHTML = data.columns.map((name,i)=>`<div class="core-bar"><span>${escape(name)}</span><div class="bar-track" aria-hidden="true"><i id="bar-${i}"></i></div><strong id="bar-count-${i}"></strong></div>`).join('');
  function showYear(year) {
    const entry = data.totals[year];
    document.querySelectorAll('[data-year]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.year===String(year))));
    $('early-count').textContent = number(entry.early);
    $('regular-count').textContent = number(entry.regular);
    $('early-share').textContent = entry.earlyPercent+'%';
    $('regular-share').textContent = entry.regularPercent+'%';
    $('early-fill').style.width = entry.earlyPercent+'%';
    $('total-label').textContent = `${year}학년도 전체 ${number(entry.all)}명`;
    entry.core.forEach((n,i)=>{
      $('bar-'+i).style.width = (n/1100*100)+'%';
      $('bar-count-'+i).textContent = number(n);
    });
  }
  document.querySelectorAll('[data-year]').forEach(b=>b.addEventListener('click',()=>showYear(b.dataset.year)));
  showYear('2028');

  function renderChanges() {
    $('changes-body').innerHTML = data.changes.filter(r=>!$('changes-only').checked||r.changed).map(r=>`<tr><td class="row-title">${escape(r.name)}<br><span class="pill">${escape(r.topic)}</span></td><td class="previous">${escape(r.before)}</td><td class="current">${escape(r.after)}</td></tr>`).join('');
  }
  $('changes-only').addEventListener('change',renderChanges);
  renderChanges();
  [...new Set(data.departments.map(r=>r.college))].forEach(college=>{
    const option = document.createElement('option');
    option.value=college; option.textContent=college; $('college-filter').append(option);
  });

  function renderDepartments() {
    const compare = mode==='compare';
    const items = compare?data.comparisons:data.departments;
    const rows = data.filterRows(items,{
      query:$('department-query').value,college:$('college-filter').value,
      group:compare?'':$('group-filter').value,changedOnly:compare&&$('department-changes-only').checked
    });
    $('group-filter-field').hidden=compare;
    $('department-changes-control').hidden=!compare;
    $('department-table').classList.toggle('table-diff',compare);
    $('department-status').textContent = `${rows.length} / ${items.length}개 ${compare?'비교 항목':'모집단위'}`;
    $('department-caption').textContent = compare?'2027학년도에서 2028학년도 핵심 전형 인원 비교':'2028학년도 핵심 전형 모집단위별 인원';
    $('department-head').innerHTML = '<tr><th scope="col">모집단위</th>'+data.columns.map(c=>`<th scope="col">${escape(c)}</th>`).join('')+(compare?'<th scope="col">수시 증감</th><th scope="col">정시 증감</th>':'<th scope="col">정시 모집군</th>')+'</tr>';
    $('department-body').innerHTML = rows.length?rows.map(r=>{
      const title = `<td>${escape(r.name)}<small>${escape(r.college)}</small>${compare&&r.note?`<small>${escape(r.note)}</small>`:''}</td>`;
      const cells = compare?r.before.map((v,i)=>`<td>${pair(v,r.after[i])}</td>`).join('')+`<td>${difference(sum(r.after.slice(0,3))-sum(r.before.slice(0,3)))}</td><td>${difference(r.after[3]-r.before[3])}</td>`:r.counts.map(n=>`<td>${count(n)}</td>`).join('')+`<td>${r.group?r.group+'군':'—'}</td>`;
      return '<tr>'+title+cells+'</tr>';
    }).join(''):`<tr><td colspan="${compare?7:6}" class="filter-empty">검색 결과가 없습니다. 학과명이나 필터를 바꿔 보세요.</td></tr>`;
    const totals = key => rows.reduce((acc,r)=>acc.map((n,i)=>n+r[key][i]),[0,0,0,0]);
    const after = totals(compare?'after':'counts');
    const before = compare?totals('before'):null;
    $('department-foot').innerHTML = `<tr><th scope="row">${rows.length===items.length?'전체':'검색 결과'} 합계</th>`+(compare?before.map((n,i)=>`<td>${pair(n,after[i])}</td>`).join('')+`<td>${difference(sum(after.slice(0,3))-sum(before.slice(0,3)))}</td><td>${difference(after[3]-before[3])}</td>`:after.map(n=>`<td>${number(n)}</td>`).join('')+'<td>—</td>')+'</tr>';
    $('table-view-note').textContent = compare?'각 칸은 2027 → 2028 인원입니다. 수시 증감은 핵심 3개 전형 합계입니다. 학과 개편으로 합산하거나 별도 표시한 행은 아래 설명을 함께 확인하세요.':'‘—’는 해당 전형 모집인원 없음. 문과대학 학과는 정시 KU일반을 별도 선발하지 않고 문과대학자유전공학부로 선발합니다.';
  }
  document.querySelectorAll('[data-table-mode]').forEach(b=>b.addEventListener('click',()=>{
    mode=b.dataset.tableMode;
    document.querySelectorAll('[data-table-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));
    renderDepartments();
  }));
  $('department-query').addEventListener('input',renderDepartments);
  ['college-filter','group-filter','department-changes-only'].forEach(id=>$(id).addEventListener('change',renderDepartments));
  $('reset-filters').addEventListener('click',()=>{
    ['department-query','college-filter','group-filter'].forEach(id=>$(id).value='');
    $('department-changes-only').checked=false;renderDepartments();
  });
  renderDepartments();
  const links = [...document.querySelectorAll('.section-nav a')];
  const sections = links.map(a=>document.querySelector(a.hash));
  let scheduled=false;
  function updateSection() {
    const current = sections.filter(s=>s.getBoundingClientRect().top<=130).at(-1)||sections[0];
    links.forEach(a=>{
      const active=a.hash==='#'+current.id;
      a.classList.toggle('active',active);
      if(active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
    });
    scheduled=false;
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateSection);}}, {passive:true});
  updateSection();
})();
