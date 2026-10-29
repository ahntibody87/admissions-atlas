# ATAA — Ahntibody’s Admissions Atlas

- 사이트: https://ahntibody87.github.io/admissions-atlas/
- 공개 저장소: https://github.com/ahntibody87/admissions-atlas
- GitHub Pages: main 브랜치 / 루트

## 자료 반영 방법

자료를 Codex 대화에 첨부하고 “ATAA에 반영해줘”라고 요청합니다. 원본을 읽어 요약·표·비교 항목을 만들고, 적절한 메뉴를 선택하거나 제안합니다. 구체적인 메뉴를 매번 지정할 필요는 없습니다.

업로드는 공개 허가와 같지 않습니다. 개인정보·교사용 비공개 자료는 게시하지 않으며, 원문 재배포가 가능한지 불분명하면 원문 파일 대신 출처 링크와 분석을 사용합니다. 공식 자료의 사실과 개인 해석을 구분하고 학년도·출처·확인일을 기록합니다. 계산 도구는 기준·가정·적용 학년도를 표시합니다.

현재 사이트에는 파일 업로드나 자동 AI 분석 기능이 없습니다. AI 서버·DB 없이 GitHub Pages로 운영하며, 자료를 반영한 변경을 main에 push하면 다시 게시됩니다.

## 메뉴·배너 확장

메인은 아이보리·청록 아틀라스 디자인의 진입 화면입니다. 내부 페이지는 03 전형 분석을 기준으로 화이트·블루 색상과 Pretendard 글꼴, 상단 헤더, 제목 위치, 카드와 푸터를 통일합니다. 01 내신 설계는 `grades/`, 02 자료 아카이브는 `archive/`, 03 전형 분석은 `analysis/`, 04 시뮬레이션은 `simulation/`입니다. 자료가 없는 아카이브에는 빈 목록 안내를 표시하며, 시뮬레이션에서는 기존 내신 계산 도구로 연결합니다.

- `index.html`, `assets/landing.css`, `assets/landing.js`: 메인, 반응형 메뉴, 지도 확대 후 네 분야 선택 화면(`#explore`), 최근 반영 소식, 사이트 소개 대화상자. 동작 줄이기 설정에서는 즉시 선택 화면을 표시합니다. 뒤로 가기와 새로고침을 지원하며, JavaScript가 없으면 탐색 시작 링크가 `explore/`로 연결됩니다.
- `assets/atlas-terrain.svg`, `assets/compass.svg`: 실제 지리를 나타내지 않는 탐색용 지도와 나침반 그래픽.
- `assets/fonts/`: Cormorant Garamond의 로컬 글꼴과 OFL 라이선스. 메인 로딩에 외부 글꼴 요청이 필요하지 않습니다.
- 위쪽 메뉴·지도·탐색 시작 후 네 카드의 대상 주소는 함께 수정합니다. 최근 반영 소식과 메인 푸터 날짜는 수동으로 갱신합니다.

`assets/content.js`의 `sections` 배열에서 분야별 자료와 도구 목록을 관리합니다. `archive` 또는 `simulation`에 항목을 추가하면 해당 페이지의 카드 목록과 개수가 갱신됩니다. 주요 메뉴와 탐색 안내의 링크를 바꿀 때는 각 HTML의 공통 헤더와 메인 지도를 함께 수정합니다.

자료 항목 예시 형식(실제 자료로 교체):

```js
{ title: '자료 제목', description: '짧은 소개', href: '자료의 상대 경로 또는 https 주소', year: '해당 학년도', source: '출처', updated: 'YYYY-MM-DD' }
```

긴 분석 글과 도구는 별도 HTML 페이지로 만들고 해당 메뉴에 상대 경로로 연결합니다. 이미지·다운로드 파일도 공개가 승인된 것만 추가합니다. 기존 `banners` 데이터는 보존하며 현재 공통 페이지에서는 표시하지 않습니다.

- `explore/index.html`: 공통 디자인의 탐색 안내. 이전 해시 주소는 `assets/explore-redirect.js`가 해당 독립 페이지로 이동합니다.
- `archive/index.html`, `simulation/index.html`: 자료와 도구를 선택하는 독립 페이지. JavaScript가 꺼져도 안내와 도구 링크를 제공합니다.
- `assets/analysis.css`, `assets/site-header.css`: 모든 내부 페이지의 공통 디자인과 반응형 헤더.
- `assets/style.css`: 이전 테마의 보존 파일. 현재 페이지에서는 로드하지 않습니다.
- `assets/app.js`: 분야별 자료·도구 카드 생성
- `assets/content.js`: 공개 콘텐츠 목록

## 내신 비교와 목표 설계

- 공개 도구: https://ahntibody87.github.io/admissions-atlas/grades/
- `grades/index.html`, `assets/grades.css`, `assets/grades.js`: 01 내신 환산 분석기 / 02 목표 성적 시뮬레이션 / 03 내신 비교표.
- 이전 `grades.html` 주소는 검색 매개변수와 섹션 위치를 유지하며 새 주소로 이동합니다. JavaScript가 꺼져 있어도 새 주소 링크를 제공합니다.
- `assets/grade-model.js`: 기존 원표와 내신 합산·목표 역산 함수. `assets/grade-prediction.js`: 경기·부산·서울 자료를 활용한 3학기·5학기 예측 모델.
- 1.00~5.00 전체에서 9등급 추정값·추정 구간·누적비를 비교합니다. 서울 누락 구간은 표본 수를 유지하며 보정합니다. 전국 실측 순위나 대학 합격선이 아닙니다. 입력 기준은 국영수사과 단순 평균입니다.
- `assets/semester-plan.js`: 성적이 나온 마지막 학기(0~5학기), 학기별 단순 평균, 최종 목표를 받아 남은 학기의 필요 평균과 예상 최종 내신을 계산합니다. 기본은 동일 학기 비중이며 학기별 과목 수로 보정할 수 있습니다. 기존 `#target` 주소는 통합된 02 영역으로 이어집니다. 입력을 외부 서버로 보내거나 저장하지 않습니다.
- 화면의 숫자는 소수점 둘째 자리까지 표시합니다. 출처·표본·계산식·추정 구간의 정의는 [모델 문서](docs/grade-prediction.md)에 기록합니다. 원문 PDF·학생 자료는 배포하지 않습니다.
- 계산 검증: `node tests/grade-model.test.cjs`, `node tests/grade-prediction.test.cjs`, `node tests/semester-plan.test.cjs`.

이 사이트는 생명과학 홈페이지와 독립된 저장소이며 기존 사이트는 수정하지 않습니다.

## 대학별 전형 분석

- 목록: https://ahntibody87.github.io/admissions-atlas/analysis/
- 건국대: https://ahntibody87.github.io/admissions-atlas/analysis/konkuk/
- `assets/site-header.css`: 메인·분석 페이지의 동일한 상단 헤더 좌표. 본문 스크롤바 유무와 무관하게 뷰포트 단위로 정렬합니다.
- `assets/analysis.css`, `assets/analysis.js`: 클린 화이트, 연도별 모집인원 전환, 모집단위 검색·필터·연도 비교.
- `assets/konkuk-data.js`: 제공된 건국대 이미지 5장의 수치와 비교 기준. 원본 이미지는 재배포하지 않습니다.
- 모집단위 49개, 핵심 4개 전형 합계 검증: `node tests/konkuk-data.test.cjs`.
- `assets/fonts/PretendardVariable.woff2`: Pretendard 가변 글꼴. 라이선스는 `Pretendard-LICENSE.txt`.

### 29개 대학 확장 (2026.10.22)

전형 분석 목록에 29개 대학을 수록하고 대학 이름 검색을 추가했습니다. 각 대학은 건국대와 같은 다섯 항목(주요 내용, 전형별 기준, 수능 반영, 모집단위, 출처·비교 기준)과 연도 전환·검색·변경 항목 필터를 제공합니다.

- 건국대의 기존 HTML·데이터·상호작용은 유지합니다.
- 추가 28개 대학 데이터: `assets/universities/<slug>.json`. 각 파일에 모집단위·전형 기준·독립적으로 대조한 원본 열 합계·비교 범위·확인한 제공 자료명을 기록했습니다.
- 추가 대학 상호작용: `assets/university-analysis.js`. 대학별 열 수와 전형 이름을 반영하며 검색 결과 합계도 다시 계산합니다.
- 추가 스타일과 목록 검색: `assets/university-analysis.css`, `assets/university-index.js`. 기존 `analysis.css` 및 공통 헤더를 사용합니다.
- 2028 모집단위는 건국대 포함 1,788개입니다. 원본 이미지·압축 파일은 공개 저장소에 넣지 않습니다.
- 서울대 표는 비교 자료의 78개 핵심 모집단위 기준입니다. 연세대·충남대에는 제공 자료의 2027 모집단위별 표가 없어 비교 화면에 전형별 인원을 표시합니다. 세종대·중앙대의 제공 모집단위 표에는 모집군 열이 없어 그 필터를 비활성화합니다.
- 한국외대의 2028 모집단위 이미지는 합계가 잘려 있어 개별 행 합계와 전형 개요·비교 자료를 대조했습니다. 연세대 전기전자공학부의 원본 총원/전형별 합계 차이는 해당 페이지에 기록했습니다.
- 검증: `node tests/university-data.test.cjs`, `node tests/konkuk-data.test.cjs`, `node tests/grade-model.test.cjs`.



## 링크 공유 미리보기 — 2026-10-28

- 대표 이미지: `assets/social/ataa-share-v1.png` (1200×630 PNG). 원본 디자인은 같은 폴더의 `card-source.html`이며 ATLL의 기존 단백질 사진/ATAA의 기존 색상을 사용합니다.
- HTML head에 Open Graph 제목·설명·이미지·정규 주소와 큰 이미지용 Twitter Card를 제공합니다. ATLL 하위 페이지는 공통 생성기에서 페이지별 제목·설명을 넣습니다.
- 카카오톡에 이전 정보가 보이면 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 해당 URL의 공유 캐시를 초기화할 수 있습니다. 기존 대화에 이미 생성된 카드는 그대로 남을 수 있습니다.
