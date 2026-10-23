/* 메뉴와 자료는 이 파일에서 관리합니다. 게시할 자료가 없으면 items를 빈 배열로 둡니다.
   항목: { title, description, href, year, source, updated }
   배너: { title, description, href, linkLabel }
   href: 사이트 안의 상대 경로 또는 https 주소. 비공개 원본과 개인정보는 추가하지 않습니다. */
window.ATAA_CONTENT = {
  banners: [{ title: '내신의 위치를 읽고, 고3 1학기를 설계합니다.', description: '9·5등급 내신 비교, 마지막 학기 시뮬레이션과 목표 역산. 참고 배치표에서 예상 누적비를 함께 살펴보세요.', href: '../grades/', linkLabel: '내신 비교와 목표 설계 열기 →' }],
  sections: [
    { id: 'grade-planning', label: '목표 설계', english: 'GRADE PLANNING', description: '내신 구간·누적비를 비교하고 3학년 1학기의 성적 목표를 계산합니다.', items: [{ title: '내신 비교 · 고3 1학기 시뮬레이션', description: '현재 내신 위치, 고3 1학기 예상 최종 성적, 목표 내신 역산과 누적비 참고 배치표를 한곳에서 확인합니다.', href: '../grades/', year: '2027·2028', source: '경기진협 · 서울중등진학지도연구회 세미나', updated: '2026-10-06' }] },
    { id: 'archive', label: '자료 아카이브', english: 'ARCHIVE', description: '모집요강과 전형 자료를 출처·학년도와 함께 정리합니다.', empty: '아직 등록된 자료가 없습니다.', items: [{ title: '대학별 권장과목 찾기', description: '47개 대학의 모집단위별 핵심·권장과목과 비고를 표로 비교하고 검색하세요.', href: '../archive/subjects/', year: '2028', source: '제공된 권역별 대학별 권장과목 자료', updated: '2026-10-23' }] },
    { id: 'analysis', label: '전형 분석', english: 'ADMISSIONS ANALYSIS', description: '대학별 전형 기준과 연도별 변화를 조회합니다.', items: [{ title: '대학별 전형 분석', description: '대학을 선택해 주요 내용과 전형 기준, 모집단위별 인원을 확인합니다.', href: '../analysis/', year: '2027·2028', source: '대학입학전형 비교 · 인포그래픽', updated: '2026-10-22' }, { title: '건국대학교 · 2027–2028 전형 분석', description: '핵심 전형 기준, 수능 반영비율, 49개 모집단위 검색과 인원 비교.', href: '../analysis/konkuk/', year: '2027·2028', source: '건국대 입학전형 시행계획 기반 제공 자료 5장', updated: '2026-10-22' }] },
    { id: 'simulation', label: '시뮬레이션', english: 'SIMULATION', description: '확인된 기준과 가정에 따라 여러 조건을 비교합니다.', empty: '아직 등록된 시뮬레이션이 없습니다.', items: [
      { title: '고3 1학기 시뮬레이션', description: '현재 누적 내신에 예상 성적과 과목 수·학점을 더해 최종 평균을 계산합니다.', href: '../grades/#semester', year: '5등급제', category: '성적 시뮬레이션', linkLabel: '시뮬레이션 시작하기' },
      { title: '목표 내신 역산', description: '원하는 최종 내신을 입력하고 고3 1학기에 필요한 평균 성적을 확인합니다.', href: '../grades/#target', year: '5등급제', category: '목표 성적 계산', linkLabel: '목표 성적 계산하기' }
    ] }
  ]
};
