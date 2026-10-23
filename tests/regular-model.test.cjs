const assert=require('node:assert/strict'),M=require('../assets/regular-model.js');
assert(M.valid(3,42,4));assert(M.valid(4,39,5));assert(!M.valid(3,49,1));assert(!M.valid(0,88,0));assert(!M.valid(0,99,1));assert(M.valid(0,100,0));assert(M.valid(3,0,25));assert(!M.valid(3,42,3));
assert.deepEqual(M.adjust(3,42,4,'wrong',3),{score:42.5,wrong:3});
assert.equal(M.total([{score:88},{score:83},{score:80},{score:42},{score:39}]),252);
assert.equal(M.wrong([{wrong:5},{wrong:5},{wrong:8},{wrong:4},{wrong:5}]),19);
assert.equal(M.grade(90),1);assert.equal(M.grade(89),2);assert.equal(M.grade(0),9);
for(let i=0;i<5;i++)for(let w=0;w<=M.subjects[i].n;w++){const a=M.adjust(i,50,10,'wrong',w);if(a)assert(M.valid(i,a.score,a.wrong));}
const fs=require('fs'),vm=require('vm'),ctx={window:{}};vm.runInNewContext(fs.readFileSync(require('path').join(__dirname,'../assets/regular-data.js'),'utf8'),ctx);const d=ctx.window.REGULAR_DATA;
assert.equal(d.universities.length,25);assert.equal(d.rows.length,48);assert.equal(d.rows.reduce((n,r)=>n+Object.keys(r.cells).length,0),84);d.rows.forEach((r,i)=>{assert.equal(r.total,r.korean+r.math+r.social+r.science);if(i)assert(d.rows[i-1].total>=r.total);assert(r.bands.every(c=>c>=0&&c<25));});
console.log('Regular model: score/incorrect feasibility, half points, English exclusion, 25 university data and order passed.');
