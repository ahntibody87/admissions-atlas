const assert=require('node:assert/strict');
const M=require('../assets/semester-plan.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const calc=(completed,grades,target,future=2,counts)=>M.calculate({completed,grades,target,future,counts});
// First year, second year, and only the final semester remaining.
near(calc(1,[2.5],2).required,1.875);
near(calc(2,[2,3],2).required,5/3);
near(calc(3,[2,2,2],1.8).required,1.5);
near(calc(4,[2,2,2,2],1.8).required,1);
assert.equal(calc(1,[2.5],2).safeRequired,1.87);
assert.equal(calc(2,[2,3],2).safeRequired,1.66);
// Course count weighting: 2*4 + 3*8 done, 6+5+7 remaining, 30 total.
const weighted=calc(2,[2,3],2,1.5,[4,8,6,5,7]);
near(weighted.current,32/12);near(weighted.required,28/18);near(weighted.final,59/30);
assert.notEqual(weighted.required,calc(2,[2,3],2).required);
assert.equal(calc(4,[3,3,3,3],1).status,'impossible');
assert.equal(calc(4,[1,1,1,1],2).status,'secured');
assert.equal(calc(4,[2,2,2,2],2.6).status,'secured');
assert.equal(calc(4,[2,2,2,2],1.8).status,'possible');
assert.equal(calc(0,[],2).current,null);near(calc(0,[],2).required,2);
assert.equal(calc(5,[1,2,3,4,5],3).status,'complete-met');
assert.equal(calc(5,[1,2,3,4,5],2).status,'complete-missed');
assert.equal(calc(5,[1,2,3,4,5],3).required,null);
near(calc(5,[1,2,3,4,5],3,NaN).final,3);
// Actionable two-decimal target never rounds up past the true target ceiling.
for(let n=0;n<=4;n++)for(const target of [1,1.13,1.8,2,2.91,4.99,5])for(const g of [1,1.17,2,3.43,5]) {
  const args={completed:n,grades:Array(n).fill(g),target,counts:[3,7,5,9,6]};
  const r=M.calculate(args);
  if(r.safeRequired!==null)assert.ok(M.calculate({...args,future:r.safeRequired}).final<=target+1e-9);
  near(M.calculate({...args,future:1}).final,r.best);
  near(M.calculate({...args,future:5}).final,r.worst);
}
for(const g of [NaN,Infinity,0,5.01,'2',null])assert.throws(()=>calc(1,[g],2));
for(const n of [-1,6,1.5,NaN])assert.throws(()=>calc(n,[],2));
for(const target of [NaN,0,5.01])assert.throws(()=>calc(1,[2],target));
assert.throws(()=>calc(2,[2],2));
for(const counts of [[1,1],[0,1,1,1,1],[1,1.5,1,1,1],[101,1,1,1,1]])assert.throws(()=>calc(1,[2],2,2,counts));
assert.throws(()=>calc(1,[2],2,NaN));
console.log('Semester plan: all completion stages, course weighting, goal boundaries, safe rounding and invalid inputs passed.');
