# ATAA — Ahntibody’s Admissions Atlas

- 사이트: https://ahntibody87.github.io/admissions-atlas/
- 공개 저장소: https://github.com/ahntibody87/admissions-atlas
- GitHub Pages: main 브랜치 / 루트

## 자료 반영 방법

자료를 Codex 대화에 첨부하고 “ATAA에 반영해줘”라고 요청합니다. 원본을 읽어 요약·표·비교 항목을 만들고, 적절한 메뉴를 선택하거나 제안합니다. 구체적인 메뉴를 매번 지정할 필요는 없습니다.

업로드는 공개 허가와 같지 않습니다. 개인정보·교사용 비공개 자료는 게시하지 않으며, 원문 재배포가 가능한지 불분명하면 원문 파일 대신 출처 링크와 분석을 사용합니다. 공식 자료의 사실과 개인 해석을 구분하고 학년도·출처·확인일을 기록합니다. 계산 도구는 기준·가정·적용 학년도를 표시합니다.

현재 사이트에는 파일 업로드나 자동 AI 분석 기능이 없습니다. AI 서버·DB 없이 GitHub Pages로 운영하며, 자료를 반영한 변경을 main에 push하면 다시 게시됩니다.

## 메뉴·배너 확장

`assets/content.js`의 `sections` 배열에서 메뉴 이름과 순서, 소개, 자료 목록을 관리합니다. 항목을 추가하면 메뉴와 본문이 함께 생성됩니다. id는 영문 소문자로 시작하며 영문 소문자·숫자·하이픈만 사용합니다.

자료 항목 예시 형식(실제 자료로 교체):

```js
{ title: '자료 제목', description: '짧은 소개', href: '자료의 상대 경로 또는 https 주소', year: '해당 학년도', source: '출처', updated: 'YYYY-MM-DD' }
```

`banners` 배열에 `{ title, description, href, linkLabel }`을 넣으면 소개 아래 배너가 나타납니다. 비어 있으면 배너 영역이 표시되지 않습니다. 긴 분석 글과 시뮬레이션은 별도 HTML 페이지로 만들고 해당 메뉴에 상대 경로로 연결합니다. 이미지·다운로드 파일도 공개가 승인된 것만 추가합니다.

- `index.html`: 기본 화면 구조
- `assets/style.css`: 종이색·자주색 테마와 모바일 화면
- `assets/app.js`: 메뉴·배너·자료 목록 생성
- `assets/content.js`: 공개 콘텐츠 목록

이 사이트는 생명과학 홈페이지와 독립된 저장소이며 기존 사이트는 수정하지 않습니다.
