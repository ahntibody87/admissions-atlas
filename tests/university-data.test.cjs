const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const folder=path.join(root,'assets/universities');
const files=fs.readdirSync(folder).filter(f=>f.endsWith('.json'));
assert.equal(files.length,28);
const total=(rows,key,n)=>rows.reduce((a,r)=>a.map((v,i)=>v+r[key][i]),Array(n).fill(0));
let rows=49;
for(const file of files){
 const d=JSON.parse(fs.readFileSync(path.join(folder,file),'utf8'));
 assert.equal(typeof d.english,'string',d.slug);
 assert.deepEqual(total(d.departments,'counts',d.columns.length),d.expectedCurrent,d.slug+' current totals');
 for(const r of d.departments){assert.equal(r.counts.length,d.columns.length);assert(r.counts.every(n=>Number.isInteger(n)&&n>=0));assert(!/[亏卜曰石丁口]/.test(r.name),d.slug+' name: '+r.name);}
 for(const r of d.comparisons){assert.equal(r.before.length,d.compareColumns.length);assert.equal(r.after.length,d.compareColumns.length);assert(r.before.concat(r.after).every(n=>Number.isInteger(n)&&n>=0));}
 if(d.comparisonType!=='track')for(const [year,key] of [[2027,'before'],[2028,'after']])assert.deepEqual(total(d.comparisons,key,d.compareColumns.length),d.totals[year].core,d.slug+' comparison totals');
 for(const year of [2027,2028]){const t=d.totals[year];assert.equal(t.early+t.regular+t.other,t.all);assert.equal(t.core.length,d.chartColumns.length);}
 for(const key of ['englishScores','korean'])if(d[key]){assert.equal(d[key].length,9);assert(d[key].every(Number.isFinite));}
 const html=fs.readFileSync(path.join(root,'analysis',d.slug,'index.html'),'utf8');
 for(const id of ['overview','tracks','regular','departments','sources','department-query','college-filter','group-filter','department-changes-only'])assert(html.includes('id="'+id+'"'),d.slug+' missing '+id);
 assert(html.includes('/assets/universities/'+d.slug+'.json'));
 rows+=d.departments.length;
}
const groupTotals=(slug)=>{const d=JSON.parse(fs.readFileSync(path.join(folder,slug+'.json'),'utf8'));return ['가','나','다'].map(g=>d.departments.filter(r=>r.group.split('·').includes(g)).reduce((s,r)=>s+r.counts.slice(d.regularStart).reduce((a,b)=>a+b,0),0));};
for(const [slug,expected] of Object.entries({kookmin:[220,375,168],dongguk:[332,327,196],sookmyung:[485,293,68],soongsil:[420,321,413],hongik:[0,78,668],ewha:[85,621,117]}))assert.deepEqual(groupTotals(slug),expected,slug+' groups');
const index=fs.readFileSync(path.join(root,'analysis/index.html'),'utf8');assert.equal((index.match(/class="university-card"/g)||[]).length,29);
for(const match of index.matchAll(/class="university-card" href="([^"]+)"/g))assert(fs.existsSync(path.join(root,'analysis',match[1],'index.html')));
assert.equal(rows,1788);
console.log('29 universities: 1,788 current rows, source column totals, comparison totals, recruitment groups and page links passed.');

