/* Source: the five Konkuk images in the two user-supplied 29-university archives.
   Reviewed 2026-10-22. Original images remain outside the public repository. */
(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.ATAA_KONKUK = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const columns = ['KU지역균형', 'KU자기추천', 'KU논술', '수능 KU일반'];
  // college, department, regional, holistic, essay, regular, regular group
  const rows = [
    ['문과대학','국어국문학과',9,15,5,0,''],
    ['문과대학','영어영문학과',10,30,3,0,''],
    ['문과대학','중어중문학과',8,16,3,0,''],
    ['문과대학','철학과',6,15,3,0,''],
    ['문과대학','사학과',7,14,3,0,''],
    ['문과대학','지리학과',4,17,3,0,''],
    ['문과대학','미디어커뮤니케이션학과',6,18,6,0,''],
    ['문과대학','문화콘텐츠학과',5,18,3,0,''],
    ['문과대학','문과대학자유전공학부',15,0,14,20,'다'],
    ['이과대학','수학과',5,7,4,8,'나'],
    ['이과대학','물리학과',8,13,7,12,'가'],
    ['이과대학','화학과',3,8,4,9,'나'],
    ['이과대학','이과대학자유전공학부',0,0,11,13,'다'],
    ['건축대학','건축학부',8,20,6,39,'가'],
    ['공과대학','사회환경공학부',7,40,7,42,'가'],
    ['공과대학','기계·로봇·자동차공학부',19,8,5,35,'가'],
    ['공과대학','전기전자공학부',8,38,7,63,'가'],
    ['공과대학','화공·생명·에너지공학부',6,20,3,30,'가'],
    ['공과대학','컴퓨터공학부',8,34,7,47,'가'],
    ['공과대학','재료공학과',4,22,0,26,'가'],
    ['공과대학','항공우주·모빌리티공학과',3,9,5,25,'가'],
    ['공과대학','생물공학과',3,15,7,15,'가'],
    ['공과대학','산업공학과',3,8,3,15,'가'],
    ['공과대학','공과대학자유전공학부',100,0,35,60,'다'],
    ['사회과학대학','정치외교학과',3,9,4,13,'나'],
    ['사회과학대학','경제학과',7,23,7,32,'나'],
    ['사회과학대학','행정학과',6,14,5,25,'나'],
    ['사회과학대학','국제무역학과',4,14,7,32,'가'],
    ['사회과학대학','응용통계학과',4,13,3,18,'나'],
    ['사회과학대학','사회과학대학융합전공학부',0,0,8,68,'다'],
    ['경영대학','경영학과',15,47,15,65,'나'],
    ['경영대학','기술경영학과',3,10,4,15,'가'],
    ['부동산과학원','부동산학과',4,10,5,17,'나'],
    ['융합생명과학대학','첨단바이오공학부',3,18,3,19,'나'],
    ['융합생명과학대학','생명공학부',6,16,6,22,'나'],
    ['융합생명과학대학','식품융합학부',3,24,3,25,'나'],
    ['융합생명과학대학','환경생태과학부',3,20,3,23,'나'],
    ['융합생명과학대학','동물자원과학과',3,16,3,14,'나'],
    ['융합생명과학대학','생명과학과',6,14,4,6,'나'],
    ['융합생명과학대학','식량자원과학과',3,10,3,12,'나'],
    ['융합생명과학대학','융합생명과학대학자유전공학부',0,0,14,65,'다'],
    ['수의과대학','수의예과',5,24,6,31,'가'],
    ['예술디자인대학','의상디자인학과-인문계',0,0,0,17,'나'],
    ['예술디자인대학','영화예술학과',0,10,0,0,''],
    ['사범대학','일어교육과',3,19,0,0,''],
    ['사범대학','수학교육과',6,6,5,8,'가'],
    ['사범대학','교육공학과',0,15,0,10,'나'],
    ['사범대학','영어교육과',6,10,0,4,'가'],
    ['상허교양대학','KU자유전공학부',0,183,65,60,'가']
  ];
  const departments = rows.map(([college,name,...rest]) => ({college,name,counts:rest.slice(0,4),group:rest[4]}));
  const previous = {
    '미디어커뮤니케이션학과':[6,13,6,5],
    '문화콘텐츠학과':[4,14,3,5],
    '화공·생명·에너지공학부':[6,20,3,31],
    '산업공학과':[3,8,3,16],
    '부동산학과':[4,15,5,12],
    '생명공학부':[6,16,6,23],
    '생명과학과':[0,0,0,0],
    '영화예술학과':[0,0,0,0],
    '교육공학과':[0,12,0,13]
  };
  const notes = {
    '생명공학부':'2027 시스템생명공학과·융합생명공학과를 묶어 비교. 정시 다군 23명 → 나군 22명.',
    '환경생태과학부':'2027 환경보건·산림조경학부와 대응해 표시.',
    '생명과학과':'2027 생명과학특성학과와의 대응 관계가 명시되지 않아 별도 행으로 표시. 순수 신설로 단정하지 않음.',
    '융합생명과학대학자유전공학부':'2027의 2개 대학 자유전공을 합산하여 비교.',
    '영화예술학과':'2028 KU자기추천 10명. 비교 자료에는 연출우수자 전형 10명 폐지가 별도로 기재됨.'
  };
  const comparisons = [];
  departments.forEach(d => {
    if(d.name==='동물자원과학과') return;
    if(d.name==='식품융합학부') {
      comparisons.push({college:d.college,name:'식품융합학부 + 동물자원과학과',before:[5,40,4,42],after:[6,40,6,39],note:'2027 동물자원·식품과학·유통을 묶어 비교. 2028 개별 인원은 모집인원 보기에서 확인.'});
      return;
    }
    if(d.name==='생명과학과') comparisons.push({college:d.college,name:'생명과학특성학과 (2027)',before:[6,14,4,6],after:[0,0,0,0],note:'생명과학과(2028)와의 직접 대응이 명시되지 않음. 모집인원 소멸로 단정하지 않음.'});
    comparisons.push({college:d.college,name:d.name,before:previous[d.name]||d.counts.slice(),after:d.counts.slice(),note:notes[d.name]||''});
  });
  const totals = {2027:{all:3413,early:1949,regular:1464,earlyPercent:57.1,regularPercent:42.9,core:[346,893,325,1074]},2028:{all:3410,early:1938,regular:1472,earlyPercent:56.8,regularPercent:43.2,core:[348,910,327,1060]}};
  const changes = [
    {topic:'교과',name:'KU지역균형 수능최저',before:'없음',after:'한국사 포함 5개 영역 중 3개 등급 합 8 이내. 수의예과는 3개 합 4.',changed:true},
    {topic:'교과',name:'교과정량 반영 과목',before:'국어·영어·수학·사회·과학·한국사 중 석차등급이 있는 전 과목',after:'같은 교과의 공통·일반·진로선택 과목 중 상위 20개 과목',changed:true},
    {topic:'교과',name:'KU지역균형 선발 방법',before:'교과정량 70% + 교과정성 30%. 고교별 추천 인원 제한 없음.',after:'동일',changed:false},
    {topic:'학종',name:'KU자기추천 선발 방법',before:'1단계 서류 100%(3배수) → 2단계 1단계 70% + 면접 30%. 수능최저 없음.',after:'동일',changed:false},
    {topic:'논술',name:'KU논술 수능최저',before:'국·수·영·탐(1과목) 중 2개 합 5 + 한국사 5등급. 수의예과 3개 합 4.',after:'한국사 포함 5개 영역 중 3개 합 8. 수의예과 3개 합 4(탐구 2과목 평균).',changed:true},
    {topic:'논술',name:'논술 출제 유형',before:'인문(국어+사회 2문항) / 통합 / 자연(수학 4문항)',after:'계열 구분 없는 통합 1유형: 국어+통합사회 1문항, 수학 3문항',changed:true},
    {topic:'정시',name:'수능 영역별 비율',before:'A 국40·수30·탐20·영10 / B 국30·수40·탐20·영10',after:'A 국45·수35·탐10·영10 / B 국35·수45·탐10·영10',changed:true},
    {topic:'정시',name:'탐구·점수 활용',before:'탐구 2과목, 백분위 변환표준점수. A/B 중 높은 점수는 KU자유전공학부만 적용.',after:'탐구 상위 1과목, 표준점수. 전 계열에 A/B를 모두 적용하여 높은 점수 반영.',changed:true},
    {topic:'정시',name:'단과대학 자유전공',before:'수능 100%',after:'수능 90% + 학생부 교과정성 10% (다군 226명)',changed:true},
    {topic:'학사개편',name:'정시 모집군',before:'시스템생명공학과·융합생명공학과 다군 23명',after:'생명공학부 나군 22명',changed:true},
    {topic:'전형이동',name:'특성화고교졸업자',before:'수시 학생부종합 22명',after:'정시 수능 22명으로 이동',changed:true},
    {topic:'전형폐지',name:'연출우수자',before:'10명',after:'전형 폐지',changed:true}
  ];
  const hasChange = r => r.before.some((v,i)=>v!==r.after[i]);
  const delta = r => r.after.map((v,i)=>v-r.before[i]);
  const filterRows = (items,{query='',college='',group='',changedOnly=false}={}) => {
    const q=query.replace(/\s/g,'').toLowerCase();
    return items.filter(r=>(!q||(r.name+r.college+(r.note||'')).replace(/\s/g,'').toLowerCase().includes(q))&&(!college||r.college===college)&&(!group||r.group===group)&&(!changedOnly||(r.before&&hasChange(r))));
  };
  return {columns,departments,comparisons,totals,changes,hasChange,delta,filterRows,reviewed:'2026-10-22'};
});
