/* 메뉴와 자료는 이 파일에서 관리합니다. 게시할 자료가 없으면 items를 빈 배열로 둡니다.
   항목: { title, description, href, year, source, updated }
   배너: { title, description, href, linkLabel }
   href: 사이트 안의 상대 경로 또는 https 주소. 비공개 원본과 개인정보는 추가하지 않습니다. */
window.ATAA_CONTENT = {
  banners: [],
  sections: [
    { id: 'archive', label: '자료 아카이브', english: 'ARCHIVE', description: '모집요강과 전형 자료를 출처·학년도와 함께 정리합니다.', empty: '아직 등록된 자료가 없습니다.', items: [] },
    { id: 'analysis', label: '자료 분석', english: 'ANALYSIS', description: '자료의 차이와 변화, 비교 결과를 기록합니다.', empty: '아직 등록된 분석 글이 없습니다.', items: [] },
    { id: 'simulation', label: '시뮬레이션', english: 'SIMULATION', description: '확인된 기준과 가정에 따라 여러 조건을 비교합니다.', empty: '아직 등록된 시뮬레이션이 없습니다.', items: [] }
  ]
};
