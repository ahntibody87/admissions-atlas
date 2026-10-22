const assert = require('node:assert/strict');
const data = require('../assets/konkuk-data.js');
const total = (rows,key) => rows.reduce((a,r)=>a.map((n,i)=>n+r[key][i]),[0,0,0,0]);
assert.equal(data.departments.length,49);
assert.equal(new Set(data.departments.map(r=>r.name)).size,49);
assert.deepEqual(total(data.departments,'counts'),[348,910,327,1060]);
assert.deepEqual(total(data.comparisons,'before'),[346,893,325,1074]);
assert.deepEqual(total(data.comparisons,'after'),[348,910,327,1060]);
for(const year of [2027,2028]) {
 const t=data.totals[year];
 assert.equal(t.early+t.regular,t.all);
 assert.equal(t.earlyPercent+t.regularPercent,100);
 assert.deepEqual(total(data.comparisons,year===2027?'before':'after'),t.core);
}
for(const [group,n] of [['가',499],['나',335],['다',226]]) {
 assert.equal(data.filterRows(data.departments,{group}).reduce((n,r)=>n+r.counts[3],0),n);
}
for(const r of data.departments) {
 assert(r.counts.every(n=>Number.isInteger(n)&&n>=0));
 assert.equal(Boolean(r.group),r.counts[3]>0);
}
const vet=data.filterRows(data.departments,{query:'수 의 예'});
assert.equal(vet.length,1);
assert.deepEqual(vet[0].counts,[5,24,6,31]);
assert.equal(data.filterRows(data.departments,{query:'수의예',college:'공과대학'}).length,0);
assert.equal(data.filterRows(data.departments,{query:'<script>'}).length,0);
assert(data.filterRows(data.comparisons,{changedOnly:true}).every(data.hasChange));
const food=data.comparisons.find(r=>r.name==='식품융합학부 + 동물자원과학과');
assert.deepEqual(data.delta(food),[1,0,2,-3]);
assert.equal(data.comparisons.filter(r=>r.name.includes('생명과학과')||r.name.includes('생명과학특성학과')).length,2);
assert.deepEqual(total(data.comparisons,'after').map((n,i)=>n-total(data.comparisons,'before')[i]),[2,17,2,-14]);
console.log('Konkuk: counts, comparison scope, groups, mapping and filters passed.');
