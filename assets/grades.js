(() => {
  'use strict';
  const M=window.GradePrediction, $=id=>document.getElementById(id);
  const number=id=>{const value=$(id).value.trim()===''?NaN:Number($(id).value);return id.includes('grade')||id==='table-highlight'?Math.round(value*100)/100:value;};
  const f=(n,d=2)=>n.toFixed(d), interval=(a,d=2)=>Math.abs(a[0]-a[1])<1e-9?f(a[0],d):`${f(a[0],d)}~${f(a[1],d)}`;
  let finalGrade=null;
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
  function inputState() {
    const current=number('current-grade'),cw=number('current-weight'),fw=number('future-weight'),mode=$('weight-mode').value;
    M.combine(current,cw,1,fw);
    if(!Number.isInteger(cw)||!Number.isInteger(fw))throw new Error('반영 과목 수와 학점 합은 양의 정수로 입력해 주세요.');
    return {current,cw,fw,mode};
  }
  function updateSemester() {
    const box=$('semester-result');finalGrade=null;
    try {
      const {current,cw,fw,mode}=inputState(),future=number('future-grade');
      finalGrade=M.combine(current,cw,future,fw);
      box.replaceChildren(el('span','3학년 1학기까지 · 5등급제','badge'),el('h3','예상 최종 평균 내신'));
      const metric=el('p',f(finalGrade),'result-number');metric.append(el('small',' 등급'));box.append(metric);
      paragraph(box,`고2까지 ${f(current)} → 고3 1학기 ${f(future)} · ${mode==='courses'?'단순':'학점 가중'} 평균`);
      const delta=finalGrade-current;
      paragraph(box,Math.abs(delta)<1e-9?'현재 누적 평균이 유지됩니다.':`현재보다 등급 숫자가 ${f(Math.abs(delta))} ${delta>0?'커집니다 (성적 하락).':'작아집니다 (성적 상승).'}`,'result-caption');
      const alternatives=el('div',undefined,'mini-scenarios');
      [Math.max(1,future-.5),future,Math.min(5,future+.5)].forEach((value,i)=>{const cell=el('div');cell.append(el('small',`${['더 좋은 성적','입력한 성적','더 낮은 성적'][i]} ${f(value)}`),el('strong',f(M.combine(current,cw,value,fw))));alternatives.append(cell);});
      box.append(alternatives);
      if(mode==='courses') {
        const match=M.predict(Number(f(finalGrade)),5);
        stats(box,[['9등급 추정값',f(match.nine)],['9등급 추정 구간',interval(match.range)],['추정 누적비 (상위)',`${f(match.percent)}%`]]);
      } else paragraph(box,'학점 가중 평균은 원자료의 단순 평균과 기준이 달라 누적비·대응 9등급을 붙이지 않습니다. 대학별 환산점수는 별도 반영 기준이 필요합니다.','help');
    } catch(error) {fail(box,error);}
    updateTarget();updateTable();
  }
  function updateTarget() {
    const box=$('target-result');
    try {
      const {current,cw,fw,mode}=inputState(),target=number('target-grade'),r=M.required(current,cw,target,fw);
      $('target-context').textContent=`고2까지 ${f(current)} / 기존 ${cw}${mode==='courses'?'과목':'학점'} + 고3 1학기 ${fw}${mode==='courses'?'과목':'학점'}`;
      box.replaceChildren(el('span',`목표 최종 ${f(target)} 이하`,'badge'));
      if(r.status==='impossible') {
        box.append(el('h3','현재 조건에서는 목표에 도달하기 어렵습니다.'));
        paragraph(box,`고3 1학기 모두 1등급이면 최종 ${f(r.best)}입니다. 목표보다 등급 숫자가 큽니다.`);
        paragraph(box,'현재 누적 성적과 과목 수/학점을 다시 확인하거나 최종 목표를 조정해 보세요.','help');
      } else if(r.status==='secured') {
        box.append(el('h3','모든 과목이 5등급이어도 목표 이하입니다.'));
        paragraph(box,`입력한 조건에서 가장 낮은 성적을 받는 경우 최종 ${f(r.worst)}입니다.`);
      } else {
        box.append(el('h3','필요한 고3 1학기 평균 내신'));
        // Floor the displayed ceiling so it never recommends a value above the actual target boundary.
        const safe=Math.floor((r.value+1e-10)*100)/100;
        paragraph(box,`${f(safe)} 이하`,'result-number');
        paragraph(box,'목표를 넘지 않도록 소수점 둘째 자리까지 남기고 버림한 값입니다. 이보다 등급 숫자가 작으면 목표에 도달합니다.','help');
        if(mode==='courses') {
          const base=Math.min(4,Math.floor(r.value+1e-9)),worse=Math.min(fw,Math.floor((r.value-base)*fw+1e-9));
          const example=(base*(fw-worse)+(base+1)*worse)/fw;
          paragraph(box,`등급 구성 예시: ${base}등급 ${fw-worse}과목 + ${base+1}등급 ${worse}과목 → 고3 평균 ${f(example)}, 최종 ${f(M.combine(current,cw,example,fw))}. 이 두 등급만 조합할 때 가능한 예시입니다.`,'context');
        } else paragraph(box,'학점별 비중이 다르므로 과목 개수만으로 등급 구성 예시를 만들지 않습니다.','help');
      }
      stats(box,[['전 과목 1등급 시',f(r.best)],['전 과목 5등급 시',f(r.worst)]]);
    } catch(error) {$('target-context').textContent='위 시뮬레이션의 현재 성적·반영량을 확인해 주세요.';fail(box,error);}
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
  function modeLabels() {
    const credits=$('weight-mode').value==='credits';
    $('current-weight-label').textContent=`기존 반영 ${credits?'학점 합':'과목 수'}`;
    $('future-weight-label').textContent=`고3 1학기 반영 ${credits?'학점 합':'과목 수'}`;
    $('weight-help').textContent=credits?'현재·예상 내신은 같은 반영 교과 범위의 학점 가중 평균을 입력하세요. 과목 수를 학점 합으로 바꾸고, 석차등급 없는 과목의 학점은 빼 주세요. 단순 평균 자료의 누적비와 연결하지 않습니다.':'현재·예상 내신은 같은 반영 교과 범위의 단순 평균이어야 합니다. 석차등급 없는 과목은 포함하지 마세요. 과목마다 따로 평균을 내며 학기 평균끼리 단순히 더하지 않습니다.';
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
  ['current-grade','current-weight','future-weight'].forEach(id=>$(id).addEventListener('input',updateSemester));
  $('weight-mode').addEventListener('change',()=>{modeLabels();updateSemester();});
  $('future-range').addEventListener('input',()=>{$('future-grade').value=f(Number($('future-range').value));updateSemester();});
  $('future-grade').addEventListener('input',()=>{if(Number.isFinite(number('future-grade')))$('future-range').value=$('future-grade').value;updateSemester();});
  $('target-form').addEventListener('submit',e=>{e.preventDefault();updateTarget();});$('target-grade').addEventListener('input',updateTarget);
  $('table-basis').addEventListener('input',updateTable);
  $('table-highlight').addEventListener('input',updateTable);
  $('apply-simulation').addEventListener('click',()=>{
    if(finalGrade===null){$('table-status').textContent='먼저 시뮬레이션 입력 오류를 수정해 주세요.';return;}
    if($('weight-mode').value==='credits'){$('table-status').textContent='학점 가중 평균은 단순 평균 자료의 누적비와 연결할 수 없습니다. 단순 평균으로 계산해 주세요.';return;}
    setHighlight(finalGrade);$('table-basis').value='forecast';updateTable();
  });
  document.querySelectorAll('input[type="number"][step="0.01"]').forEach(input=>input.addEventListener('blur',()=>{
    if(input.value.trim()!==''&&Number.isFinite(Number(input.value)))input.value=f(Number(input.value));
  }));
  modeLabels();updatePosition();updateSemester();
})();

