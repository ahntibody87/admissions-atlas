const assert = require('node:assert/strict');
const M = require('../assets/grade-model.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
// Different semester course counts must be combined by course count, not by averaging semester averages.
near(M.combine(1.5,18,2,14),1.71875);
near(M.combine(1.5,26,2,7),53/33);
near(M.combine(1.5,78,2,21),M.combine(1.5,26,2,7));
const goal=M.required(1.5,26,1.7,7);
near(goal.value,17.1/7);near(M.combine(1.5,26,goal.value,7),1.7);
assert.equal(M.required(2,26,1.5,7).status,'impossible');
assert.equal(M.required(1,26,2,7).status,'secured');
assert.equal(M.required(1,26,1,7).status,'possible');
assert.throws(()=>M.combine(NaN,26,2,7));assert.throws(()=>M.combine(1.5,0,2,7));assert.throws(()=>M.required(1.5,26,6,7));
// Published boundaries and overlapping forecast ranges, without fabricated point interpolation.
assert.deepEqual(M.lookupObserved(2).percent,[18.05,18.05]);
assert.deepEqual(M.lookupObserved(2).grade,[3.11,3.11]);
assert.deepEqual(M.lookupObserved(2.1).percent,[18.05,22.49]);
assert.deepEqual(M.lookupObserved(1.24,9).grade,[1,1.05]);
assert.equal(M.lookupObserved(9,9),null);
assert.deepEqual(M.lookupForecast(1.5).percent,[6,7]);
assert.deepEqual(M.lookupForecast(2).percent,[17,18]);
assert.deepEqual(M.lookupForecast(3.5,9).percent,[21,22]);
assert.equal(M.lookupForecast(2.42),null);assert.equal(M.lookupForecast(4.09,9),null);
assert.equal(M.lookupForecast(1).edge,true);assert.equal(M.lookupForecast(2.41).edge,true);
assert.equal(M.observed.length,30);assert.equal(M.forecast.length,30);
for(let i=1;i<M.observed.length;i++){assert.ok(M.observed[i][0]>M.observed[i-1][0]);assert.ok(M.observed[i][1]>=M.observed[i-1][1]);}
console.log('Grade model: arithmetic, target boundaries, source boundaries, overlapping ranges and unsupported inputs passed.');
