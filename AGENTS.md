# ATAA 프로젝트 지침

- GitHub: https://github.com/ahntibody87/admissions-atlas (PUBLIC)
- GitHub Pages: https://ahntibody87.github.io/admissions-atlas/
- 배포 대상: 위 저장소 main / 루트. 다른 저장소는 수정하지 않습니다.
- Supabase project ref / Vercel projectId / orgId: 해당 없음. 사용하지 않습니다.
- 공개할 비개인 자료만 담습니다. 사용자가 선택하지 않은 과거 작업물은 가져오지 않습니다.
- 자료는 대화에서 받아 분석하고 알맞은 메뉴에 반영합니다. 원본 업로드 자체를 인터넷 원문 재배포 허가로 간주하지 않습니다.
- 분석의 출처·학년도·확인일을 기록하고 사실과 해석, 시뮬레이션의 가정을 구분합니다.
- 메인은 index.html + assets/landing.css + assets/landing.js이며 메인 탐색 메뉴는 위쪽·지도·아래쪽을 함께 맞춥니다.
- 내부 메뉴·배너·목록은 explore/index.html과 assets/content.js에서 확장합니다. 내부 배너 디자인은 별도 요청 때 수정합니다.
- 내신 설계의 기본 주소는 /admissions-atlas/grades/입니다. grades.html은 이전 주소 호환을 위한 이동 페이지로 유지합니다.
- 메인 푸터의 LAST UPDATED는 요청된 실제 변경 날짜를 수동으로 반영합니다.
- 데스크톱 메인은 브라우저 100% 배율에서 상단 메뉴·하단 네 메뉴·LAST UPDATED까지 한 화면에 표시합니다. 화면 높이를 넘기는 최소 높이나 전체 확대/축소로 해결하지 않습니다. 지도 배경의 오른쪽 잘림은 유지하되 Start와 네 지점은 보이는 영역 안에 둡니다.
- 비밀값·학생 개인정보·인증 파일은 저장하거나 커밋하지 않습니다.
- 일반 정적 페이지 변경에는 Vercel·Supabase·도름스체크가 필요 없습니다. 중요한 보안 변경에는 필요한 검사를 수행합니다.
