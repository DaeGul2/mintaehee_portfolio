// 요약 PDF 전용 레이아웃 — 사진/갤러리 제거, 핵심 텍스트만 매우 압축.
// JD 직답 키워드(고객→상품 매칭, 다단계 LLM, RPA·OCR, DT 거버넌스 등)를 빠뜨리지 않게 강조.

import { useCallback, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

// 페이지 한 장(.ps-page)을 PNG로 다운로드 — 콘텐츠 높이만큼만 잘라서 저장
async function downloadPage(pageEl, filename) {
  if (!pageEl) return;
  // 폰트가 모두 로딩된 뒤에 캡처해야 한글 폰트가 시스템 폴백으로 떨어지지 않음
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (_) {}
  }

  // 시트는 시각적으로 A4(min-height: 297mm)지만 캡처에선 빈 여백을 잘라야 함.
  // min-height를 일시적으로 풀어 자연 높이를 측정 → 즉시 복원 → toPng에 명시적 height 전달.
  const originalMinHeight = pageEl.style.minHeight;
  pageEl.style.minHeight = '0';
  // 강제 reflow (브라우저가 새 레이아웃을 계산하도록)
  void pageEl.offsetHeight;
  const naturalHeight = Math.ceil(pageEl.scrollHeight);
  const naturalWidth = Math.ceil(pageEl.scrollWidth);
  pageEl.style.minHeight = originalMinHeight;

  const dataUrl = await toPng(pageEl, {
    pixelRatio: 3,             // 고해상도 (3배)
    backgroundColor: '#ffffff',
    cacheBust: true,
    width: naturalWidth,
    height: naturalHeight,
    style: {
      // 클론에서도 min-height를 풀어 빈 여백이 안 따라오도록
      minHeight: '0',
      height: naturalHeight + 'px',
      margin: '0',
      boxShadow: 'none',
    },
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

// 오늘 날짜를 "YYYY. MM. DD." 포맷으로 — 짧은 뷰가 열릴 때마다 새로 계산됨
function getTodayKR() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${day}.`;
}

// .ps-page를 ref로 감싸고 다운로드 버튼을 함께 렌더하는 헬퍼
function CapturePage({ filename, label, className, children }) {
  const ref = useRef(null);
  return (
    <section className={className} ref={ref} data-filename={filename}>
      <DownloadBtn targetRef={ref} filename={filename} label={label} />
      {children}
    </section>
  );
}

// 전체 페이지 일괄 PNG 다운로드 바
function BulkDownloadBar() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const onClick = useCallback(async () => {
    if (busy) return;
    const pages = Array.from(document.querySelectorAll('.print-short .ps-page'));
    if (pages.length === 0) return;
    setBusy(true);
    setProgress({ done: 0, total: pages.length });
    try {
      // 폰트는 첫 캡처 전에 한 번만 대기
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }
      for (let i = 0; i < pages.length; i++) {
        const el = pages[i];
        const filename = el.dataset.filename || `mintaehee-page-${i + 1}.png`;
        await downloadPage(el, filename);
        setProgress({ done: i + 1, total: pages.length });
        // 브라우저가 연속 다운로드를 합치지 않도록 약간의 간격
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch (err) {
      console.error('Bulk export failed:', err);
      alert('일괄 저장 중 오류: ' + (err?.message || err));
    } finally {
      setBusy(false);
      setTimeout(() => setProgress({ done: 0, total: 0 }), 1500);
    }
  }, [busy]);

  return (
    <div className="ps-bulkbar">
      <button
        type="button"
        className="ps-bulk-btn"
        onClick={onClick}
        disabled={busy}
        aria-label="모든 페이지 PNG 일괄 다운로드"
      >
        {busy
          ? `⏳ 저장 중… (${progress.done} / ${progress.total})`
          : '⬇ 전체 PNG 일괄 다운로드'}
      </button>
      <span className="ps-bulkbar-hint">
        브라우저가 "여러 파일 다운로드 허용?" 을 묻거든 허용해줘.
      </span>
    </div>
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
    growth: [
      <><strong>외부 데이터를 시스템을 닫지 않은 채 자동화</strong> — 100% 정형으로 떨어지지 않는 공고를 강제 정형화 대신 운영 데이터로 카테고리화. 새 값은 "pending"으로 적재 후 사람이 승인해 enum으로 승급하는 운영 흐름까지 설계.</>,
      <>단순 if-else가 아닌 <strong>계층·가중치·임계값으로 구조화하는 룰엔진 설계 사고</strong>.</>,
      <>운영 데이터를 보고 <strong>알고리즘을 한 차례 개선</strong>해 본 경험 — 점수 분포 쏠림 진단 → 항목 이관 → 임계값 재설정.</>,
      <><strong>추천 시점의 조건을 그대로 박제</strong>해 사후에 재현 가능하게 만드는 <strong>규제·감사 환경의 데이터 설계</strong>.</>,
    ],
    feedback: null,
    photos: [
      { src: '/images/one-two-fund/대시보드.png', caption: '운영 대시보드 — 누적 크롤링·매칭 진행률·이메일 퍼널을 한 화면에 통합' },
      { src: '/images/one-two-fund/AI매칭돌려서 추천 목록.png', caption: '추천 결과 — 점수·적합도 순으로 정렬된 최종 공고 목록' },
      { src: '/images/one-two-fund/공고 상세테이블1_티어1부터3까지나눈모습.png', caption: '공고 분류 — Tier 1~3 자동 분류, 운영자가 분류 품질을 검토·정정' },
      { src: '/images/one-two-fund/추천이메일예시_실제로 추천 정부지원사업을 등록된 이메일로 자동으로 보내줌.png', caption: '추천 이메일 자동 발송 — 발송 후 열람·반응까지 추적' },
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
    growth: [
      <>실무자가 매일 부딪히는 업무 문제를 <strong>현장 인터뷰</strong>로 정리해 <strong>"시스템이 할 일 / 사람이 판단할 일"의 경계</strong>를 구체적으로 그어내는 시야.</>,
      <>운영 담당자가 <strong>코드 배포 없이 정책을 직접 조정</strong>할 수 있도록 <strong>비즈니스 룰을 데이터로 빼두는 설계</strong> — 시스템이 현업의 손에서 살아 움직이게 만드는 방식.</>,
      <>자동화 결과를 그대로 신뢰하는 게 아니라 <strong>검수 단계와 정정 흐름(임시 저장·확정·역전표)</strong>을 의식적으로 남겨 운영 안정성과 도메인 판단 여지를 동시에 확보.</>,
      <>엔터프라이즈 시스템을 <strong>설계 → 배포 → 운영까지 1인 책임</strong> — 도메인 인터뷰 → 데이터 모델 → 자동화 임계치 → 운영 안정화의 전 과정 흐름.</>,
    ],
    feedback: {
      text: '회의 준비에 들이던 시간이 사라졌고, 그동안 잡무에 묻혀 있던 MD·마케팅 도메인 판단을 회의에서 실제로 쓸 수 있게 되었다.',
      cite: '운영 중 현업 MD · 영업기획팀',
    },
    photos: [
      { src: '/images/ibco-erp/dashboard1.png', caption: '통합 대시보드 — 채널별 흩어진 엑셀을 단일 화면으로 통합' },
      { src: '/images/ibco-erp/factpack2.png', caption: '가격 탄력성 · 이벤트 효과 · 마진 심층 분석 (SQL이 계산, GPT는 해석만)' },
      { src: '/images/ibco-erp/판매추이2.png', caption: '판매 시계열 + 가격·이벤트 결합 — 매출 변동 가설을 데이터 위에서 검증' },
      { src: '/images/ibco-erp/이벤트마진시뮬레이터.png', caption: '프로모션 마진 사전 시뮬레이터 — 채널 수수료까지 반영, 역마진 차단' },
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
    growth: [
      <><strong>"프롬프트는 코드가 아니라 데이터"</strong>라는 관점 — <strong>LLM 운영 권한을 도메인 전문가에게 넘기는</strong> 시스템 설계 사고.</>,
      <>단발 호출이 아닌 <strong>다단계 LLM 파이프라인</strong> — 생성 모델과 검증 모델을 분리하고, 검증 결과까지 운영 데이터로 남기는 흐름을 직접 구축.</>,
      <>LLM 출력 안정화의 운영 노하우 — <strong>출력 형식 강제 · 금지 규칙 명문화 · 실행 시점 스냅샷 보존</strong>을 결합해 자동 생성 결과를 사후에도 추적·재현 가능하게.</>,
      <>채용이라는 도메인의 <strong>암묵 지식을 블록 단위 데이터 모델</strong>로 분해해 코드화 — 보험·법무 등 다른 도메인에도 같은 방식 적용 가능.</>,
    ],
    feedback: {
      text: '직무 맞춤형이라든지, 채용 유형(경력직, 신입)과 매우 잘 맞는다. 한 사람 기준으로 보면 질문이 다채로워서 괜찮다.',
      cite: '면접 평가자 · 내부 이사',
    },
    photos: [
      { src: '/images/ai-interview/프로젝트 별로 블록 설정하는 곳_평가방법_해선느 안 되는 판단 등.png', caption: '프롬프트 블록 시각 조립 — 채용 담당자가 직접 도메인 노하우를 운영' },
      { src: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면1_종합요약.png', caption: '지원자 적합성 종합 요약 — 면접관이 검증·판단에만 집중하도록 사전 정리' },
      { src: '/images/ai-interview/ai면접질문지생성된화면.png', caption: '자동 생성된 면접질문지 — 4축 검증(이미답·문맥·품질·금지)을 통과한 질문만 표시' },
      { src: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면4_교차검증_자소서와 실제 입사지원서에 등록한 각종 서류들 내용 일치하는지 파악.png', caption: '자소서 ↔ 서류 교차 검증 — 자소서엔 있고 서류엔 없는 케이스 사전 탐지' },
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
    growth: [
      <>하나의 시스템 안에서도 <strong>업무 단위마다 정밀도·재현율 정책이 갈라질</strong> 수 있다는 지표 설계 관점 — "보안성 중요한 일은 정밀도, 누락 방지 중요한 일은 재현율"의 일관된 분리 방식.</>,
      <><strong>실제 제출서류 뭉치를 직접 분석</strong>해 발급기관별 변형·레이아웃·식별자를 <strong>코드로 정립</strong>하는 도메인 분석 역량.</>,
      <><strong>"입력 자동화 + 판단은 사람"의 의도된 하이브리드</strong> — 법적 책임이 따르는 단계에서는 일부러 자동화 폭을 좁히는 시스템 설계 결정.</>,
      <>여러 기관 사이트의 변형을 <strong>동적 분기로 흡수</strong>하는 자동화 설계 — 봇 탐지 우회와 대량 처리 안정성을 함께 묶어내는 운영 노하우.</>,
    ],
    feedback: null,
    photos: [
      { src: '/images/isbr-doc/OCR_처리결과UI.png', caption: 'OCR 추출 결과 UI — 서류 종류별 자동 그룹핑, "정규식/GPT" 배지로 신뢰도 즉시 판단' },
      { src: '/images/isbr-doc/OCR_처리결과_상세페이지_yolo로확인.png', caption: 'YOLO 영역 오버레이 — 추출값을 원본 위에서 시각적으로 검산' },
      { src: '/images/isbr-doc/진위조회 인증 실제 사진_지원자의 문서번호와 그 결과를 좌우로 분기해서 한 화면에 캡처를 하여 이 지원자가 입력한 값이 진위가 확인됐음을 증거로남겨줌.png', caption: '진위조회 인증 캡처 — 사후 감사·법적 분쟁 대비용으로 자동 보존' },
      { src: '/images/isbr-doc/처리결과 zip파일 목록_처리완료된 서류 카테고리만큼 폴더가 생기고 거기에 진위조회 결과 인증 사진들을 넣어줌 또한 엑셀에 디버깅이 찍힘.png', caption: '결과 ZIP 패키지 — 인증 사진 + 디버깅 엑셀이 한 패키지로 묶여 보관' },
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
      {/* Page 1 — 소개 + 핵심 특징 (16:9 landscape: 좌 소개 / 우 핵심 특징) */}
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
        <div className="ps-twocol ps-twocol-intro">
          <div className="ps-col">
            <p className="ps-tagline">{p.tagline}</p>
            <ul className="ps-stack">
              {p.stack.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="ps-col">
            <h3 className="ps-block-title">핵심 특징</h3>
            <ul className="ps-points">
              {p.points.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
          </div>
        </div>
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

      {/* Page 3 — 이 프로젝트로 얻은 것 + 현업 피드백 */}
      <CapturePage
        className="ps-page ps-page-3"
        filename={`mintaehee-${p.no}-${slug}-3.png`}
        label={`${p.no} ${p.name} 얻은 것`}
      >
        <header className="ps-mini-head">
          <span className="ps-mini-no">{p.no}</span>
          <span className="ps-mini-name">{p.name}</span>
          <span className="ps-mini-sep">/</span>
          <span className="ps-mini-section">이 프로젝트로 얻은 것 · 현업 피드백</span>
        </header>
        <div className={`ps-twocol ${p.feedback ? '' : 'ps-twocol-single'}`}>
          <div className="ps-col">
            <h3 className="ps-block-title">이 프로젝트로 얻은 것</h3>
            <ul className="ps-growth">
              {p.growth.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
          {p.feedback && (
            <div className="ps-col ps-col-feedback">
              <h3 className="ps-block-title">현업 피드백</h3>
              <blockquote className="ps-feedback">
                <p className="ps-feedback-text">"{p.feedback.text}"</p>
                <p className="ps-feedback-cite">— {p.feedback.cite}</p>
              </blockquote>
            </div>
          )}
        </div>
      </CapturePage>

      {/* Page 4 — 대표 화면 (사진) */}
      <CapturePage
        className="ps-page ps-page-4"
        filename={`mintaehee-${p.no}-${slug}-4.png`}
        label={`${p.no} ${p.name} 화면`}
      >
        <header className="ps-mini-head">
          <span className="ps-mini-no">{p.no}</span>
          <span className="ps-mini-name">{p.name}</span>
          <span className="ps-mini-sep">/</span>
          <span className="ps-mini-section">대표 화면</span>
        </header>
        <div className="ps-photo-grid">
          {p.photos.map((ph, i) => (
            <figure key={i} className="ps-photo">
              <img src={ph.src} alt={ph.caption} loading="lazy" crossOrigin="anonymous" />
              <figcaption>{ph.caption}</figcaption>
            </figure>
          ))}
        </div>
      </CapturePage>
    </>
  );
}

function CoverPage() {
  const today = getTodayKR();
  return (
    <CapturePage
      className="ps-page ps-cover"
      filename="mintaehee-00-표지.png"
      label="표지"
    >
      <div className="ps-cover-inner">
        <span className="ps-cover-kicker">PORTFOLIO · 2026</span>
        <h1 className="ps-cover-name">민태희</h1>
        <p className="ps-cover-role">업무 프로세스 시나리오 설계자</p>
        <p className="ps-cover-tag">복잡한 흐름을 단순한 시나리오로</p>
        <div className="ps-cover-rule" aria-hidden="true" />
        <dl className="ps-cover-apply">
          <div><dt>지원회사</dt><dd>MetLife 코리아</dd></div>
          <div><dt>지원분야</dt><dd>GA Sales Process Innovation Partner</dd></div>
          <div><dt>제출일</dt><dd>{today}</dd></div>
        </dl>
      </div>
    </CapturePage>
  );
}

function ThanksPage() {
  return (
    <CapturePage
      className="ps-page ps-thanks"
      filename="mintaehee-99-감사.png"
      label="감사"
    >
      <div className="ps-thanks-inner">
        <h1 className="ps-thanks-title">감사합니다.</h1>
        <div className="ps-thanks-rule" aria-hidden="true" />
        <p className="ps-thanks-name">민태희</p>
        <p className="ps-thanks-mail">alsxogml1234@gmail.com</p>
        <p className="ps-thanks-apply">MetLife 코리아 · GA Sales Process Innovation Partner</p>
      </div>
    </CapturePage>
  );
}

export function ShortPrintLayout() {
  return (
    <div className="print-short">
      <BulkDownloadBar />

      {/* Page 00 — 표지 */}
      <CoverPage />

      {/* Page 01 — About 전체 (인사말 + 본문 + JD 매핑) — 16:9 landscape 2단 */}
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

        <div className="ps-twocol ps-twocol-intro">
          <div className="ps-col">
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
          </div>
          <div className="ps-col">
            <h2 className="ps-block-title">JD 직답 매핑 — 4개 프로젝트</h2>
            <ul className="ps-jdmap">
              <li><span className="ps-jno">01</span><span className="ps-jname">정부지원사업 자동 매칭 시스템</span><span className="ps-jtag2"><strong>고객 프로필 → 적합 상품 자동 매칭</strong>의 1:1 원형 · 보험 상품 추천 스코어링과 직접 대응</span></li>
              <li><span className="ps-jno">02</span><span className="ps-jname">화장품사 통합 운영 ERP</span><span className="ps-jtag2"><strong>다차원 세일즈 데이터 분석</strong> · 1인 풀스택으로 ERP 전 과정 책임 (DT 거버넌스)</span></li>
              <li><span className="ps-jno">03</span><span className="ps-jname">AI 면접 질문지 생성</span><span className="ps-jtag2"><strong>Gen AI · 다단계 LLM 파이프라인</strong> · "프롬프트는 코드가 아니라 데이터"로 현업이 직접 운영</span></li>
              <li><span className="ps-jno">04</span><span className="ps-jname">채용 서류 자동 검증 시스템</span><span className="ps-jtag2"><strong>RPA · AI Agent · OCR 우대 3종</strong>을 한 흐름에 결합 · 보험 KYC·언더라이팅 직접 이식</span></li>
            </ul>
          </div>
        </div>
      </CapturePage>

      {/* Page 02 — Profile (학력 + 경력 / 강의 + 연락처) — 16:9 2단 */}
      <CapturePage
        className="ps-page ps-profile-page"
        filename="mintaehee-02-학력경력.png"
        label="02 학력·경력"
      >
        <header className="ps-page-kicker"><span>02 / 학력·경력</span></header>
        <div className="ps-twocol ps-twocol-profile">
          <div className="ps-col">
            <h2 className="ps-block-title">학력</h2>
            <ul className="ps-profile-list">
              <li><span className="ps-pdate">학사</span><span className="ps-pbody">성균관대학교 — 철학 &amp; 소프트웨어 연계전공 (복수전공)</span></li>
            </ul>
            <h2 className="ps-block-title">주요 경력</h2>
            <ul className="ps-profile-list">
              <li><span className="ps-pdate">2023.03</span><span className="ps-pbody">K-empowerment Software BootCamp 대상</span></li>
              <li><span className="ps-pdate">2023.04 – 07</span><span className="ps-pbody">충청 ICT 풀스택 개발 강사</span></li>
              <li><span className="ps-pdate">2024.03</span><span className="ps-pbody">LG이노텍 · LG화학 데이터분석 / ML / AI 기초 강사</span></li>
              <li><span className="ps-pdate">2024.09 – 현재</span><span className="ps-pbody">(주) 인사바른 채용컨설팅본부 연구원</span></li>
            </ul>
            <h2 className="ps-block-title">연락처</h2>
            <ul className="ps-contact-list">
              <li><span className="ps-ckey">이메일</span><span className="ps-cval">alsxogml1234@gmail.com</span></li>
              <li><span className="ps-ckey">지원</span><span className="ps-cval">MetLife 코리아 · GA Sales Process Innovation Partner</span></li>
            </ul>
          </div>
          <div className="ps-col">
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
            <p className="ps-tail-foot">© 2026 민태희</p>
          </div>
        </div>
      </CapturePage>

      {/* 4 projects × 4 pages */}
      {PROJECTS.map((p) => <ProjectShort key={p.no} p={p} />)}

      {/* Page 99 — 감사 */}
      <ThanksPage />
    </div>
  );
}
