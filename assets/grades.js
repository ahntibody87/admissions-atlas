(() => {
  'use strict';
  const M=window.GradeModel, $=id=>document.getElementById(id);
  const number=id=>$(id).value.trim()===''?NaN:Number($(id).value);
  const f=(n,d=2)=>n.toFixed(d), interval=(a,d=2)=>Math.abs(a[0]-a[1])<1e-9?f(a[0],d):`${f(a[0],d)}~${f(a[1],d)}`;
  let finalGrade=null;
  function setHighlight(value) { $('table-highlight').value=f(value,3); $('table-highlight').dataset.exact=String(value); }
  function el(tag,text,cls) { const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(cls)n.className=cls; return n; }
  function paragraph(box,text,cls) {box.append(el('p',text,cls));}
  function fail(box,error) {box.replaceChildren(el('h3','입력을 확인해 주세요'),el('p',error.message,'error'));}
  function stats(box,values) {const grid=el('div',undefined,'stat-grid');values.forEach(([label,value])=>{const cell=el('div');cell.append(el('span',label),el('strong',value));grid.append(cell);});box.append(grid);}
  function locationResult(box,grade,system,basis) {
    const prediction=basis==='forecast', match=prediction?M.lookupForecast(grade,system):M.lookupObserved(grade,system);
    const other=system===5?9:5;
    box.replaceChildren(el('span',prediction?'5학기 예측 · 상위 30%까지만':'경기 실측 · 고2 1학기까지','badge'));
    box.append(el('h3',`${system}등급제 평균 ${f(grade,3)}의 자료상 위치`));
    if(!match) {
      paragraph(box,prediction?'입력값에 대응하는 예측 구간이 없습니다. 원자료의 범위를 넘어 누적비나 대응 등급을 추정하지 않습니다.':'입력값에 대응하는 실측 환산 구간이 없습니다. 원자료에 없는 값을 연장하지 않습니다.');
      paragraph(box,prediction?'5등급제 예측 범위: 1.00~2.41 / 9등급제 참고 범위: 1.00~4.08.':'9등급제 대응 참고값의 범위: 1.00~8.97.','help');return;
    }
    paragraph(box,prediction?'자료에 해당하는 예상 상위 누적비':'표본의 상위 누적비 구간','label');
    paragraph(box,`${interval(match.percent)}%`,'result-number');
    const bar=el('div',undefined,'result-bar'),fill=el('div');fill.style.width=`${match.percent[1]}%`;bar.append(fill);box.append(bar);
    stats(box,[[`${other}등급제 대응 참고 구간`,interval(match.grade)],[prediction?'비교 기준':'표본 범위',prediction?'5학기 AI 예측':'경기 협력교']]);
    if(prediction) {
      paragraph(box,'원고의 등급 범위에 겹쳐 들어가는 누적비 행들을 묶었습니다. 이 범위는 합격 확률이나 통계적 신뢰구간이 아닙니다.','help');
      if(match.edge)paragraph(box,'상위 1% 또는 30% 경계에 해당합니다. 자료 밖으로 이어지는 누적비는 판단할 수 없습니다.','help');
    } else {
      paragraph(box,match.exact?'해당 경계까지의 누적비입니다. 동점자가 포함되어 개인의 정확한 석차와 다를 수 있습니다.':'표에 없는 중간값이므로 인접한 두 경계의 범위로 표시했습니다. 정확한 누적비를 선형 보간하지 않습니다.','help');
      paragraph(box,'다른 학기나 학점 가중 평균을 넣었다면 동일 기준의 위치가 아닙니다. 이 수치를 전국 석차나 대학 합격선으로 해석하지 마세요.','help');
    }
  }
  function updatePosition() {
    try {locationResult($('position-result'),number('position-grade'),number('position-system'),$('position-basis').value);}
    catch(error){fail($('position-result'),error);}
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
      const metric=el('p',f(finalGrade,3),'result-number');metric.append(el('small',' 등급'));box.append(metric);
      paragraph(box,`고2까지 ${f(current,3)} → 고3 1학기 ${f(future,3)} · ${mode==='courses'?'단순':'학점 가중'} 평균`);
      const delta=finalGrade-current;
      paragraph(box,Math.abs(delta)<1e-9?'현재 누적 평균이 유지됩니다.':`현재보다 등급 숫자가 ${f(Math.abs(delta),3)} ${delta>0?'커집니다 (성적 하락).':'작아집니다 (성적 상승).'}`,'result-caption');
      const alternatives=el('div',undefined,'mini-scenarios');
      [Math.max(1,future-.5),future,Math.min(5,future+.5)].forEach((value,i)=>{const cell=el('div');cell.append(el('small',`${['더 좋은 성적','입력한 성적','더 낮은 성적'][i]} ${f(value)}`),el('strong',f(M.combine(current,cw,value,fw),3)));alternatives.append(cell);});
      box.append(alternatives);
      if(mode==='courses') {
        const match=M.lookupForecast(finalGrade);
        stats(box,[['자료상 예상 누적비',match?`${interval(match.percent)}%`:'예측 자료 범위 밖'],['9등급제 대응 참고',match?interval(match.grade):'표시하지 않음']]);
        paragraph(box,'국영수사과 단순 평균일 때만 예측 조견표와 기준이 같습니다. 예상 누적비는 관측 석차가 아닙니다. 계산은 반올림 전 값으로 하며 표 강조도 같은 값을 사용합니다.','help');
        if(match&&match.edge)paragraph(box,'예측표의 상위 1% 또는 30% 경계에 해당해 자료 밖의 위치는 판단할 수 없습니다.','help');
      } else paragraph(box,'학점 가중 평균은 원자료의 단순 평균과 기준이 달라 누적비·대응 9등급을 붙이지 않습니다. 대학별 환산점수는 별도 반영 기준이 필요합니다.','help');
      if(mode==='courses')setHighlight(finalGrade);
    } catch(error) {fail(box,error);}
    updateTarget();updateTable();
  }
  function updateTarget() {
    const box=$('target-result');
    try {
      const {current,cw,fw,mode}=inputState(),target=number('target-grade'),r=M.required(current,cw,target,fw);
      $('target-context').textContent=`고2까지 ${f(current,3)} / 기존 ${cw}${mode==='courses'?'과목':'학점'} + 고3 1학기 ${fw}${mode==='courses'?'과목':'학점'}`;
      box.replaceChildren(el('span',`목표 최종 ${f(target,3)} 이하`,'badge'));
      if(r.status==='impossible') {
        box.append(el('h3','현재 조건에서는 목표에 도달하기 어렵습니다.'));
        paragraph(box,`고3 1학기 모두 1등급이면 최종 ${f(r.best,3)}입니다. 목표보다 등급 숫자가 큽니다.`);
        paragraph(box,'현재 누적 성적과 과목 수/학점을 다시 확인하거나 최종 목표를 조정해 보세요.','help');
      } else if(r.status==='secured') {
        box.append(el('h3','모든 과목이 5등급이어도 목표 이하입니다.'));
        paragraph(box,`입력한 조건에서 가장 낮은 성적을 받는 경우 최종 ${f(r.worst,3)}입니다.`);
      } else {
        box.append(el('h3','필요한 고3 1학기 평균 내신'));
        // Floor the displayed ceiling so it never recommends a value above the actual target boundary.
        const safe=Math.floor((r.value+1e-10)*1000)/1000;
        paragraph(box,`${f(safe,3)} 이하`,'result-number');
        paragraph(box,'목표를 넘지 않도록 소수점 셋째 자리에서 버림한 값입니다. 이보다 등급 숫자가 작으면 목표에 도달합니다.','help');
        if(mode==='courses') {
          const base=Math.min(4,Math.floor(r.value+1e-9)),worse=Math.min(fw,Math.floor((r.value-base)*fw+1e-9));
          const example=(base*(fw-worse)+(base+1)*worse)/fw;
          paragraph(box,`등급 구성 예시: ${base}등급 ${fw-worse}과목 + ${base+1}등급 ${worse}과목 → 고3 평균 ${f(example,3)}, 최종 ${f(M.combine(current,cw,example,fw),3)}. 이 두 등급만 조합할 때 가능한 예시입니다.`,'context');
        } else paragraph(box,'학점별 비중이 다르므로 과목 개수만으로 등급 구성 예시를 만들지 않습니다.','help');
      }
      stats(box,[['전 과목 1등급 시',f(r.best,3)],['전 과목 5등급 시',f(r.worst,3)]]);
    } catch(error) {$('target-context').textContent='위 시뮬레이션의 현재 성적·반영량을 확인해 주세요.';fail(box,error);}
  }
  function updateTable() {
    const prediction=$('table-basis').value==='forecast',grade=$('table-highlight').dataset.exact?Number($('table-highlight').dataset.exact):number('table-highlight'),valid=Number.isFinite(grade)&&grade>=1&&grade<=5;
    const headers=prediction?['예상 상위 누적비','5등급제 예상 내신','9등급제 참고 내신']:['5등급제 평균 (이하)','실측 상위 누적비','대응 9등급제 참고값'];
    const head=el('tr');headers.forEach(h=>{const th=el('th',h);th.scope='col';head.append(th);});$('table-head').replaceChildren(head);
    $('table-caption').textContent=prediction?'윤희태 세미나 원고 53쪽 · 5학기 AI 예측 조견표':'경기진협 0922 최종 자료 표 1 · 국영수사과 단순 평균';
    $('table-description').textContent=prediction?'상위 1~30%에 대응하는 예측 범위입니다. 인접 구간이 겹치므로 한 내신이 여러 행에 해당할 수 있습니다. 전국 실측 순위나 대학 합격선이 아닙니다.':'고2 1학기까지 경기 협력교 106개교·26,511명의 표본입니다. 9등급제 대응값은 별도 고3 표본의 누적비에 대한 추정치입니다. 고2 2학기 이후 위치는 이 표로 확정할 수 없습니다.';
    const rows=prediction?M.forecast:M.observed,body=document.createDocumentFragment();let count=0;
    let observedMatch=null;
    if(valid&&!prediction)observedMatch=M.lookupObserved(grade);
    rows.forEach(row=>{
      const selected=valid&&(prediction?grade>=row[1]-1e-9&&grade<=row[2]+1e-9:observedMatch&&row[1]>=observedMatch.percent[0]-1e-9&&row[1]<=observedMatch.percent[1]+1e-9);
      const tr=el('tr',undefined,selected?'selected':'');if(selected)count++;
      const values=prediction?[`${row[0]}%`,`${f(row[1])}~${f(row[2])}`,`${f(row[3])}~${f(row[4])}`]:[f(row[0],3),`${f(row[1])}%`,f(row[2])];
      values.forEach((value,i)=>{const cell=el(i===0?'th':'td',value);if(i===0)cell.scope='row';tr.append(cell);});body.append(tr);
    });
    $('table-body').replaceChildren(body);
    const weighted=$('weight-mode').value==='credits';
    $('table-status').textContent=!valid?'강조할 내신은 1~5 사이의 숫자로 입력해 주세요.':`${f(grade,3)} 기준 · ${count?count+'개 참고 행 강조':'해당 자료 구간 없음'}${weighted?' · 현재 시뮬레이션은 학점 가중이므로 자동 연결하지 않습니다.':''}`;
  }
  function modeLabels() {
    const credits=$('weight-mode').value==='credits';
    $('current-weight-label').textContent=`기존 반영 ${credits?'학점 합':'과목 수'}`;
    $('future-weight-label').textContent=`고3 1학기 반영 ${credits?'학점 합':'과목 수'}`;
    $('weight-help').textContent=credits?'현재·예상 내신은 같은 반영 교과 범위의 학점 가중 평균을 입력하세요. 과목 수를 학점 합으로 바꾸고, 석차등급 없는 과목의 학점은 빼 주세요. 단순 평균 자료의 누적비와 연결하지 않습니다.':'현재·예상 내신은 같은 반영 교과 범위의 단순 평균이어야 합니다. 석차등급 없는 과목은 포함하지 마세요. 과목마다 따로 평균을 내며 학기 평균끼리 단순히 더하지 않습니다.';
  }
  $('position-form').addEventListener('submit',e=>{e.preventDefault();updatePosition();});
  $('position-system').addEventListener('change',()=>{$('position-grade').max=$('position-system').value;updatePosition();});
  ['position-grade','position-basis'].forEach(id=>$(id).addEventListener('input',updatePosition));
  $('semester-form').addEventListener('submit',e=>{e.preventDefault();updateSemester();});
  ['current-grade','current-weight','future-weight'].forEach(id=>$(id).addEventListener('input',updateSemester));
  $('weight-mode').addEventListener('change',()=>{modeLabels();updateSemester();});
  $('future-range').addEventListener('input',()=>{$('future-grade').value=$('future-range').value;updateSemester();});
  $('future-grade').addEventListener('input',()=>{if(Number.isFinite(number('future-grade')))$('future-range').value=$('future-grade').value;updateSemester();});
  $('target-form').addEventListener('submit',e=>{e.preventDefault();updateTarget();});$('target-grade').addEventListener('input',updateTarget);
  $('table-basis').addEventListener('input',updateTable);
  $('table-highlight').addEventListener('input',()=>{delete $('table-highlight').dataset.exact;updateTable();});
  $('apply-simulation').addEventListener('click',()=>{
    if(finalGrade===null){$('table-status').textContent='먼저 시뮬레이션 입력 오류를 수정해 주세요.';return;}
    if($('weight-mode').value==='credits'){$('table-status').textContent='학점 가중 평균은 단순 평균 자료의 누적비와 연결할 수 없습니다. 단순 평균으로 계산해 주세요.';return;}
    setHighlight(finalGrade);$('table-basis').value='forecast';updateTable();
  });
  modeLabels();updatePosition();updateSemester();
})();
