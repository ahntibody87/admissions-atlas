(() => {
  'use strict';
  const M=window.GradePrediction, $=id=>document.getElementById(id);
  const number=id=>{const value=$(id).value.trim()===''?NaN:Number($(id).value);return id.includes('grade')||id==='table-highlight'?Math.round(value*100)/100:value;};
  const f=(n,d=2)=>n.toFixed(d), interval=(a,d=2)=>Math.abs(a[0]-a[1])<1e-9?f(a[0],d):`${f(a[0],d)}~${f(a[1],d)}`;
  let finalGrade=null, planResult=null;
  const planGrades=["2.00","2.00","2.00","2.00","2.00"], planCounts=["6","6","6","6","6"];
  function setHighlight(value) { $('table-highlight').value=f(value); }
  function el(tag,text,cls) { const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(cls)n.className=cls; return n; }
  function paragraph(box,text,cls) {box.append(el('p',text,cls));}
  function fail(box,error) {box.replaceChildren(el('h3','입력을 확인해 주세요'),el('p',error.message,'error'));}
  function stats(box,values) {const grid=el('div',undefined,'stat-grid');values.forEach(([label,value])=>{const cell=el('div');cell.append(el('span',label),el('strong',value));grid.append(cell);});box.append(grid);}
  function locationResult(box,grade,semesters) {
    const match=M.predict(grade,semesters);
    box.replaceChildren(el('p','9등급 추정값','label'));
    const value=el('p',f(match.nine),'result-number');value.append(el('small',' 등급'));box.append(value);
    stats(box,[['9등급 추정 구간',interval(match.range)],['추정 누적비 (상위)',`${f(match.percent)}%`]]);
    const bar=el('div',undefined,'result-bar'),fill=el('div');fill.style.width=`${match.percent}%`;bar.append(fill);box.append(bar);
  }
  function updatePosition() {
    [['position',3],['forecast',5]].forEach(([prefix,semesters])=>{
      try {locationResult($(prefix+'-result'),number(prefix+'-grade'),semesters);}
      catch(error){fail($(prefix+'-result'),error);}
      const value=number(prefix+'-grade');
      document.querySelectorAll(`[data-adjust="${prefix}"]`).forEach(button=>{
        button.disabled=!Number.isFinite(value)||value<1||value>5||(Number(button.dataset.delta)<0?value<=1:value>=5);
      });
    });
  }
  function renderSemesterInputs() {
    const completed=number('completed-semesters'),weighted=$('use-course-counts').checked;
    const fragment=document.createDocumentFragment();
    window.SemesterPlan.labels.forEach((label,i)=>{
      const row=el('div',undefined,'semester-row'+(i>=completed?' upcoming':''));
      const name=el('span',label,'semester-name');row.append(name);
      if(i<completed) {
        const input=el('input');input.type='number';input.id=`semester-grade-${i}`;input.min='1';input.max='5';input.step='0.01';input.inputMode='decimal';input.value=planGrades[i];input.required=true;
        input.setAttribute('aria-label',`${label} 평균 내신`);row.append(input);
      } else row.append(el('span','남은 학기','upcoming-label'));
      if(weighted) {
        const group=el('div',undefined,'course-count');const input=el('input');input.type='number';input.id=`semester-count-${i}`;input.min='1';input.max='100';input.step='1';input.value=planCounts[i];input.required=true;
        input.setAttribute('aria-label',`${label} ${i<completed?'반영':'예상 반영'} 과목 수`);group.append(input,el('span','과목'));row.append(group);
      }
      fragment.append(row);
    });
    $('semester-inputs').replaceChildren(fragment);
    $('plan-weight-note').textContent=weighted?'석차등급이 있는 과목만 세어 주세요. 남은 학기는 예상 과목 수를 입력합니다.':'학기별 과목 수가 같다고 가정합니다.';
    $('scenario-controls').disabled=completed===5;
    updateSemester();
  }
  function planInput() {
    const completed=number('completed-semesters');
    return {completed,grades:planGrades.slice(0,completed).map(v=>v.trim()===''?NaN:Math.round(Number(v)*100)/100),
      counts:$('use-course-counts').checked?planCounts.map(v=>v.trim()===''?NaN:Number(v)):[1,1,1,1,1],target:number('target-grade')};
  }
  function updateSemester() {
    const box=$('target-result');finalGrade=null;planResult=null;$('use-required').disabled=true;
    try {
      // The requirement does not depend on the exploratory future input.
      planResult=window.SemesterPlan.calculate({...planInput(),future:2});
      const r=planResult, target=number('target-grade');
      box.replaceChildren(el('span',r.remaining?`3학년 1학기까지 · ${r.remaining}학기 남음`:'5학기 성적 입력 완료','badge'));
      if(r.status==='impossible') {
        box.append(el('h3','입력한 성적으로는 목표에 도달하기 어렵습니다.'));
        paragraph(box,`남은 학기 모두 1.00이면 최종 ${f(r.best)}입니다.`);
      } else if(r.status.startsWith('complete-')) {
        box.append(el('h3',r.status==='complete-met'?'최종 목표를 달성했습니다.':'최종 목표에 도달하지 못했습니다.'));
        paragraph(box,`최종 평균 ${f(r.current)} · 목표 ${f(target)} 이하`);
      } else {
        box.append(el('h3','남은 학기에 필요한 평균 내신'));
        paragraph(box,`${f(r.safeRequired)} 이하`,'result-number');
        paragraph(box,r.status==='secured'?'남은 학기 모두 5.00이어도 목표 이하입니다.':`${r.remaining}학기 전체 평균 기준 · 목표 ${f(target)} 이하`,'result-caption');
        $('use-required').disabled=false;
      }
      const values=[['현재 누적 평균',r.current===null?'입력 전':f(r.current)],['최종 목표 내신',f(target)]];
      if(r.remaining)values.push(['남은 학기 모두 1등급 시',f(r.best)],['남은 학기 모두 5등급 시',f(r.worst)]);
      stats(box,values);
      updateScenario();
    } catch(error){fail(box,error);$('semester-result').replaceChildren();}
  }
  function updateScenario() {
    const box=$('semester-result');finalGrade=null;
    if(!planResult){box.replaceChildren();return;}
    try {
      const r=window.SemesterPlan.calculate({...planInput(),future:number('future-grade')});
      finalGrade=r.final;
      box.replaceChildren(el('h3',r.remaining?'예상 최종 내신':'최종 내신'));
      paragraph(box,f(finalGrade),'result-number');
      if(r.remaining)paragraph(box,`남은 ${r.remaining}학기 평균 ${f(number('future-grade'))} 가정`,'result-caption');
      const match=M.predict(Number(f(finalGrade)),5);
      stats(box,[['9등급 추정값',f(match.nine)],['추정 누적비 (상위)',`${f(match.percent)}%`]]);
    } catch(error){fail(box,error);}
  }
  function updateTable() {
    const semesters=$('table-basis').value==='forecast'?5:3,grade=number('table-highlight');
    const valid=Number.isFinite(grade)&&grade>=1&&grade<=5;
    const head=el('tr');['5등급제 평균','9등급 추정값','9등급 추정 구간','추정 누적비 (상위)'].forEach(h=>{const th=el('th',h);th.scope='col';head.append(th);});
    $('table-head').replaceChildren(head);
    $('table-caption').textContent=`${semesters}학기 기준 내신 비교`;
    $('table-description').textContent='';
    const grades=Array.from({length:81},(_,i)=>Number((1+i*.05).toFixed(2)));
    if(valid&&!grades.includes(grade))grades.push(grade);
    grades.sort((a,b)=>a-b);
    const body=document.createDocumentFragment();
    grades.forEach(g=>{
      const match=M.predict(g,semesters),selected=valid&&Math.abs(g-grade)<1e-9;
      const tr=el('tr',undefined,selected?'selected':'');
      [f(g),f(match.nine),interval(match.range),`${f(match.percent)}%`].forEach((value,i)=>{
        const cell=el(i===0?'th':'td',value);if(i===0)cell.scope='row';tr.append(cell);
      });
      body.append(tr);
    });
    $('table-body').replaceChildren(body);
    $('table-status').textContent=valid?`${f(grade)} 내신 강조`:'강조할 내신은 1.00~5.00 사이로 입력해 주세요.';
  }
  function compareChange(prefix) {
    updatePosition();
    const value=number(prefix+'-grade');
    if(Number.isFinite(value)&&value>=1&&value<=5) {
      $(prefix+'-range').value=String(value);
      setHighlight(value);$('table-basis').value=prefix==='position'?'observed':'forecast';updateTable();
    }
  }
  ['position','forecast'].forEach(prefix=>{
    $(prefix+'-form').addEventListener('submit',e=>{e.preventDefault();compareChange(prefix);});
    $(prefix+'-grade').addEventListener('input',()=>compareChange(prefix));
    $(prefix+'-range').addEventListener('input',()=>{
      $(prefix+'-grade').value=f(Number($(prefix+'-range').value));compareChange(prefix);
    });
  });
  document.querySelectorAll('[data-adjust]').forEach(button=>button.addEventListener('click',()=>{
    const prefix=button.dataset.adjust,value=number(prefix+'-grade');
    if(!Number.isFinite(value)||value<1||value>5)return;
    $(prefix+'-grade').value=f(Math.max(1,Math.min(5,value+Number(button.dataset.delta))));compareChange(prefix);
  }));
  $('compare-same-grade').addEventListener('click',()=>{
    const value=number('position-grade');
    if(!Number.isFinite(value)||value<1||value>5)return;
    $('forecast-grade').value=f(value);compareChange('forecast');
  });
  $('semester-form').addEventListener('submit',e=>{e.preventDefault();updateSemester();});
  $('completed-semesters').addEventListener('change',renderSemesterInputs);
  $('use-course-counts').addEventListener('change',renderSemesterInputs);
  $('semester-inputs').addEventListener('input',event=>{
    const id=event.target.id;
    if(id.startsWith('semester-grade-'))planGrades[Number(id.split('-').at(-1))]=event.target.value;
    if(id.startsWith('semester-count-'))planCounts[Number(id.split('-').at(-1))]=event.target.value;
    updateSemester();
  });
  $('target-grade').addEventListener('input',updateSemester);
  $('future-range').addEventListener('input',()=>{$('future-grade').value=f(Number($('future-range').value));updateScenario();});
  $('future-grade').addEventListener('input',()=>{if(Number.isFinite(number('future-grade')))$('future-range').value=String(number('future-grade'));updateScenario();});
  $('use-required').addEventListener('click',()=>{
    if(!planResult||planResult.safeRequired===null)return;
    $('future-grade').value=f(planResult.safeRequired);$('future-range').value=String(planResult.safeRequired);updateScenario();
  });
  $('table-basis').addEventListener('input',updateTable);
  $('table-highlight').addEventListener('input',updateTable);
  $('apply-simulation').addEventListener('click',()=>{
    if(finalGrade===null){$('table-status').textContent='먼저 시뮬레이션 입력 오류를 수정해 주세요.';return;}
    setHighlight(finalGrade);$('table-basis').value='forecast';updateTable();
  });
  document.addEventListener('focusout',event=>{
    const input=event.target;
    if(input.matches('input[type="number"][step="0.01"]')&&input.value.trim()!==''&&Number.isFinite(Number(input.value)))input.value=f(number(input.id));
  });
  updatePosition();renderSemesterInputs();updateTable();
})();
