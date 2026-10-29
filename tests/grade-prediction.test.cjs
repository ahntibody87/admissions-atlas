const assert=require('node:assert/strict');
const M=require('../assets/grade-prediction.js');
const near=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);

// Independent hand calculations at exact source rows, not values copied from the implementation.
const total=26511+15978+5000;
const p2=(26511*18.05+15978*16.58+5000*17.88)/total;
near(M.predict(2,3).percent,p2);
near(M.predict(2,5).percent,p2*16.31/17.88);
const p3=(26511*51.49+15978*49.96+5000*51.06)/total;
const r3=(26511*51.49+15978*49.96)/42489;
const r4=(26511*84.47+15978*85.54)/42489;
const tail4=(r4-r3)/(100-r3);
const s4=51.06+48.94*tail4;
near(M.predict(4,3).percent,(42489*r4+5000*s4)/total);
near(M.predict(4,5).percent,p3*50.26/51.06+(100-p3*50.26/51.06)*tail4);
assert.notEqual(M.predict(4,3).percent,r4,'Do not silently remove Seoul in the tail');
near((M.seoulCdf(4)-51.06)/(100-51.06),tail4);
near(M.seoulCdf(5),100);

// Independently solve a historical mixture on the interval q=3.11..3.30.
const h=q=>(13896*(18.05+(q-3.11)/.26*4.44)+15670*(16.58+(q-3.3)/.32*4.17))/29566;
const expectedNine=3.11+(p2-h(3.11))/(h(3.3)-h(3.11))*.19;
near(M.predict(2,3).nine,expectedNine);

// Every original point is reproduced before mixing; extra Gyeonggi points do not gain old grades.
for(const name of ['gyeonggi','busan','seoul']) {
  const rows=M.sources[name];
  for(const row of rows)near(M.interpolate(rows,row[0]),row[1]);
}
near(M.interpolate(M.sources.gyeonggi,1.059),1.169);
near(M.interpolate(M.sources.seoul,2,2),16.31);
assert.equal(M.sources.gyeonggi.find(r=>r[0]===1.059)[2],null);
assert.deepEqual(M.predict(1.165,3).sourceBounds.busan,[1.16,1.24]);
assert.equal(M.predict(3.01,3).sourceBounds.seoul,null);

// Test much finer than the UI resolution, including boundaries and source discontinuity risks.
for(const semesters of [3,5]) {
  let previous=null;
  for(let i=0;i<=40000;i++) {
    const grade=1+i/10000,r=M.predict(grade,semesters);
    for(const value of [r.percent,r.nine,...r.range])assert.ok(Number.isFinite(value));
    assert.ok(r.percent>=0&&r.percent<=100);
    assert.ok(r.range[0]>=1&&r.range[1]<=9);
    assert.ok(r.range[0]<=r.nine&&r.nine<=r.range[1]);
    if(previous) {
      assert.ok(r.percent>=previous.percent-1e-10,`CDF decreased at ${grade}/${semesters}`);
      assert.ok(r.nine>=previous.nine-1e-10);
      assert.ok(r.range[0]>=previous.range[0]-1e-10);
      assert.ok(r.range[1]>=previous.range[1]-1e-10);
    }
    previous=r;
  }
  near(M.predict(3-1e-9,semesters).percent,M.predict(3+1e-9,semesters).percent,1e-6);
  near(M.predict(5,semesters).percent,100);
  near(M.predict(5,semesters).nine,9);
}
// Full-range estimates include top students and the previously missing five-semester tail.
for(const grade of [1,1.01,2.41,2.42,3,3.01,4.99,5])assert.ok(M.predict(grade,5).nine>=1);
for(const value of [NaN,Infinity,-Infinity,0,5.01,null,'2'])assert.throws(()=>M.predict(value));
assert.throws(()=>M.predict(2,4));
near(M.combine(1.5,26,2,7),53/33);
console.log('Grade prediction: 80,002 full-range checks, independent arithmetic, source reproduction, tail continuity and input validation passed.');
