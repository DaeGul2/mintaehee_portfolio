# mintaehee_portfolio — 작업 노트

민태희 / MetLife 코리아 · GA Sales Process Innovation Partner 지원용 1인 포트폴리오 웹앱.
React 19 + Vite, KO/EN 이중 언어, 라이트/다크 토글, 드로어형 사이드바, A4 PDF 저장 지원.

## 스택
- **빌드**: Vite, ESLint, package-lock.json (npm)
- **프론트**: React 19, JSX 데이터 (sections.jsx / sections.en.jsx), Context 기반 i18n
- **폰트**: Pretendard Variable (jsdelivr) / JetBrains Mono · IBM Plex Sans KR (Google Fonts)
- **이미지**: `public/images/<프로젝트>/<파일명>` 절대경로 — Vite의 public 컨벤션

## 디렉토리
```
src/
├── App.jsx                    — 레이아웃 셸 (Sidebar + Main + ScrollTop), 인쇄 모드 분기
├── main.jsx                   — LanguageProvider + PrintProvider 래핑
├── index.css                  — 모든 스타일 (1줄 파일, ~2100줄)
├── i18n/
│   ├── strings.js             — UI 라벨 KO/EN (사이드바·내비·카드 라벨·토글 텍스트)
│   └── LanguageContext.jsx    — useLang() (lang, setLang, toggle, t)
├── data/
│   ├── sections.jsx           — KO 프로젝트 4개 데이터 (요약/journey/points/growth/relevance/photoGalleries) + judgmentMatrix + lectureTimeline
│   ├── sections.en.jsx        — EN 미러
│   └── useSections.js         — lang에 따라 KO/EN 분기
└── components/
    ├── Sidebar.jsx            — 좌측 메뉴, 드로어, 풋의 PDF 저장 버튼
    ├── Main.jsx               — About(인사+jd-map) / Profile / Projects / Teaching / Contact
    ├── ProjectCard.jsx        — 카드 헤더 + 펼침 본문 (overview/journey/points/galleries/data/feedback/growth/relevance)
    ├── GalleryModal.jsx       — 갤러리 카드 클릭 시 카테고리별 사진 모달
    ├── PhotoModal.jsx         — 사진 디테일 줌 모달
    ├── InlineGallery.jsx      — 인쇄 모드용 평탄화 갤러리 (모달 X, 인라인 그리드)
    ├── PrintContext.jsx       — printMode 상태, requestPrint() (폰트/이미지 대기 후 print)
    ├── PrintCover.jsx         — 인쇄 표지(첫 장) + 감사 페이지(마지막 장)
    ├── PrintButton.jsx        — 사이드바 풋의 "PDF로 저장" 버튼
    ├── ThemeToggle.jsx        — 라이트(기본)/다크 토글, localStorage `mh-theme`
    ├── LangToggle.jsx         — KO(기본)/EN, localStorage `mh-lang`
    ├── ScrollTop.jsx          — 우하단 맨 위로 버튼
    ├── FadeIn.jsx             — 섹션 IntersectionObserver 페이드 인
    └── MediaPlaceholder.jsx   — PhotoBlock (아직 사진 없는 자리 표시)
```

## 현재 프로젝트 카드 4개 (중요도 순)

| Index | id | 이름 | JD 직답 |
|---|---|---|---|
| 01 | p5-fund | 정부지원사업 자동 매칭 시스템 | "고객 프로필 → 적합 상품 자동 매칭"의 1:1 원형 — JD ② 영업지원 AI/ML |
| 02 | p1-ibco | 화장품사 통합 운영 ERP | 다차원 세일즈 데이터 분석 + DT 거버넌스 — JD ① + ③ |
| 03 | p2-jasoseo | AI 면접 질문지 생성 | Gen AI · 다단계 LLM 파이프라인 — JD ② |
| 04 | p3-doc | 채용 서류 자동 검증 시스템 | RPA · AI Agent · OCR 우대 3종 결합 |

이전에 있던 P4(법인카드)·P6(채용 결과 레포트)는 JD fit이 약해 데이터에서 제거됨.
공개 자산(`public/images/card-system/`, `public/images/chart/`)은 그대로 남아 있음 — 정리하려면 폴더 삭제만 하면 됨.

## "본 직무와의 연결고리" (JD FIT) 박스 — 카드 본문 최상단

각 ProjectCard 펼침 시 가장 먼저 보이는 강조 박스:
- 클래스 `.pcard-block-relevance` + `JD FIT` 배지 (CSS `::before`로 그림)
- 3줄(relevance.lines: tag + body) — body는 JSX 프래그먼트로 `<strong>` 강조
- `transfer` 필드는 모든 프로젝트에서 제거됨 (보험에 1:1 이식 가능 류 강제 매핑 문장 제거)

## 강조 시스템

전역 CSS:
- `<strong>` / `<b>`: accent 색(라이트=#0090da MetLife Blue, 다크=#4cc4f5) + 700 weight
- `<em>` / `<i>`: accent-2 색(라이트=#88b03b MetLife Lime, 다크=#c0d97a) + 600 italic
- 본문(p / li / dd / td) 내부 `<strong>`은 형광펜 그라데이션 배경 추가 (`background: linear-gradient(transparent 62%, var(--accent-soft) 62%)`)

각 프로젝트의 자세히보기 텍스트(points[].p / journey 단문 body / growth.points / blockSamples.body)에 KO 본문 핵심 어구를 `<strong>`으로 일괄 wrap 처리됨. 영어(sections.en.jsx)는 아직 미적용.

## 사이드바

- 화면: 사진 + 이름 + 역할 + 태그 + **생년월일(1996.09.10. · Male)** + **주소(경기도 수원시 장안구)** + 내비 5개 + 풋(테마 토글·언어 토글·이메일·PDF 저장 버튼·MetLife 지원)
- 드로어 동작: 데스크톱(>1024px)에서 `scrollY > 220px`에 자동 슬라이드 아웃, 좌상단 `MENU` 알약 버튼으로 재오픈, `scrollY < 60`까지 돌아왔다 다시 내릴 때만 자동 접힘 재발동 (수동 오픈 후 즉시 재닫힘 방지)
- 인쇄 모드에서는 사이드바 그대로 보이되, role/tag는 표지 페이지에 들어 있어 사이드바에서 숨김(`@media print { .sidebar .sb-role, .sb-tag { display: none } }`)

## 라이트 모드 = 기본

- `:root` 변수 = 라이트 팔레트(이전엔 다크였음)
- `:root[data-theme="dark"]`에서만 다크 변수 오버라이드
- ThemeToggle 초기값 'light' (저장된 값 없을 때)
- body 그라데이션도 동일 패턴

## PDF / A4 인쇄 모드

### 동작 흐름
사이드바 풋의 **`⎙ PDF로 저장`** 버튼 클릭 →
1. `requestPrint()`: 한국어 강제(`setLang('ko')`), printMode=true
2. 350~400ms 대기 후 `document.fonts.ready` + 모든 이미지 로딩 대기
3. `document.title`을 공백으로 (인쇄 헤더 타이틀 제거) → `window.print()`
4. 사용자가 인쇄 다이얼로그에서 "PDF로 저장" 선택 → 저장
5. `afterprint` 이벤트로 자동 복귀 + title 복원

### PDF 페이지 흐름
1. **표지** (`PrintCover`): PORTFOLIO · 2026 / 민태희 / 역할 / 태그 / accent 가로선 / MetLife 지원 카피
2. **프로필**: 사이드바(이름·사진·생년월일·주소·내비·이메일·MetLife)
3. **About**: 인사말 + JD 매핑 4개
4. **Education & Career**
5. **Selected Projects**: 4개 카드 자동 펼침 + JD FIT + journey + points + galleries(카테고리별 새 페이지) + data + feedback + growth + relevance
6. **Teaching**
7. **Contact**
8. **감사합니다.** (`PrintThanks`)

### A4 페이지 분할 규칙 (`@media print`)
- `@page { size: A4 portrait; margin: 22mm 20mm; }` — 종이 안전 거터
- `break-inside: avoid`: JD FIT 박스, points/growth/relevance 항목, journey 스테이지, 사진+캡션, 데이터 표 행, feedback 박스, ms-cell, profile-block, jd-map li, teach-item
- `break-before: page`: 각 섹션(profile/projects/teaching/contact), 각 .pcard, 각 .print-gal-section (단, `:first-of-type`은 `break-before: auto`로 첫 항목 보호)
- `break-after: avoid`: 모든 제목 → 본문과 분리 안 됨
- 표지·감사 페이지: `min-height` 제거(빈 페이지 발생 원인) + 큰 top padding으로 콘텐츠 위치 조정

### 카드/사이드바 인쇄 패딩
- @page 22mm/20mm 위에 카드 헤더 8mm, 본문 좌우 8mm, 블록 사이 7mm, JD FIT 7mm, 사진 4mm, 데이터셀 3mm × 4mm
- 사이드바: 프로필 페이지 좌우 12mm, sidebar-inner max-width 130mm 중앙 정렬
- 사진 max-height 72mm (한 페이지에 사진 2~3장 자연스럽게 적층)

### 인쇄 모드 폰트 강제
@media print 안에 모든 텍스트 요소에 폰트 명시:
- 본문: `Pretendard Variable, Pretendard, Apple SD Gothic Neo, Malgun Gothic, 맑은 고딕, IBM Plex Sans KR, ...`
- 모노스페이스: `JetBrains Mono, Consolas, D2Coding, Courier New, monospace`
이유: CDN 폰트가 print 시점에 폴백으로 떨어지는 케이스 차단 (이미 `document.fonts.ready` 대기는 함)

## 사용자가 알아둘 것 — 인쇄 다이얼로그

브라우저 인쇄 다이얼로그(Chrome 권장)에서:
- ✅ **"배경 그래픽 / Background graphics"** 체크 — JD FIT 박스의 accent 배경, 표 줄무늬, 형광펜 강조 등이 빠지지 않게
- ✅ **"머리글 및 바닥글" 해제** — 좌상단 날짜·우상단 페이지 번호·좌하단 URL(`localhost:5173` 등) 제거. Chrome은 도메인별로 기억함
- 여백: "기본" 그대로 (`@page` margin이 우선 적용)

## ESLint / 검증

작업 후 항상 `node @babel/parser`로 JSX 파싱 + CSS 중괄호 밸런스 검증함:
```bash
node -e "
const parser = require('@babel/parser');
const fs = require('fs');
for (const p of [...]) parser.parse(fs.readFileSync(p,'utf-8'),{sourceType:'module',plugins:['jsx']});
let depth=0; for (const c of fs.readFileSync('src/index.css','utf-8')) { if(c==='{')depth++; if(c==='}')depth--; }
console.log('parse OK; css brace balance:', depth);
"
```

## 자주 헷갈리는 포인트

- 데이터 파일은 KO와 EN **두 개** (`sections.jsx` + `sections.en.jsx`) — 한쪽 수정하면 다른 쪽도 같이 가져가야 함
- `judgmentMatrix`도 KO/EN 두 곳에 있음
- `Main.jsx`의 jd-map 리스트는 컴포넌트 안에 KO/EN 두 함수(`AboutBodyKo` / `AboutBodyEn`)로 분리
- 갤러리의 `caption` 필드는 `aria-label` / `alt`에 그대로 들어가므로 JSX 프래그먼트로 못 바꿈 — 갤러리 캡션 강조는 미적용
- 프로젝트의 `points[].p` / `growth.points[]` / `journey.stages[].body` (단문)는 JSX 프래그먼트로 변환됨 (강조 wrap)
- `relevance.lines[].body`도 JSX 프래그먼트
- `relevance.transfer` 필드는 더 이상 사용 안 함(데이터에서 제거 + ProjectCard 렌더링도 제거)
