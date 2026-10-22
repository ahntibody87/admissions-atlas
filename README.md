# ATAA — Ahntibody’s Admissions Atlas

- 사이트: https://ahntibody87.github.io/admissions-atlas/
- 공개 저장소: https://github.com/ahntibody87/admissions-atlas
- GitHub Pages: main 브랜치 / 루트

## 자료 반영 방법

자료를 Codex 대화에 첨부하고 “ATAA에 반영해줘”라고 요청합니다. 원본을 읽어 요약·표·비교 항목을 만들고, 적절한 메뉴를 선택하거나 제안합니다. 구체적인 메뉴를 매번 지정할 필요는 없습니다.

업로드는 공개 허가와 같지 않습니다. 개인정보·교사용 비공개 자료는 게시하지 않으며, 원문 재배포가 가능한지 불분명하면 원문 파일 대신 출처 링크와 분석을 사용합니다. 공식 자료의 사실과 개인 해석을 구분하고 학년도·출처·확인일을 기록합니다. 계산 도구는 기준·가정·적용 학년도를 표시합니다.

현재 사이트에는 파일 업로드나 자동 AI 분석 기능이 없습니다. AI 서버·DB 없이 GitHub Pages로 운영하며, 자료를 반영한 변경을 main에 push하면 다시 게시됩니다.

## 메뉴·배너 확장

메인은 아이보리·청록 아틀라스 디자인의 진입 화면입니다. 내신 설계는 `grades/`, 기존 자료실과 내부 배너는 `explore/`에 있습니다. 자료 아카이브·전형 분석·시뮬레이션 메뉴는 각각 `explore/#archive`, `explore/#analysis`, `explore/#simulation`으로 연결됩니다. 현재 자료가 없는 분야는 기존 빈 목록을 보여줍니다.

- `index.html`, `assets/landing.css`, `assets/landing.js`: 메인, 반응형 메뉴, 지도 경로 애니메이션, 사이트 소개 대화상자. 동작 줄이기 설정에서는 애니메이션을 끕니다.
- `assets/atlas-terrain.svg`, `assets/compass.svg`: 실제 지리를 나타내지 않는 탐색용 지도와 나침반 그래픽.
- `assets/fonts/`: Cormorant Garamond의 로컬 글꼴과 OFL 라이선스. 메인 로딩에 외부 글꼴 요청이 필요하지 않습니다.
- 위쪽 메뉴·지도·아래쪽 메뉴의 대상 주소는 함께 수정합니다. 메인 푸터 날짜는 수동으로 갱신합니다.

`assets/content.js`의 `sections` 배열에서 메뉴 이름과 순서, 소개, 자료 목록을 관리합니다. 항목을 추가하면 메뉴와 본문이 함께 생성됩니다. id는 영문 소문자로 시작하며 영문 소문자·숫자·하이픈만 사용합니다.

자료 항목 예시 형식(실제 자료로 교체):

```js
{ title: '자료 제목', description: '짧은 소개', href: '자료의 상대 경로 또는 https 주소', year: '해당 학년도', source: '출처', updated: 'YYYY-MM-DD' }
```

`banners` 배열에 `{ title, description, href, linkLabel }`을 넣으면 소개 아래 배너가 나타납니다. 비어 있으면 배너 영역이 표시되지 않습니다. 긴 분석 글과 시뮬레이션은 별도 HTML 페이지로 만들고 해당 메뉴에 상대 경로로 연결합니다. 이미지·다운로드 파일도 공개가 승인된 것만 추가합니다.

- `explore/index.html`: 내부 자료실 화면 구조
- `assets/style.css`: 종이색·자주색 테마와 모바일 화면
- `assets/app.js`: 메뉴·배너·자료 목록 생성
- `assets/content.js`: 공개 콘텐츠 목록

## 내신 비교와 목표 설계

- 공개 도구: https://ahntibody87.github.io/admissions-atlas/grades/
- `grades/index.html`, `assets/grades.css`, `assets/grades.js`: 위치 비교 / 고3 1학기 시뮬레이션 / 목표 역산 / 누적비 참고 배치표.
- 이전 `grades.html` 주소는 검색 매개변수와 섹션 위치를 유지하며 새 주소로 이동합니다. JavaScript가 꺼져 있어도 새 주소 링크를 제공합니다.
- `assets/grade-model.js`: 경기진협 2026 고2 3학기 실측 표와 윤희태 세미나 원고 53쪽의 5학기 AI 예측 조견표, 순수 계산 함수.
- 실측·예측은 분리하며, 대학·학과 배치나 합격 확률을 제공하지 않습니다. 예측표는 상위 1~30% 밖으로 외삽하지 않습니다. 학점 가중 결과에 단순 평균 누적비를 붙이지 않습니다.
- 고2 2학기까지의 평균과 반영량에 고3 1학기만 추가합니다. 목표 역산은 같은 현재 성적·반영량을 공유합니다. 입력을 외부 서버로 보내거나 저장하지 않습니다.
- 출처, 표본, 적용 학년도, 계산식과 해석 제한은 페이지 하단에 공개합니다. 원문 PDF·학생 자료는 배포하지 않습니다.
- 계산 검증: `node tests/grade-model.test.cjs`.

이 사이트는 생명과학 홈페이지와 독립된 저장소이며 기존 사이트는 수정하지 않습니다.
