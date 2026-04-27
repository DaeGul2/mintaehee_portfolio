// 요약 PDF 전용 레이아웃 — 사진/갤러리 제거, 핵심 텍스트만 매우 압축.
// JD 직답 키워드(고객→상품 매칭, 다단계 LLM, RPA·OCR, DT 거버넌스 등)를 빠뜨리지 않게 강조.

import { useCallback, useState } from 'react';
import { toPng } from 'html-to-image';

// 페이지 한 장(.ps-page)을 PNG로 다운로드
async function downloadPage(pageEl, filename) {
  if (!pageEl) return;
  // 폰트가 모두 로딩된 뒤에 캡처해야 한글 폰트가 시스템 폴백으로 떨어지지 않음
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (_) {}
  }
  const dataUrl = await toPng(pageEl, {
    pixelRatio: 3,             // 고해상도 (3배 — 인쇄·확대 캡처 품질)
    backgroundColor: '#ffffff',
    cacheBust: true,
    filter: (node) => {
      // 다운로드 버튼 자체는 캡처에서 제외
      if (!node.classList) return true;
      return !node.classList.contains('ps-dl-btn');
    },
  });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function DownloadBtn({ targetRef, filename, label }) {
  const [busy, setBusy] = useState(false);
  const onClick = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await downloadPage(targetRef.current, filename);
    } catch (err) {
      console.error('Image export failed:', err);
      alert('이미지 저장 실패: ' + (err?.message || err));
    } finally {
      setBusy(false);
    }
  }, [targetRef, filename, busy]);
  return (
    <button
      type="button"
      className="ps-dl-btn"
      onClick={onClick}
      aria-label={`${label} 이미지 다운로드`}
      title="이 페이지를 고해상도 PNG로 저장"
      disabled={busy}
    >
      {busy ? '⏳ 저장 중…' : '⬇ PNG 저장'}
    </button>
  );
}

// .ps-page를 ref로 감싸고 다운로드 버튼을 함께 렌더하는 헬퍼
import { useRef } from 'react';
function CapturePage({ filename, label, className, children }) {
  const ref = useRef(null);
  return (
    <section className={className} ref={ref}>
      <DownloadBtn targetRef={ref} filename={filename} label={label} />
      {children}
    </section>
  );
}

const PROJECTS = [
  {
    no: '01',
    name: '정부지원사업 자동 매칭 시스템',
    period: '2025',
    role: '1인 풀스택 · 베타 13개사 · 공고 694건 · 매칭 227건 · 이메일 열람률 31.6%',
    tagline: '3단계 매칭 엔진과 GPT 검증으로 정부지원사업 개인화 추천 — 보험 상품 추천 스코어링의 직접적 원형',
    stack: ['React', 'Express 5', 'MySQL · Sequelize', 'OpenAI', 'SMS · 이메일 자동'],
    points: [
      <><strong>3단계 룰엔진 + GPT 2차 검증</strong> — 하드 조건 → 9항목 86점 만점 소프트 점수 → 키워드 보너스, 상위 10건만 GPT 호출</>,
      <><strong>점수 분포 정규화 운영 개선</strong> — "범용 공고 만점 통과로 70% 쏠림" 발견 후 임계값 12 → 45점 조정으로 종 모양 회복</>,
      <><strong>추천 시점 조건 JSON 박제</strong> — 9항목별 점수·보정계수까지 분해 저장, 사후 재현·감사 가능</>,
      <><strong>(고객, 공고) 캐시</strong> — GPT 호출 비용 사실상 0원 수렴</>,
      <>매칭 → 발송 → 열람 → 반응의 <strong>4단계 퍼널 추적</strong>이 시스템에 박혀 있음</>,
    ],
    journey: [
      { tag: '계기', body: '컨설턴트 신입↔베테랑 추천 격차 + 담당자가 공고를 매번 수기로 뒤지는 비효율을 시스템화.' },
      { tag: '문제·해결', body: 'A. 점수 70% 쏠림 → 하드 일부를 소프트로 이관, 임계값 12→45. B. GPT 비용 → 상위 10건만 + 캐시. C. 사후 재현 → 추천 시점 조건 JSON 박제.' },
      { tag: '현재', body: '13개사 운영, 추천 227건, 이메일 열람률 31.6% (업계 평균 20–25% 상회).' },
      { tag: '발전', body: '누적 데이터로 가중치를 휴리스틱 → ML 자동 학습 단계로 이전.' },
    ],
    relevance: [
      { tag: 'AI/ML 영업지원 모델', body: <>"<strong>고객 프로필 → 적합 상품 자동 매칭 + 추천 이유 자동 생성</strong>"의 정확한 원형 — 보험 상품 추천 스코어링과 1:1 대응.</> },
      { tag: '세일즈 퍼널·병목 분석', body: <>발송 → 열람 → 반응 → 피드백의 <strong>4단계 퍼널 추적</strong> — 매칭 → 가입 전환율·병목 가시화 가능.</> },
      { tag: '기술 거버넌스', body: <>추천 시점 조건 박제 + GPT 캐시 + 알고리즘 변경 이력 — 규제·감사 대응을 한 시스템에 결합.</> },
    ],
  },
  {
    no: '02',
    name: '화장품사 통합 운영 ERP',
    period: '2025.10 — Present',
    role: '1인 풀스택 · 운영 중 · 누적 주문 15,680건 · 매출 4억 916만원 · SKU 87개',
    tagline: '현장 17개 업무 문제를 자동화·부분자동화·사람 판단으로 분리해 설계한 통합 ERP',
    stack: ['React 19', 'Express 5', 'MySQL 이중 RDS', 'Sequelize', 'OpenAI', 'AWS EC2 · PM2', 'GitHub Actions'],
    points: [
      <><strong>17개 현장 인터뷰 → 시스템화</strong> — BOM 계층 + 전표/이동/LOT 3단계 추적 + 90일 이동평균 발주 예측</>,
      <><strong>"자동화 vs 사람 판단" 의식적 분리</strong> — 임시저장(DRAFT) → 검수 → 확정(CONFIRMED), 역전표 정정 흐름</>,
      <><strong>비즈니스 룰 어드민 8개로 외부화</strong> — 코드 배포 없이 운영자가 정책 즉시 반영</>,
      <><strong>4채널 비정형 엑셀 → 단일 스키마 정규화</strong> — 카페24·쿠팡·네이버·로켓그로스, 옵션 ID 자동 매핑</>,
      <><strong>GPT는 SQL 확정 수치만 받아 "해석"만 담당</strong> — 환각 차단 + 가격 시뮬레이터·날씨/이벤트/키워드 상관분석 결합</>,
      <><strong>회의 준비 2일 → 0</strong> — 1인이 설계·CI/CD 배포·운영까지 풀스택 책임</>,
    ],
    journey: [
      { tag: '계기', body: 'MD·영업기획 도메인 전문성이 잡무에 묻혀 회의에서 거의 안 쓰이던 구조 — 시스템이 잡무를 가져가면 도메인 판단이 회의의 본 안건이 됨.' },
      { tag: '문제·해결', body: 'A. 재고 추적 → BOM + 전표/이동/LOT 3단계. B. 다채널 통합 → 4채널 파서 + 옵션 ID 자동 매핑. C. 수익성·외부 변수 → 가격 분해 + 날씨 3,285일·이벤트·키워드 자동 태깅. D. 운영자 자율 → 비즈니스 룰 어드민 8개로 외부화.' },
      { tag: '현재', body: '회의 준비 2일 → 0. 현업 피드백: "잡무에 묻혀 못 쓰던 도메인 판단을 회의에서 실제로 쓸 수 있게 됐다."' },
      { tag: '발전', body: '자사+경쟁사 가격·키워드·리뷰·광고를 한 화면에 보는 All-in-One 통합 전략 에이전트.' },
    ],
    relevance: [
      { tag: '세일즈 데이터 분석·전략', body: <>채널·기간·상품·이벤트·날씨의 <strong>다차원 변수 결합</strong> — 영업 성과 측정·병목 분석을 한 시스템에서 운영.</> },
      { tag: 'DT 프로젝트 리딩·기술 거버넌스', body: <><strong>현장 인터뷰 → 데이터 모델 → CI/CD 실배포 → 운영 중 정책 변경</strong>까지 ERP 전 과정을 1인이 책임진 사례.</> },
      { tag: '정형·비정형 데이터 정규화', body: <>4개 채널 비정형 엑셀 → <strong>단일 스키마 정규화</strong> + 외부 변수(날씨·이벤트·키워드)까지 결합한 표준화.</> },
    ],
  },
  {
    no: '03',
    name: 'AI 면접 질문지 생성',
    period: '2025 — 2026.03',
    role: '1인 풀스택 · v1 누적 10개+ 공공기관 · v2 2개 기관 운영 중 · 178명 / 815건',
    tagline: '회사 주력 사업(공공기관 채용대행)을 AI 패러다임에 맞춰 재정비한 사내 AI 도구 — 수주 발표회의 핵심 차별화 자산',
    stack: ['React 19', 'Express', 'Sequelize · MySQL', 'GPT-4.1 / 4o-mini', 'pdf-parse', 'Docker'],
    points: [
      <><strong>"프롬프트는 코드가 아니라 데이터"</strong> — 40개 블록(요청 29 + 금지 11)을 DB로 관리, 채용 담당자가 시각적으로 조립</>,
      <><strong>다단계 LLM 파이프라인</strong> — GPT-4.1 생성 → GPT-4o-mini <strong>4축 검증</strong>(이미답·문맥·품질·금지)</>,
      <><strong>채용공고 PDF → 6직무 자동 분배</strong>(각 4,000–4,700자) → 70개 평가항목 자동 추출</>,
      <><strong>운영 데이터로 자동화 임계 박제</strong> — 안정형 815건 vs 실험형 0건 (어디까지가 의미 있는지가 데이터에 남음)</>,
      <>면접 평가자·내부 이사 호평: "직무 맞춤형이라든지, <strong>채용 유형(경력직, 신입)과 매우 잘 맞는다</strong>"</>,
    ],
    journey: [
      { tag: '계기', body: '공공기관 채용에 AI 도입 요구가 커지는 흐름을 사내에 먼저 들이고자 직접 제안·구축. 단순 GPT 호출은 일반론만 → 도메인 노하우(STAR · 드릴다운 · 민감정보 차단)를 시스템에 박는 방향.' },
      { tag: '문제·해결', body: 'A. 도메인 맥락 누락 → 공고 PDF에서 분야별 평가항목·인재상 자동 추출해 프롬프트 맥락으로 주입. B. 운영 권한이 IT에만 → 40개 블록 DB로 옮겨 채용 담당자 시각 조립. C. 출력 품질 → 4축 검증 + 미통과는 운영 데이터로 보존.' },
      { tag: '현재', body: '한국보육진흥원·aT 운영 중, 178명 / 815건. 회사 수주 발표 핵심 차별화 자산.' },
      { tag: '발전', body: '"어떤 블록 조합이 어떤 채용에 유효한지" 메타 추천 레이어, 다국어, 외부 SaaS 연동, 평가자 피드백 학습 루프.' },
    ],
    relevance: [
      { tag: 'Gen AI · LLM 비즈니스 적용', body: <><strong>다단계 LLM 파이프라인</strong>(생성 + 4축 검증) · 출력 형식 강제 · 캐시 — <strong>815건 실생성</strong>으로 검증된 운영 패턴.</> },
      { tag: 'AI/ML 영업지원 모델', body: <><strong>개발자 없이 도메인 전문가가 직접 프롬프트 수정</strong>하는 구조 — 같은 방식을 영업 도메인에 그대로 적용 가능.</> },
      { tag: '현업과 IT의 가교', body: <>도메인 노하우를 <strong>40개 블록으로 분해해 데이터화</strong> — 현업이 조립해 운영하는 구조.</> },
    ],
  },
  {
    no: '04',
    name: '채용 서류 자동 검증 시스템',
    period: '2024 — Present',
    role: '1인 · OCR 파이프라인 + RPA · 운영 중 · 누적 약 20,000건',
    tagline: '실제 제출서류 뭉치를 한 종류씩 직접 분석해 발급기관·레이아웃·식별자를 코드로 정립 — 한글 공문서 OCR + 13개 정부기관 진위조회',
    stack: ['Python · Flask', '네이버 CLOVA OCR', 'Selenium', 'Puppeteer', 'Pandas'],
    points: [
      <><strong>도메인 분석 → 9종 한글 공문서 자동 분류 + 서류별 맞춤 필드 추출기</strong> 코드화 (자격증·어학·우대·졸업·등본·건보·국민연금)</>,
      <><strong>13개 정부·공공기관 진위조회 자동 순회</strong> — 기관별 입력 필드 일대일 매핑, 동적 분기 흡수</>,
      <><strong>업무별 정밀도/재현율 정책 분리</strong> — 일치 판단 99.99% 정밀도(오류 0%) vs OCR 파싱 재현율 우선(약 95%)</>,
      <><strong>"입력은 자동 / 결과 확인은 사람"의 의도된 하이브리드</strong> — 진위조회는 법적 책임 단계라 자동화 폭을 일부러 좁힘</>,
      <>하루 100명 서류 검토 <strong>4–5시간 → 1시간 내</strong>로 단축, 100건당 약 5분 처리</>,
    ],
    journey: [
      { tag: '계기', body: '서류 검토 4–5시간/일을 시스템화. 단순 OCR API 호출로는 의미 없음 — 발급기관별 변형을 직접 코드화해야 추출이 의미를 가짐.' },
      { tag: '문제·해결', body: 'A. 일치 판단 거짓 양성 → 보수적 설계로 정밀도 99.99%, 확신 없으면 사람에게. B. OCR 누락 비용 → 같은 시스템에서 정책 갈라 재현율 우선(약 95%). C. 진위조회 법적 책임 → 입력만 자동, 결과 확인은 사람으로 자동화 폭 의도적 축소.' },
      { tag: '현재', body: '누적 약 20,000건 운영, OCR 약 95%, 13개 정부기관 자동 순회.' },
      { tag: '발전', body: '신규 서식 패턴 자동 학습으로 분류 룰 자동 갱신, 진위조회 결과 화면도 OCR 자동 검증으로 확장.' },
    ],
    relevance: [
      { tag: 'RPA · AI Agent · OCR (우대)', body: <><strong>우대 3종을 한 흐름에 결합</strong> — 13개 정부기관 자동 순회 + 한글 공문서 9종 OCR + End-to-End 파이프라인.</> },
      { tag: '정형·비정형 데이터 정규화', body: <>비정형 공문서 → <strong>9종 자동 분류 + 필드 추출 → 정형 체크리스트</strong>의 표준화 파이프라인.</> },
      { tag: '운영 맥락 시나리오 설계', body: <>하루 100명 검토를 <strong>4–5시간 → 1시간 내</strong>로 단축, <strong>법적 책임 단계는 사람에게 남긴 의도된 하이브리드</strong>.</> },
    ],
  },
];

const LECTURES = [
  { year: '2023', title: '충청 ICT 풀스택 개발 강의', meta: '학생 43명 · 평점 4.6', body: 'HTML/CSS/JS 기초 → React/Express/GitHub. DB 설계 → CRUD → 배포 풀스택 흐름.' },
  { year: '2024', title: 'LG이노텍 · LG화학 ML / AI 기초', meta: '각 1개월 · 대기업 임직원', body: 'scikit-learn으로 공공 데이터 상관분석, matplotlib·seaborn 시각화, pandas·numpy, CNN 기초.', highlight: true },
  { year: '2025.12', title: '사내 GPT · 업무 자동화 강의', meta: '임직원 20명 · 6시간', body: 'PowerShell OS 자동화, Python 엑셀 자동화, 데이터 구조와 가벼운 DB 개념.' },
];

function ProjectShort({ p }) {
  const slug = p.name.replace(/\s+/g, '');
  return (
    <>
      {/* Page 1 — 소개 + 핵심 특징 */}
      <CapturePage
        className="ps-page ps-page-1"
        filename={`mintaehee-${p.no}-${slug}-1.png`}
        label={`${p.no} ${p.name} 소개`}
      >
        <header className="ps-head">
          <span className="ps-no">{p.no}</span>
          <div className="ps-head-main">
            <h2 className="ps-name">{p.name}</h2>
            <p className="ps-role">{p.role}</p>
          </div>
          <span className="ps-period">{p.period}</span>
        </header>
        <p className="ps-tagline">{p.tagline}</p>
        <ul className="ps-stack">
          {p.stack.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
        <h3 className="ps-block-title">핵심 특징</h3>
        <ul className="ps-points">
          {p.points.map((pt, i) => <li key={i}>{pt}</li>)}
        </ul>
      </CapturePage>

      {/* Page 2 — 흘러온 길 + 본 직무와의 연결고리 (좌·우 2단) */}
      <CapturePage
        className="ps-page ps-page-2"
        filename={`mintaehee-${p.no}-${slug}-2.png`}
        label={`${p.no} ${p.name} 흘러온 길`}
      >
        <div className="ps-twocol">
          <div className="ps-col ps-col-journey">
            <h3 className="ps-block-title">프로젝트가 흘러온 길</h3>
            <ul className="ps-journey">
              {p.journey.map((j, i) => (
                <li key={i}>
                  <span className="ps-jtag">{j.tag}</span>
                  <span className="ps-jbody">{j.body}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ps-col ps-col-relevance">
            <h3 className="ps-block-title ps-jdfit">본 직무와의 연결고리</h3>
            <ul className="ps-relevance">
              {p.relevance.map((r, i) => (
                <li key={i}>
                  <span className="ps-rtag">{r.tag}</span>
                  <span className="ps-rbody">{r.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CapturePage>
    </>
  );
}

export function ShortPrintLayout() {
  return (
    <div className="print-short">
      {/* Page 01 — About 전체 (인사말 + 본문 + JD 매핑) */}
      <CapturePage
        className="ps-page ps-intro"
        filename="mintaehee-01-소개.png"
        label="01 소개"
      >
        <header className="ps-intro-head">
          <span className="ps-intro-kicker">01 / 소개</span>
          <h1 className="ps-intro-name">민태희</h1>
          <p className="ps-intro-role">업무 프로세스 시나리오 설계자 — 복잡한 흐름을 단순한 시나리오로</p>
          <p className="ps-intro-meta">1996.09.10 · Male · 경기도 수원시 장안구 · alsxogml1234@gmail.com</p>
          <p className="ps-intro-apply">지원 — MetLife 코리아 · GA Sales Process Innovation Partner</p>
        </header>

        <blockquote className="ps-intro-quote">
          <span>현장과 IT가 만나는 자리에 섭니다.</span>
          <span><em>복잡한 현장의 흐름</em>을 <em>단순한 시나리오</em>로 그려냅니다.</span>
        </blockquote>

        <p className="ps-intro-body">
          현장의 워크프로세스를 데이터와 구조로 재정의하고 시스템화하여, 비즈니스 운영에 소요되는 시간과 비용을 최적화하는 일을 합니다.
          <strong> 비즈니스의 정성적 맥락을 정량적 데이터 구조로 치환하고, 워크플로우의 데이터 흐름을 재설계하여 최적의 자동화 임계치를 결정하는 것</strong>을 핵심 역량으로 봅니다.
        </p>
        <p className="ps-intro-body">
          아래 4개 프로젝트는 본 채용 직무 — <strong>MetLife 코리아 · GA Sales Process Innovation Partner</strong> — 의 세 핵심 축에 직접 연결됩니다.
          (1) 데이터 기반 세일즈 전략 및 혁신 과제 수립 / (2) 세일즈 프로세스 자동화 및 AI/ML 모델 구축 / (3) DT 프로젝트 매니징 및 기술 거버넌스.
        </p>

        <h2 className="ps-block-title">JD 직답 매핑 — 4개 프로젝트</h2>
        <ul className="ps-jdmap">
          <li><span className="ps-jno">01</span><span className="ps-jname">정부지원사업 자동 매칭 시스템</span><span className="ps-jtag2"><strong>고객 프로필 → 적합 상품 자동 매칭</strong>의 1:1 원형 · 보험 상품 추천 스코어링과 직접 대응</span></li>
          <li><span className="ps-jno">02</span><span className="ps-jname">화장품사 통합 운영 ERP</span><span className="ps-jtag2"><strong>다차원 세일즈 데이터 분석</strong> · 1인 풀스택으로 ERP 전 과정 책임 (DT 거버넌스)</span></li>
          <li><span className="ps-jno">03</span><span className="ps-jname">AI 면접 질문지 생성</span><span className="ps-jtag2"><strong>Gen AI · 다단계 LLM 파이프라인</strong> · "프롬프트는 코드가 아니라 데이터"로 현업이 직접 운영</span></li>
          <li><span className="ps-jno">04</span><span className="ps-jname">채용 서류 자동 검증 시스템</span><span className="ps-jtag2"><strong>RPA · AI Agent · OCR 우대 3종</strong>을 한 흐름에 결합 · 보험 KYC·언더라이팅 직접 이식</span></li>
        </ul>
      </section>

      {/* Page 02 — Profile (학력 + 경력) */}
      <section className="ps-page ps-profile-page">
        <header className="ps-page-kicker"><span>02 / 학력·경력</span></header>
        <div className="ps-profile-grid">
          <div>
            <h2 className="ps-block-title">학력</h2>
            <ul className="ps-profile-list">
              <li><span className="ps-pdate">학사</span><span className="ps-pbody">성균관대학교 — 철학 &amp; 소프트웨어 연계전공 (복수전공)</span></li>
            </ul>
          </div>
          <div>
            <h2 className="ps-block-title">주요 경력</h2>
            <ul className="ps-profile-list">
              <li><span className="ps-pdate">2023.03</span><span className="ps-pbody">K-empowerment Software BootCamp 대상</span></li>
              <li><span className="ps-pdate">2023.04 – 07</span><span className="ps-pbody">충청 ICT 풀스택 개발 강사</span></li>
              <li><span className="ps-pdate">2024.03</span><span className="ps-pbody">LG이노텍 · LG화학 데이터분석 / ML / AI 기초 강사</span></li>
              <li><span className="ps-pdate">2024.09 – 현재</span><span className="ps-pbody">(주) 인사바른 채용컨설팅본부 연구원</span></li>
            </ul>
          </div>
        </div>

        <h2 className="ps-block-title">강의 이력 — ML / AI / 업무 자동화</h2>
        <ul className="ps-lecture-list">
          {LECTURES.map((l, i) => (
            <li key={i} className={l.highlight ? 'highlight' : ''}>
              <div className="ps-lec-head">
                <span className="ps-lec-year">{l.year}</span>
                <span className="ps-lec-title">{l.title}</span>
                <span className="ps-lec-meta">{l.meta}</span>
              </div>
              <p className="ps-lec-body">{l.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="ps-block-title">연락처</h2>
        <ul className="ps-contact-list">
          <li><span className="ps-ckey">이메일</span><span className="ps-cval">alsxogml1234@gmail.com</span></li>
          <li><span className="ps-ckey">지원</span><span className="ps-cval">MetLife 코리아 · GA Sales Process Innovation Partner</span></li>
        </ul>
        <p className="ps-tail-foot">© 2026 민태희</p>
      </section>

      {/* 4 projects × 2 pages */}
      {PROJECTS.map((p) => <ProjectShort key={p.no} p={p} />)}
    </div>
  );
}
