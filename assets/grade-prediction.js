/* ATAA prediction model, 2026-10-29.
 * Source transcription and modelling assumptions: docs/grade-prediction.md.
 * Cumulative percentages use percentage points (0..100), not fractions.
 * This is a model built from heterogeneous guidance materials, not a national rank.
 */
(function (root) {
  'use strict';
  const legacy = typeof module !== 'undefined' && module.exports ? require('./grade-model.js') : root.GradeModel;
  const counts = Object.freeze({gyeonggi:26511,busan:15978,seoul:5000,gyeonggiNine:13896,busanNine:15670});
  const gyeonggi = [...legacy.observed.map(r=>[...r]),[1.059,1.169,null],[1.111,1.72,null],[1.389,4.92,null]].sort((a,b)=>a[0]-b[0]);
  const busan = [
    [1,.68,1.28],[1.04,1.01,1.38],[1.08,1.40,1.47],[1.16,2.23,1.68],
    [1.24,3.16,1.87],[1.33,4.29,2.07],[1.42,5.44,2.25],[1.5,6.49,2.39],
    [1.66,8.89,2.66],[1.83,12.41,2.98],[2,16.58,3.30],[2.16,20.64,3.58],
    [2.33,25.45,3.87],[2.5,31,4.18],[2.66,36.37,4.45],[2.83,42.75,4.72],
    [3,49.96,5.03],[3.16,56.15,5.30],[3.33,62.92,5.58],[3.5,69.29,5.87],
    [3.66,74.93,6.12],[3.83,80.30,6.40],[4,85.54,6.71],[4.16,89.21,6.99],
    [4.33,92.51,7.28],[4.5,94.58,7.54],[4.66,96.16,7.80],[4.83,97.48,8.12],[5,100,9]
  ];
  const seoulThree = [.49,1.88,3.07,4.25,5.77,7.12,8.77,10.82,13.06,15.30,17.88,20.68,23.65,26.85,30.47,32.98,36.51,40.17,44.03,47.20,51.06];
  const seoulFive = [.17,1.35,2.10,3.61,4.85,6.09,7.64,9.92,11.17,14.42,16.31,20.05,22.24,24.81,30.17,31.61,34.78,39.17,43.89,47.20,50.26];
  const seoul = seoulThree.map((p,i)=>[Number((1+i/10).toFixed(2)),p,seoulFive[i]]);
  function bracket(rows,x,column=0) {
    if(x<=rows[0][column])return [rows[0],rows[0]];
    for(let i=1;i<rows.length;i++) {
      if(x===rows[i][column])return [rows[i],rows[i]];
      if(x<rows[i][column])return [rows[i-1],rows[i]];
    }
    return [rows.at(-1),rows.at(-1)];
  }
  function interpolate(rows,x,column=1,key=0) {
    const [lo,hi]=bracket(rows,x,key);
    return lo[key]===hi[key]?lo[column]:lo[column]+(x-lo[key])/(hi[key]-lo[key])*(hi[column]-lo[column]);
  }
  const regionalPair = grade => (counts.gyeonggi*interpolate(gyeonggi,grade)+counts.busan*interpolate(busan,grade))/(counts.gyeonggi+counts.busan);
  const pairAtThree=regionalPair(3), total=counts.gyeonggi+counts.busan+counts.seoul;
  // Allocate the remaining Seoul population according to the conditional Gyeonggi/Busan tail.
  const tailProgress=grade=>(regionalPair(grade)-pairAtThree)/(100-pairAtThree);
  function seoulCdf(grade) {
    return grade<=3?interpolate(seoul,grade):51.06+(100-51.06)*tailProgress(grade);
  }
  function currentCdf(grade) {
    return ((counts.gyeonggi+counts.busan)*regionalPair(grade)+counts.seoul*seoulCdf(grade))/total;
  }
  const futureAtThree=currentCdf(3)*50.26/51.06;
  function futureCdf(grade) {
    // Preserve the source-relative semester change through grade 3; extend remaining mass to 100%.
    return grade<=3?currentCdf(grade)*interpolate(seoul,grade,2)/interpolate(seoul,grade):futureAtThree+(100-futureAtThree)*tailProgress(grade);
  }
  // Collapse equal rounded nine-grade anchors at their greatest cumulative value.
  const gyeonggiNine=[[1,0]];
  legacy.observed.forEach(([g,p,q])=>{
    const previous=gyeonggiNine.at(-1);
    if(previous[0]===q)previous[1]=Math.max(previous[1],p);
    else gyeonggiNine.push([q,p]);
  });
  // (1,0) is an explicit boundary assumption below available historical data, not an observation.
  const busanNine=[[1,0],[1.09,.2],[1.15,.3],[1.19,.4],...busan.map(r=>[r[2],r[1]])];
  const knots=[...new Set([...gyeonggiNine,...busanNine].map(r=>r[0]))].sort((a,b)=>a-b);
  const historical=knots.map(q=>[q,(counts.gyeonggiNine*interpolate(gyeonggiNine,q)+counts.busanNine*interpolate(busanNine,q))/(counts.gyeonggiNine+counts.busanNine)]);
  function predict(grade,semesters=3) {
    legacy.requireRange(grade,1,5,'평균 내신');
    if(semesters!==3&&semesters!==5)throw new Error('3학기 또는 5학기를 선택해 주세요.');
    const percent=semesters===3?currentCdf(grade):futureCdf(grade);
    const nine=interpolate(historical,percent,0,1);
    const [lo,hi]=bracket(historical,percent,1);
    const g9=interpolate(gyeonggiNine,percent,0,1),b9=interpolate(busanNine,percent,0,1);
    // Source-sensitivity envelope + neighbouring pooled knots, NOT a statistical confidence interval.
    const range=[Math.min(lo[0],g9,b9,nine),Math.max(hi[0],g9,b9,nine)];
    return {grade,semesters,percent,nine,range,extended:grade>3,sourceBounds:{gyeonggi:bracket(gyeonggi,grade).map(r=>r[0]),busan:bracket(busan,grade).map(r=>r[0]),seoul:grade<=3?bracket(seoul,grade).map(r=>r[0]):null}};
  }
  const api={predict,combine:legacy.combine,required:legacy.required,counts,
    sources:{gyeonggi,busan,seoul,gyeonggiNine,busanNine,historical},interpolate,currentCdf,futureCdf,seoulCdf};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.GradePrediction=api;
})(typeof window!=='undefined'?window:globalThis);
