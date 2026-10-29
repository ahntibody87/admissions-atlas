/* Five-semester planning, through grade 12 semester 1.
 * Equal semester weights by default; course counts reconstruct a course-level simple mean.
 * No year weighting, credit weighting, or university-specific formula is implied.
 */
(function(root){
  'use strict';
  const labels=['1학년 1학기','1학년 2학기','2학년 1학기','2학년 2학기','3학년 1학기'];
  function grade(value,name){
    if(!Number.isFinite(value)||value<1||value>5)throw new Error(`${name}은 1.00~5.00 사이로 입력해 주세요.`);
    return value;
  }
  function calculate({completed,grades,counts=[1,1,1,1,1],target,future=2}){
    if(!Number.isInteger(completed)||completed<0||completed>5)throw new Error('성적이 나온 마지막 학기를 선택해 주세요.');
    if(!Array.isArray(grades)||grades.length!==completed)throw new Error('완료한 학기의 성적을 모두 입력해 주세요.');
    if(!Array.isArray(counts)||counts.length!==5||counts.some(n=>!Number.isInteger(n)||n<1||n>100))throw new Error('각 학기의 반영 과목 수를 1~100 사이 정수로 입력해 주세요.');
    grade(target,'최종 목표 내신');
    grades.forEach((g,i)=>grade(g,labels[i]+' 평균 내신'));
    const doneWeight=counts.slice(0,completed).reduce((a,b)=>a+b,0);
    const remainingWeight=counts.slice(completed).reduce((a,b)=>a+b,0);
    const totalWeight=doneWeight+remainingWeight;
    const sum=grades.reduce((s,g,i)=>s+g*counts[i],0);
    const current=doneWeight?sum/doneWeight:null;
    const best=(sum+remainingWeight)/totalWeight,worst=(sum+5*remainingWeight)/totalWeight;
    if(!remainingWeight)return {completed,remaining:0,current,best,worst,required:null,safeRequired:null,final:current,status:current<=target+1e-10?'complete-met':'complete-missed'};
    const required=(target*totalWeight-sum)/remainingWeight;
    const status=required<1-1e-10?'impossible':required>=5-1e-10?'secured':'possible';
    // Floor the actionable target: rounding up could recommend a result that misses the goal.
    const safeRequired=status==='impossible'?null:Math.min(5,Math.max(1,Math.floor((required+1e-10)*100)/100));
    return {completed,remaining:5-completed,current,best,worst,required,safeRequired,
      final:(sum+grade(future,'남은 학기 예상 평균')*remainingWeight)/totalWeight,status};
  }
  const api={calculate,labels};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.SemesterPlan=api;
})(typeof window!=='undefined'?window:globalThis);
