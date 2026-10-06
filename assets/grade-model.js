/* Source transcription: 경기진협 (2026-09-22), table 1; 윤희태 (2026-09-30), p.53.
   No extrapolation beyond the published data. Percentages mean cumulative share from the top. */
(function (root) {
  'use strict';
  const observed = [
    [1,.59,1.24],[1.05,.61,1.24],[1.10,1.18,1.39],[1.15,1.77,1.51],
    [1.20,2.33,1.60],[1.25,2.92,1.70],[1.30,3.56,1.80],[1.333,4.27,1.90],
    [1.5,6.66,2.20],[1.667,9.54,2.49],[1.833,12.99,2.77],[2,18.05,3.11],
    [2.167,22.49,3.37],[2.333,27.40,3.63],[2.5,32.66,3.90],[2.667,37.90,4.15],
    [2.833,44.12,4.41],[3,51.49,4.72],[3.167,57.57,4.98],[3.333,63.49,5.20],
    [3.5,69.03,5.43],[3.667,74.28,5.68],[3.833,78.97,5.90],[4,84.47,6.21],
    [4.167,88.46,6.46],[4.333,91.46,6.69],[4.5,93.92,6.93],[4.667,95.70,7.19],
    [4.833,97.42,7.51],[5,100,8.97]
  ];
  // [top cumulative %, five-grade min, max, nine-grade min, max]
  const forecast = [
    [1,1,1.09,1,1.39],[2,1.07,1.19,1.29,1.65],[3,1.15,1.25,1.55,1.84],
    [4,1.21,1.32,1.76,1.99],[5,1.29,1.41,1.92,2.11],[6,1.39,1.51,2.06,2.28],
    [7,1.48,1.55,2.21,2.42],[8,1.52,1.61,2.38,2.51],[9,1.59,1.65,2.48,2.61],
    [10,1.63,1.71,2.58,2.68],[11,1.69,1.79,2.63,2.79],[12,1.77,1.82,2.74,2.87],
    [13,1.8,1.85,2.83,2.97],[14,1.84,1.89,2.94,3.06],[15,1.87,1.92,3.03,3.16],
    [16,1.9,1.98,3.13,3.22],[17,1.96,2.02,3.19,3.28],[18,2,2.05,3.26,3.35],
    [19,2.03,2.07,3.32,3.41],[20,2.05,2.1,3.39,3.46],[21,2.09,2.16,3.43,3.53],
    [22,2.14,2.2,3.5,3.58],[23,2.19,2.25,3.55,3.67],[24,2.23,2.27,3.63,3.7],
    [25,2.26,2.29,3.68,3.76],[26,2.29,2.31,3.74,3.82],[27,2.3,2.33,3.8,3.9],
    [28,2.32,2.36,3.88,3.96],[29,2.35,2.39,3.94,4.04],[30,2.38,2.41,4.02,4.08]
  ];
  const EPS = 1e-9;
  function requireRange(value, min, max, name) {
    if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${name}: ${min}~${max} 사이의 숫자를 입력해 주세요.`);
    return value;
  }
  function combine(current, currentWeight, future, futureWeight) {
    requireRange(current,1,5,'현재 내신'); requireRange(future,1,5,'예상 내신');
    requireRange(currentWeight,1,500,'기존 과목 수/학점'); requireRange(futureWeight,1,100,'남은 과목 수/학점');
    return (current * currentWeight + future * futureWeight) / (currentWeight + futureWeight);
  }
  function required(current,currentWeight,target,futureWeight) {
    combine(current,currentWeight,1,futureWeight); requireRange(target,1,5,'목표 내신');
    const value = (target * (currentWeight + futureWeight) - current * currentWeight) / futureWeight;
    return {value, status:value < 1-EPS ? 'impossible' : value >= 5-EPS ? 'secured' : 'possible', best:combine(current,currentWeight,1,futureWeight), worst:combine(current,currentWeight,5,futureWeight)};
  }
  function lookupObserved(value,system=5) {
    requireRange(value,1,system===9?9:5,'내신');
    const column=system===9?2:0;
    if (value > observed[observed.length-1][column]+EPS) return null;
    const upper=observed.find(row=>row[column]>=value-EPS);
    const equal=observed.filter(row=>Math.abs(row[column]-value)<EPS);
    if(equal.length) return {percent:[equal[0][1],equal[equal.length-1][1]], grade:[equal[0][system===9?0:2],equal[equal.length-1][system===9?0:2]], exact:true};
    const i=observed.indexOf(upper),lower=i?observed[i-1]:null;
    return {percent:[lower?lower[1]:0,upper[1]],grade:[lower?lower[system===9?0:2]:1,upper[system===9?0:2]],exact:false};
  }
  function lookupForecast(value,system=5) {
    requireRange(value,1,system===9?9:5,'내신');
    const column=system===9?3:1;
    const rows=forecast.filter(row=>value>=row[column]-EPS&&value<=row[column+1]+EPS);
    if(!rows.length) return null;
    const other=system===9?1:3;
    return {percent:[rows[0][0],rows[rows.length-1][0]],grade:[Math.min(...rows.map(r=>r[other])),Math.max(...rows.map(r=>r[other+1]))],edge:rows[0][0]===1||rows[rows.length-1][0]===30};
  }
  const api={observed,forecast,combine,required,lookupObserved,lookupForecast,requireRange};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.GradeModel=api;
})(typeof window!=='undefined'?window:globalThis);
