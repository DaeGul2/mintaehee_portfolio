import { FadeIn } from './FadeIn';
import { ProjectCard } from './ProjectCard';
import { useSections } from '../data/useSections';
import { useLang } from '../i18n/LanguageContext';

function SectionTitle({ id, kicker, title }) {
  return (
    <header className="sec-head" id={`${id}-head`}>
      <span className="sec-kicker">{kicker}</span>
      <h2 className="sec-title">{title}</h2>
    </header>
  );
}

function AboutBodyKo() {
  return (
    <>
      <blockquote className="about-lead-quote">
        <span>현장과 IT가 만나는 자리에 섭니다.</span>
        <span>
          <em className="hl-field">복잡한 현장의 흐름</em>을{' '}
          <em className="hl-data">단순한 시나리오</em>로 그려냅니다.
        </span>
      </blockquote>
      <div className="about-body">
        <p>
          현장의 워크프로세스를 데이터와 구조로 재정의하고 시스템화하여,
          비즈니스 운영에 소요되는 시간과 비용을 최적화하는 일을 합니다.
          비즈니스의 정성적 맥락을 정량적 데이터 구조로 치환하고, 워크플로우의 데이터 흐름을 재설계하여
          최적의 자동화 임계치를 결정하는 것을 핵심 역량으로 봅니다.
        </p>
        <p>
          아래 4개 프로젝트는 본 채용 직무 — <strong>MetLife 코리아 · GA Sales Process Innovation Partner</strong> —
          의 세 핵심 축에 직접 연결됩니다. (1) 데이터 기반 세일즈 전략 및 혁신 과제 수립 / (2) 세일즈 프로세스 자동화 및 AI/ML 모델 구축 / (3) DT 프로젝트 매니징 및 기술 거버넌스.
          각 프로젝트마다 어느 항목과 어떻게 맞물리는지를 카드 마지막 "본 직무와의 연결고리" 섹션에 정리해 두었습니다.
        </p>
        <ul className="jd-map">
          <li><span className="jd-map-num">01</span><span className="jd-map-name">정부지원사업 자동 매칭 시스템</span><span className="jd-map-tag"><strong>고객 프로필 → 적합 상품 자동 매칭</strong>의 1:1 원형 · 보험 상품 추천 스코어링과 직접 대응</span></li>
          <li><span className="jd-map-num">02</span><span className="jd-map-name">화장품사 통합 운영 ERP</span><span className="jd-map-tag"><strong>다차원 세일즈 데이터 분석</strong> · 1인 풀스택으로 ERP 전 과정 책임 (DT 거버넌스)</span></li>
          <li><span className="jd-map-num">03</span><span className="jd-map-name">AI 면접 질문지 생성</span><span className="jd-map-tag"><strong>Gen AI · 다단계 LLM 파이프라인</strong> · "프롬프트는 코드가 아니라 데이터"로 현업이 직접 운영</span></li>
          <li><span className="jd-map-num">04</span><span className="jd-map-name">채용 서류 자동 검증 시스템</span><span className="jd-map-tag"><strong>RPA · AI Agent · OCR 우대 3종</strong>을 한 흐름에 결합 · 보험 KYC·언더라이팅 직접 이식</span></li>
        </ul>
      </div>
    </>
  );
}

function AboutBodyEn() {
  return (
    <>
      <blockquote className="about-lead-quote">
        <span>I stand where the field meets IT.</span>
        <span>
          I turn <em className="hl-field">complex field flows</em> into{' '}
          <em className="hl-data">clear scenarios</em>.
        </span>
      </blockquote>
      <div className="about-body">
        <p>
          I redefine field work processes through data and structure and systemize them,
          optimizing the time and cost required to run a business.
          My core capability is translating qualitative business context into quantitative data structures,
          redesigning the data flow of a workflow, and determining the optimal automation threshold for each step.
        </p>
        <p>
          The four projects below map directly onto the three core pillars of this role —
          <strong> MetLife Korea · GA Sales Process Innovation Partner</strong>:
          (1) data-driven sales strategy and innovation, (2) sales process automation and AI/ML model building,
          and (3) DT project management and technical governance.
          Each project's "Connection to This Role" section at the bottom of the card explains how it maps onto these pillars.
        </p>
        <ul className="jd-map">
          <li><span className="jd-map-num">01</span><span className="jd-map-name">Government Funding Auto-Matching System</span><span className="jd-map-tag"><strong>Customer profile → product auto-matching</strong> — direct 1:1 prototype of insurance product recommendation scoring</span></li>
          <li><span className="jd-map-num">02</span><span className="jd-map-name">Integrated ERP for a Cosmetics Company</span><span className="jd-map-tag"><strong>Multi-dimensional sales analytics</strong> — owned the entire ERP arc solo (DT governance)</span></li>
          <li><span className="jd-map-num">03</span><span className="jd-map-name">AI Interview Question Generator</span><span className="jd-map-tag"><strong>Gen AI · multi-stage LLM pipeline</strong> — "prompts are data, not code" so the field operates the system directly</span></li>
          <li><span className="jd-map-num">04</span><span className="jd-map-name">Automated Recruitment Document Verification</span><span className="jd-map-tag"><strong>RPA · AI Agent · OCR all three</strong> in a single flow — directly portable to insurance KYC / underwriting</span></li>
        </ul>
      </div>
    </>
  );
}

export function Main() {
  const { t, lang } = useLang();
  const { projects, lectureTimeline } = useSections();

  return (
    <main className="main">
      {/* ABOUT */}
      <section id="about" className="sec sec-about">
        <FadeIn>
          <SectionTitle id="about" kicker={t('kAbout')} title={t('sAbout')} />
          {lang === 'en' ? <AboutBodyEn /> : <AboutBodyKo />}
        </FadeIn>
      </section>

      {/* PROFILE */}
      <section id="profile" className="sec sec-profile">
        <FadeIn>
          <SectionTitle id="profile" kicker={t('kProfile')} title={t('sProfile')} />
          <div className="profile-grid">
            <div className="profile-block">
              <h3 className="profile-block-title">{t('profileEdu')}</h3>
              <ul className="profile-list profile-list-stack">
                <li>
                  <span className="profile-date">{t('profileBachelor')}</span>
                  <span className="profile-body">{t('profileSchool')}</span>
                </li>
              </ul>
            </div>
            <div className="profile-block">
              <h3 className="profile-block-title">{t('profileCareer')}</h3>
              <ul className="profile-list">
                <li>
                  <span className="profile-date">2023.03</span>
                  <span className="profile-body">{t('career2023a')}</span>
                </li>
                <li>
                  <span className="profile-date">2023.04 – 07</span>
                  <span className="profile-body">{t('career2023b')}</span>
                </li>
                <li>
                  <span className="profile-date">2024.03</span>
                  <span className="profile-body">{t('career2024')}</span>
                </li>
                <li>
                  <span className="profile-date">{`2024.09 – ${t('careerNow')}`}</span>
                  <span className="profile-body">{t('career2024c')}</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="sec sec-projects">
        <FadeIn>
          <SectionTitle id="projects" kicker={t('kProjects')} title={t('sProjects')} />
        </FadeIn>
        <div className="proj-list">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* TEACHING */}
      <section id="teaching" className="sec sec-teaching">
        <FadeIn>
          <SectionTitle id="teaching" kicker={t('kTeaching')} title={t('sTeaching')} />
          <p className="sec-desc">{t('teachingDesc')}</p>
          <ul className="teach-list">
            {lectureTimeline.map((l, i) => (
              <li key={i} className={`teach-item${l.highlight ? ' highlight' : ''}`}>
                <div className="teach-meta">
                  <span className="teach-year">{l.year}</span>
                  {l.duration && <span className="teach-dur">{l.duration}</span>}
                  <span className="teach-tag">{l.tag}</span>
                </div>
                <div className="teach-body">
                  <h3>{l.title}</h3>
                  <p>{l.target}</p>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      {/* CONTACT */}
      <section id="contact" className="sec sec-contact">
        <FadeIn>
          <SectionTitle id="contact" kicker={t('kContact')} title={t('sContact')} />
          <div className="contact-list">
            <a className="contact-row" href="mailto:alsxogml1234@gmail.com">
              <span className="c-key">{t('contactEmail')}</span>
              <span className="c-val">alsxogml1234@gmail.com</span>
            </a>
            <div className="contact-row">
              <span className="c-key">{t('contactApplyKey')}</span>
              <span className="c-val">{t('contactApplyVal')}</span>
            </div>
          </div>
          <p className="footer-note">{t('footerNote')}</p>
        </FadeIn>
      </section>
    </main>
  );
}
