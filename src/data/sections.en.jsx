// English version of sections.jsx — switched in by useSections() based on locale.

export const projects = [
  {
    id: 'p5-fund',
    index: '01',
    name: 'Government Funding Auto-Matching System',
    role: 'Solo full-stack · beta pilot (13 SMEs)',
    tagline: 'Personalized recommendations of government funding opportunities through a 3-stage matching engine and GPT verification — a direct prototype of insurance product recommendation scoring.',
    period: '2025',
    stack: ['React', 'Express 5', 'MySQL · Sequelize', 'OpenAI', 'SMS · email auto-dispatch'],

    overview: (
      <>
        SMEs and venture managers used to dig through countless government funding announcements by hand
        to find ones that fit their company. This system automates that with a 3-stage matching engine
        (hard conditions → soft scoring → keyword bonus) and a GPT second-pass verification.
        A single customer survey is enough — fitting announcements are recommended, with the recommendation
        rationale auto-generated and dispatched by email/SMS. With 13 SMEs in the beta pilot, 38 recommendation
        batches and 227 individual matches were produced from a 694-announcement DB, and email open rate hit
        31.6% (above the 20–25% industry average).
      </>
    ),

    points: [
      {
        h: 'Not simple if-else — multi-dimensional conditions structured by hierarchy, weights, and thresholds',
        p: 'The matching engine flows in 5 stages. (1) Hard conditions (region, scale, business type, 3 of them) — fail any and you’re instantly dropped. (2) Government priority announcements get preferential points and are forced in. (3) Eligibility conditions (exclusion items, etc.) hard-disqualify. (4) A 9-item, 86-point soft score. (5) Keyword bonuses (weight doubled if the customer answered "no preference"). Time corrections — deadline approaching, always-open, latest — are multiplied at the end, with a 45-point threshold for filtering. Each stage is cleanly separated for easy debugging and improvement.',
      },
      {
        h: 'One round of algorithm improvement based on operational data',
        p: 'Originally "incorporation type, business years, revenue" were hard conditions. But "general (open to all)" announcements left those fields blank and entered with a perfect score, so 70% of the score distribution piled up above 60 points and discriminative power vanished. I moved those three items to soft scoring, raised the soft maximum from 63 to 86 points by increasing the special-certification weight from 3 to 5, and adjusted the threshold from 12 to 45 points. The score distribution returned to a normalized bell curve.',
      },
      {
        h: 'Snapshot the customer’s recommendation-time conditions — reproducible and auditable post-hoc',
        p: 'At the moment a recommendation is generated, the customer’s entire condition set at that point (hard, soft, keywords) is saved as JSON alongside it. Even if the customer later changes their profile, the past recommendation can be reproduced exactly with its original basis. Each match result decomposes the 9-item scores and correction multipliers, so "why did this recommendation get this score" can be explained at row level.',
      },
    ],

    journey: {
      label: 'Project Journey',
      stages: [
        {
          tag: 'Why I Built It',
          body: 'SME and venture managers were spending hours every time digging through government funding announcements to find ones that fit their company. From the consultant side, junior staff couldn’t produce veteran-level recommendations, leaving a wide gap. The thesis: if the system absorbs matching and rationale generation, consultants can focus on essential work — pre-consultation, business-plan consulting, post-recommendation support.',
        },
        {
          tag: 'Initial Build',
          body: 'I started with hard-condition (region, scale, business type) filters and the announcement DB. The early version evolved with simple if-else matching and basic scoring, plus the basic flow for email auto-dispatch and open tracking.',
        },
        {
          tag: 'Problems Found → Solutions',
          body: (
            <>
              <p>Operating the early version surfaced the following problems, which I worked through by category in the next iteration.</p>
              <ul className="prob-cats">
                <li>
                  <span className="cat-name">A. Score-distribution skew destroyed discriminative power</span>
                  <p className="cat-prob">"General (open to all)" announcements passed with a perfect score by leaving the hard conditions blank, so ~70% of the score distribution piled up above 60 points. Recommendations lost discriminative power, and consultants had to manually re-screen them.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Moved "incorporation type, business years, revenue" from hard conditions to soft scoring; raised the soft maximum from 63 to 86 points and the pass threshold from 12 to 45 points. The distribution returned to a bell curve and discrimination was restored.</p>
                </li>
                <li>
                  <span className="cat-name">B. Risk of AI verification cost explosion</span>
                  <p className="cat-prob">If the structure that called GPT per match scaled with customer count, operational cost would grow faster than recommendation value.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Narrowed GPT-4o-mini verification to only the top 10 hard-condition passers and added a cache table keyed on (customer, announcement) so identical combinations are served by DB lookup. Additional cost effectively converges to zero.</p>
                </li>
                <li>
                  <span className="cat-name">C. No post-hoc reproduction or audit</span>
                  <p className="cat-prob">If a customer revised their profile and someone later looked back at past recommendations, there was no way to reproduce what conditions produced them. Insufficient as evidence for algorithm improvement and as evidence for external-audit response.</p>
                  <p className="cat-sol"><strong>Solution</strong> · At recommendation time, the entire customer condition set is saved alongside as JSON, and each match result preserves the 9-item scores and correction multipliers decomposed. "Why is this recommendation at this score" can be explained at row level any time.</p>
                </li>
              </ul>
            </>
          ),
        },
        {
          tag: 'Current State',
          body: 'Beta pilot: 13 SMEs · 694 announcements · 38 recommendation batches · 227 individual matches. Email open rate 31.6% (above the 20–25% industry average).',
        },
        {
          tag: "What's Next",
          body: 'Once enough recommendation → application → acceptance data accumulates, I want to move the heuristic weights to an ML model that learns them automatically. Connecting SMS auto-dispatch to chatbot consulting, and a learning loop that feeds consultants’ post-hoc feedback back into the matching algorithm, are also on the next-step list.',
        },
        {
          tag: 'Guiding Principle',
          body: 'I prioritized data design that makes recommendation results post-hoc reproducible and explainable. "Why did this announcement get this score" needs to be explainable at row level for operational data to drive algorithm improvement.',
        },
      ],
    },

    growth: {
      label: 'What I Gained',
      points: [
        'The biggest gain. Working with external data like "government funding announcements" — where format and fields don’t fall 100% into structured form — taught me the approach of incrementally categorizing through operational data instead of forcing rigid structuring. I crawled 1,000+ announcements, built categories and enums based on that data, and designed the operational flow where new values land in "pending" first and only get promoted to formal enum after admin review and "accept." A learned approach to automating external data while keeping the system open rather than closed when formats keep changing.',
        'Rule-engine design thinking that structures multi-dimensional conditions through hierarchy, weights, and thresholds — not simple if-else',
        'The experience of doing one round of algorithm improvement based on operational data — judging from real data which item to move where when score distribution skews to one side',
        'A data-design pattern that snapshots recommendation-time conditions for post-hoc reproduction — a way of thinking that keeps model-decision accountability clear under regulation and audit',
      ],
    },

    photoGalleries: [
      {
        id: 'data-overview',
        title: 'Announcement Data & Operations at a Glance',
        summary: 'External data (government funding announcements) where format doesn’t fall into 100% structured form is auto-collected and auto-categorized, with operational status and data details visible on a single screen.',
        cover: '/images/one-two-fund/대시보드.png',
        items: [
          { tag: 'Operations dashboard', caption: 'Cumulative crawled announcement count, matching progress, email-dispatch and open funnel — combined into one screen. The entry view designed so operators can immediately grasp this cycle’s matching flow and anomaly signals upon entering the system.', src: '/images/one-two-fund/대시보드.png' },
          { tag: 'Announcement auto-crawling', caption: 'The work of operators searching and organizing government funding announcements by hand was replaced with auto-crawling. External data without consistent format/fields was incrementally categorized through operational data — 1,000+ cumulative announcements were classified and stored.', src: '/images/one-two-fund/공고 자동 크롤링 모습.png' },
          { tag: 'Announcement detail — Tier 1–3 classification', caption: 'Collected announcements are classified into Tier 1–3 by recommendation priority and managed on one screen. Operators can directly inspect the foundation data the matching algorithm uses, review classification quality, and correct it.', src: '/images/one-two-fund/공고 상세테이블1_티어1부터3까지나눈모습.png' },
          { tag: 'Announcement detail — LLM metadata', caption: 'Metadata extracted by LLM (summary, keywords, etc.) and the model used to produce it are kept on the same row. "What model produced what data and how" is traceable post-hoc, so the impact range during algorithm improvement or model swap is immediately visible.', src: '/images/one-two-fund/공고 상세테이블2_메타데이터와 사용 모델 등 llm으로 가져온 데이터들.png' },
        ],
      },
      {
        id: 'master',
        title: 'Master-Data Operation — New Categories Get Held First',
        summary: 'Instead of forcing automatic processing of inconsistent-format external data, newly discovered categories land in "pending" first, then operators review them directly and promote them to formal enum status. The pattern of operating with the system open rather than closed is encoded directly into the screen.',
        cover: '/images/one-two-fund/마스터관리_enum관리1_공고크롤링시 기존 테이블에 없던 카테고리 후보군들을 pending상태로 두고 추후 사용자가 병합하거나 새로운 enum으로 추가할수 있도록함.png',
        items: [
          { tag: 'Enum management — pending candidate list', caption: 'When new category values not in the master table are discovered during crawling, the system doesn’t process them arbitrarily — they land in "pending" state. Operators can review accumulated candidates in batch on one screen.', src: '/images/one-two-fund/마스터관리_enum관리1_공고크롤링시 기존 테이블에 없던 카테고리 후보군들을 pending상태로 두고 추후 사용자가 병합하거나 새로운 enum으로 추가할수 있도록함.png' },
          { tag: 'Enum management — merge / promotion handling', caption: 'Reviewed candidates are merged into existing categories or promoted to a new formal enum, decided directly by the operator. An operational pattern that explicitly preserves a human judgment step instead of forced auto-processing — the core flow that absorbs external-data format variation while maintaining operational quality.', src: '/images/one-two-fund/마스터관리_enum관리2_공고크롤링시 기존 테이블에 없던 카테고리 후보군들을 pending상태로 두고 추후 사용자가 병합하거나 새로운 enum으로 추가할수 있도록함.png' },
        ],
      },
      {
        id: 'matching',
        title: '3-Stage AI Matching & Recommendation Results',
        summary: 'How the 3-stage rule engine (hard conditions → soft scoring → keyword bonus) followed by GPT verification of the top candidates flows through one matching cycle.',
        cover: '/images/one-two-fund/AI매칭돌려서 추천 목록.png',
        items: [
          { tag: 'AI matching flow', caption: 'A view of how a single matching cycle operates. Hard-condition pass, soft-score calculation, keyword bonus application, and GPT verification of the top candidates run in sequence inside the system.', src: '/images/one-two-fund/한 번 AI매칭돌릴떄 모습 예시.png' },
          { tag: 'Recommendation result list', caption: 'After matching, the final recommended announcement list is sorted by score and fit. The work of consultants manually digging through announcements is handled by the system, freeing them to focus only on final review and pre-consultation.', src: '/images/one-two-fund/AI매칭돌려서 추천 목록.png' },
        ],
      },
      {
        id: 'delivery',
        title: 'Customer Delivery — Auto Email and Receiving Screen',
        summary: 'Matching results are delivered to customers automatically by the system rather than by consultant manual dispatch, with post-dispatch open and response also tracked as data.',
        cover: '/images/one-two-fund/추천이메일예시_실제로 추천 정부지원사업을 등록된 이메일로 자동으로 보내줌.png',
        items: [
          { tag: 'Recommendation email auto-dispatch', caption: 'Matching results are auto-dispatched to the customer’s registered email. The step where consultants prepared and sent emails one by one is now handled by the system, and post-dispatch open and response data validate matching effectiveness.', src: '/images/one-two-fund/추천이메일예시_실제로 추천 정부지원사업을 등록된 이메일로 자동으로 보내줌.png' },
          { tag: 'Customer receiving screen', caption: 'What an actual customer receives — not a plain list of announcements, but accompanied by the GPT-generated rationale "why this announcement is recommended for you" embedded in the body.', src: '/images/one-two-fund/한 명한테 어떤 식으로 정부지원사업공고가오는지 예시.png' },
        ],
      },
    ],

    scoreDist: [
      { range: '≥ 200 (priority)', count: '66', barW: 88, desc: 'Hard conditions passed + priority points applied' },
      { range: '100 – 199', count: '2', barW: 3, desc: 'High score' },
      { range: '70 – 99', count: '45', barW: 60, desc: 'Mid' },
      { range: '45 – 69 (pass line)', count: '64', barW: 85, desc: 'Soft-score threshold passed' },
      { range: '< 45 (filtered)', count: '50', barW: 67, desc: 'Discriminative power' },
    ],

    relevance: {
      label: 'Connection to This Role',
      lines: [
        { tag: 'AI/ML-based sales support', body: (<><strong>Exact prototype of "customer profile → auto-match to product + auto-generated rationale"</strong> — <strong>1:1 mapping to insurance product recommendation scoring</strong>.</>) },
        { tag: 'Sales funnel · bottleneck analysis', body: (<>4-stage funnel — dispatch → open → response → feedback — built in, making <strong>matching → enrollment conversion and bottlenecks visible</strong>.</>) },
        { tag: 'Technical governance', body: (<><strong>Recommendation-time condition snapshotting</strong> + GPT cost cache + algorithm-change history — regulation/audit governance bundled in one system.</>) },
      ],
    },
  },

  {
    id: 'p1-ibco',
    index: '02',
    name: 'Integrated ERP for a Cosmetics Company',
    role: 'Solo full-stack · in production',
    tagline: 'An integrated ERP built to dismantle operational inefficiencies at a cosmetics company — 17 field-level problems sorted into automated, semi-automated, and human-judgment layers.',
    period: '2025.10 — Present',
    stack: ['React 19', 'Express 5', 'MySQL (dual RDS)', 'Sequelize', 'OpenAI', 'AWS EC2 · PM2', 'GitHub Actions'],

    overview: (
      <>
        An integrated ERP built to resolve the daily operational inefficiencies that the cosmetics company's MD,
        sales planning, inventory, and marketing teams were running into. I interviewed the field and distilled
        17 concrete operational problems, then drew explicit lines between what the system would handle and where
        the domain expert's judgment would remain. In production since October 2025, with cumulative orders of
        15,680 (KRW 409.16M) across 87 SKUs flowing through the system. I designed, deployed, and operated all of
        it solo — including 4 channel parsers (Cafe24, Coupang, Naver, Rocket Growth), GPT-driven insight
        generation, and a GitHub Actions → AWS EC2 PM2 CI/CD pipeline.
      </>
    ),

    points: [
      {
        h: '17 field-interviewed problems became the system design starting point',
        p: 'Inventory was tracked in Excel by hand, so a full count took a week — and inflows/outflows kept happening during it, making proper reorder timing impossible. Pulling a single product’s sales trend required manually merging 50+ channel spreadsheets, and Excel overwrites silently erased revision history. Revenue was rising while channel-specific commissions were missing from the ledger, so margin-negative promotions ran unchecked. I documented these problems directly with the field and translated them into BOM-based inventory hierarchies, three-level traceability (slip / movement / LOT), 90-day moving-average reorder forecasting, multi-dimensional price decomposition, and automatic tagging of weather, events, and keywords.',
      },
      {
        h: 'Drew the line — by domain — between what to automate and what to leave to people',
        p: 'Channel order ingestion, automatic inventory deduction, and reorder-risk scoring are handled by the system. Strategic decisions like new-product positioning, buyer negotiation, and promotion approval are kept as human work. Between the two, I deliberately built a semi-automated layer: an Excel upload only enters DRAFT state, and inventory is deducted only after the user reviews and clicks CONFIRM. A reverse-slip correction flow that fixes mistakes without deleting the original is also a default — so domain judgment has explicit room to act inside the system.',
      },
      {
        h: 'Two days of meeting prep disappeared, replaced by domain judgment',
        p: 'The MD and sales planning teams used to spend roughly 2 days preparing each weekly/monthly strategy meeting (downloading per-channel Excels, manually consolidating, hand-drafting per-product graphs). After deployment, a single dashboard entry combines multi-dimensional analysis by channel/period/SKU, three-year YoY comparisons, and a GPT weekly report instantly. The prep time vanished, and MD/marketing domain judgment — long buried under busy work — became the actual agenda of meetings.',
      },
      {
        h: 'A system that the domain expert can run directly — policy changes apply instantly without code deploys',
        p: 'Inventory risk thresholds, per-channel commission rates, event rules, keyword categories — none of these business rules are hard-coded. They’re exposed in 8 admin pages, and operators can change policies on the spot. GPT also never produces numbers directly: SQL computes the authoritative figures and provides cited sources, while GPT only handles interpretation. This keeps every auto-generated insight tied to real data.',
      },
    ],

    feedback: {
      label: 'Stakeholder Feedback',
      text: 'The time we used to spend preparing for meetings is gone, and the MD/marketing domain judgment that was buried under busy work is now actually being used in meetings.',
      cite: 'MD & sales planning team currently using the system',
    },

    journey: {
      label: 'Project Journey',
      stages: [
        {
          tag: 'Why I Built It',
          body: 'I watched the MD, sales planning, inventory, and marketing teams burn their days on channel-Excel consolidation, full inventory counts, and meeting prep. Their actual domain expertise — MD intuition, buyer negotiation, promotion judgment — was buried under busy work and barely surfaced in meetings. The thesis was simple: if the system absorbs the busy work, domain judgment can return to being the actual agenda of meetings.',
        },
        {
          tag: 'Initial Build',
          body: 'I started with the most urgent piece — channel order consolidation and automatic inventory deduction. I built a parser that normalizes Cafe24, Coupang, Naver, and Rocket Growth Excel exports into a single schema; a two-stage upload flow (DRAFT then CONFIRM) to prevent mistakes; and a base inventory deduction logic that connects raw materials, semi-finished, and finished products.',
        },
        {
          tag: 'Problems Found → Solutions',
          body: (
            <>
              <p>Once it was running, the following problems surfaced. I sorted them into four categories and worked through each.</p>
              <ul className="prob-cats">
                <li>
                  <span className="cat-name">A. Inventory & material tracking</span>
                  <p className="cat-prob">The chain from raw material → semi-finished → finished product lived only in someone’s head, so inventory mismatches were frequent and a full week-long stocktake was required just to time a reorder. Excel overwrites erased revision history, making post-hoc retracing or audit impossible.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Linked raw → semi-finished → finished via foreign keys for true BOM hierarchies. Every inventory change is tracked at three levels (slip / movement / LOT), and erroneous slips are corrected by adding reverse slips rather than deletion — securing accounting-grade traceability. Reorder risk is automatically scored by 90-day moving average.</p>
                </li>
                <li>
                  <span className="cat-name">B. Multi-channel data integration</span>
                  <p className="cat-prob">Each of 10+ channels had its own option IDs, product names, and formats, so seeing a single product’s sales trend required manually combining 50+ Excel files. Every new channel meant rebuilding the management format from scratch.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Built parsers for 4 channels (Cafe24, Coupang, Naver, Rocket Growth) that normalize unstructured Excel into a single schema. Channel-specific option IDs are absorbed via an automatic mapping table, so historic data stays linked even when new options arrive.</p>
                </li>
                <li>
                  <span className="cat-name">C. Profitability × external variables</span>
                  <p className="cat-prob">Revenue was tallied without channel commissions and shipping fees, so margin-negative promotions kept running unchecked. External factors like weather were never joined to the data, making post-hoc analysis impossible.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Decomposed price into cost / list / actual sale, and added per-channel commission and shipping masters so row-level profitability is computed instantly. Tagged 3,285 days of daily weather data, plus events and keywords, onto each order line — making external-variable correlations statistically observable.</p>
                </li>
                <li>
                  <span className="cat-name">D. Operator autonomy</span>
                  <p className="cat-prob">Domain rules (inventory risk thresholds, channel commission rates, event rules, keyword categories) were hard-coded, so even a single-line policy change required developer scheduling.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Exposed business rules across 8 admin pages, so operators can adjust policy directly without a code deploy and the system reflects it instantly.</p>
                </li>
              </ul>
            </>
          ),
        },
        {
          tag: 'Current State',
          body: (
            <>
              <p>It has settled in as the integrated operating system that handles 15,680 cumulative orders, KRW 409.16M in revenue, and 87 SKUs. Roughly 2 days of meeting prep disappeared and was replaced by domain judgment, while operators now adjust policies themselves without code deploys. The MD and sales planning teams keep coming back with the same feedback: "the expertise that was buried under busy work is finally usable in meetings."</p>
              <p>Because core metrics are always visible on the dashboard, when a number moves the team can adjust strategy on the spot. A promotion margin simulator (modeling expected margin before applying a 10% price cut) and a flow for pre-validating channel × product × period scenarios have also taken root inside the system, shortening the decision cycle from "per meeting" to "per moment."</p>
            </>
          ),
        },
        {
          tag: "What's Next",
          body: (
            <>
              <p>The current focus is finding more variables that actually drive sales. Beyond price, events, weather, and keywords, I’m using accumulated data to verify which other external variables show statistically significant correlation with revenue at the channel/SKU level.</p>
              <p>Longer term, I plan to build an <strong>All-in-One integrated strategy agent</strong> that goes beyond first-party analysis to automatically collect competitor pricing, keywords, reviews, and ad activity into one screen. The MD and sales planning teams should see their own flows alongside the competitive landscape on a single screen, and decide pricing, promotions, and new-product strategy from there.</p>
            </>
          ),
        },
        {
          tag: 'Guiding Principle',
          body: 'The principle was to draw a clear line between what gets automated and what stays a human decision. The system never returns "the answer" — it organizes data, options, and simulations and lays them out, while the final call belongs to the domain expert.',
        },
      ],
    },

    growth: {
      label: 'What I Gained',
      points: [
        'A concrete eye for drawing the line — directly interviewing operators about the problems they hit every day, then deciding "this should belong to the system / this should belong to the human"',
        'A design pattern that pulls business rules out of code into data, so operators can change policy directly without a deploy — making the system feel alive in the field',
        'A design discipline that doesn’t blindly trust automated output: keeping inspection steps and correction flows (DRAFT, CONFIRM, reverse slips) as deliberate parts of the system, securing both operational safety and room for domain judgment',
        'The full arc of owning an enterprise system end-to-end as one person — domain interviews → data model → automation thresholds → operational stabilization — and the perspective that comes from carrying it through',
      ],
    },

    photoGalleries: [
      {
        id: 'flow',
        title: 'Operations at a Glance',
        summary: 'Channel-scattered data and meeting-prep work were redesigned into a single dashboard and unified time series, shortening the decision moment.',
        cover: '/images/ibco-erp/dashboard1.png',
        items: [
          { tag: 'Dashboard', caption: 'Previously, sales/orders/SKU status only became visible after manually consolidating channel-specific Excels. The unified dashboard means every meeting attendee starts from the same numbers at the same moment.', src: '/images/ibco-erp/dashboard1.png' },
          { tag: 'Per-product sales trend comparison', caption: 'Pulling a single product’s sales flow used to require manually merging 50+ channel Excels. It’s now a single channel/period toggle — a dramatic prep-time reduction (~8 hours → ~1 second).', src: '/images/ibco-erp/판매추이1.png' },
          { tag: 'Period sales trend comparison 1', caption: 'Price changes and event metadata are joined onto the sales time series, so hypotheses about "why did revenue move at this point" can be tested directly on the data.', src: '/images/ibco-erp/판매추이2.png' },
          { tag: 'Period sales trend comparison 2', caption: 'A comparison view that automatically overlays the same period in the prior 2 years, making seasonality visible without separate analysis work.', src: '/images/ibco-erp/판매추이3.png' },
        ],
      },
      {
        id: 'analytics',
        title: 'Analysis Tools',
        summary: 'The system never returns "the answer" — it organizes the raw data, so the MD and sales planning teams’ domain judgment becomes the substance of the analysis.',
        cover: '/images/ibco-erp/factpack1.png',
        items: [
          { tag: 'Per-product comprehensive analysis', caption: 'For a chosen product: total revenue, units sold, average price, average discount; revenue time series; channel mix (Naver/Coupang/Rocket Growth, etc.); day-of-week patterns; YoY seasonality — all on one screen. Scattered analyses are unified into a single page so the domain expert can validate hypotheses without page-hopping.', src: '/images/ibco-erp/factpack1.png' },
          { tag: 'Price elasticity · event uplift · margin deep-dive', caption: 'Daily-average sales response to discount changes (price elasticity); promotion-period revenue vs. immediately preceding period (event uplift); top-10 frequently co-purchased products; per-channel real-margin matrix — combined on one screen. All authoritative numbers are computed in SQL; GPT only interprets the underlying data, structurally blocking hallucination risk.', src: '/images/ibco-erp/factpack2.png' },
          { tag: 'Product positioning', caption: 'Multi-dimensional product metrics visualized on a 2D positioning map, supporting decisions like new-product strategy and lineup adjustment on data rather than gut feel.', src: '/images/ibco-erp/제품지능형분석_포지션맵.png' },
          { tag: 'Inventory intelligence', caption: 'The week-long full-count process used to time reorders is replaced with a 90-day moving-average risk-scoring engine. Reorder candidates are auto-sorted by risk and returned in a single query.', src: '/images/ibco-erp/재고소진1.png' },
          { tag: 'Inventory intelligence', caption: 'Beyond simple risk, this view layers seasonal patterns on top — so the system pre-flags "items that have been chronically short during this period." Pre-emptive ordering instead of reactive firefighting.', src: '/images/ibco-erp/재고소진_계절패턴.png' },
        ],
      },
      {
        id: 'signals',
        title: 'Validation Tools',
        summary: 'Pre-execution simulation and post-hoc correlation analysis are bundled inside the system, shifting decisions that used to depend on intuition onto quantitative data.',
        cover: '/images/ibco-erp/이벤트마진시뮬레이터.png',
        items: [
          { tag: 'Pre-execution promotion margin simulator', caption: 'Before actually applying price/discount changes, this tool simulates expected margin with channel commissions included. Multiple scenarios can be held in an "experiment" state and compared, then promoted to "confirmed" — preempting the kind of margin-negative promotions that used to slip through unchecked.', src: '/images/ibco-erp/이벤트마진시뮬레이터.png' },
          { tag: 'Weather × category sales correlation', caption: 'Daily temperature data from the meteorological API is joined onto category-level sales time series, letting the team quantitatively validate field intuitions like "haircare sells more as it gets colder" — bars (temperature) and a line (sales) on a single chart.', src: '/images/ibco-erp/상관관계분석_날씨.png' },
          { tag: 'Per-event revenue contribution', caption: 'Every promotion and event’s revenue contribution is comparable on one chart. Which promotions actually drove revenue, and which had marginal impact, can now be quantitatively reviewed and used as evidence for the next promotion design.', src: '/images/ibco-erp/상관관계분석_이벤트.png' },
          { tag: 'Per-keyword revenue contribution', caption: 'Core keywords that consumers actually responded to are sorted by revenue contribution. The numbers make it explicit which words drive sales, providing a quantitative basis for product-name optimization and ad-keyword budget allocation.', src: '/images/ibco-erp/상관관계분석_키워드.png' },
        ],
      },
    ],

    relevance: {
      label: 'Connection to This Role',
      lines: [
        { tag: 'Sales data analysis & strategy', body: (<><strong>Multi-dimensional variable join</strong> — channel · period · product · event · weather — operating today for sales-performance measurement and bottleneck analysis.</>) },
        { tag: 'DT project leadership & governance', body: (<><strong>Field interview → data model → CI/CD shipping → live policy changes</strong> — owned the entire ERP arc end-to-end as one person.</>) },
        { tag: 'Structured / unstructured normalization', body: (<>Unstructured Excel from 4 channels → <strong>single-schema normalization</strong> + external variables (weather, events, keywords) joined in.</>) },
      ],
    },
  },

  {
    id: 'p2-jasoseo',
    index: '03',
    name: 'AI Interview Question Generator',
    role: 'Solo full-stack · v1 used by 10+ public-sector recruitments / v2 currently in production at 2 institutions · used in company sales pitches',
    tagline: 'One of the in-house AI tools I proposed and built to align our core business (public-sector recruitment outsourcing) with the AI paradigm — 4+ of these tools are now used as differentiators in our actual sales presentations.',
    period: '2025 — 2026.03',
    stack: ['React 19', 'Express', 'Sequelize · MySQL', 'GPT-4.1 / 4o-mini', 'pdf-parse', 'Docker'],

    overview: (
      <>
        Recruiters’ domain know-how about "writing interview questions" — STAR, drill-down, dilemma framing,
        failure exploration, multi-question cross-analysis, sensitive-information blocking — was decomposed into
        40 prompt blocks stored in the database. When a recruiter visually composes blocks by category,
        interview questions are generated automatically.
        The hard-coded v1 was used in 10+ public-sector recruitments — including the Korea Racing Authority,
        the Construction Workers Mutual Aid Association, and the National Health Insurance Service — and validated
        in real use. The current v2 (block-based system) is in production at the Korea Childcare Promotion
        Institute and aT (Korea Agro-Fisheries & Food Trade Corporation), and as of March 2026 has auto-generated
        815 interview question sets for 178 candidates — earning direct praise from interviewers and an internal director.
      </>
    ),

    points: [
      {
        h: 'Manage prompts as data, not code',
        p: '40 prompt blocks (29 instruction blocks + 11 prohibition blocks) are managed as DB records. Recruiters visually compose category-organized blocks. Block order is prompt order, and meta-attributes like "default-applied / template-compatible" let each project manage its own combinations independently. Compliance and legal staff can run the prompts directly without a code deploy.',
      },
      {
        h: '4-axis verification stabilizes output',
        p: 'Every question generated by GPT-4.1 is re-verified by GPT-4o-mini along 4 axes — (1) blocks fact-checking questions whose answers already exist in the cover letter, (2) blocks topics unrelated to the cover letter, (3) blocks Yes/No questions and generic ones lacking cover-letter-specific keywords, (4) blocks anything violating user-defined prohibition rules. The system prompt explicitly opens with: "any question that someone who hasn’t read the cover letter could ask is a fail."',
      },
      {
        h: 'Stable vs. experimental — verified by operational data: 815 stable / 0 experimental',
        p: 'I designed both stable and experimental templates, but operational feedback shows only the stable variant is actually used. Candidate-fit assessment also accumulated 49 entries from a single mid-career recruitment and 0 from public-sector new-hire and executive interviews — the operational data itself records the judgment of "where automation is meaningful and where it overreaches."',
      },
      {
        h: 'Job-posting PDF → automatic evaluation-criteria extraction + per-job context distribution',
        p: 'Job-posting PDFs are extracted to text; GPT-4.1 then distributes each section by job position. In one mid-career recruitment at a public institution, six positions (accounting, infosec, statistics, fruit/livestock/seafood wholesale) each received roughly 4,000–4,700 characters of automatically distributed posting text, which then translated into 70 evaluation items.',
      },
    ],

    feedback: {
      label: 'Stakeholder Feedback',
      text: 'The job-tailoring and the fit with each recruitment type (mid-career, new-hire) is very strong. Looking at any single candidate, the questions are diverse enough.',
      cite: 'Interviewer · internal director',
    },

    journey: {
      label: 'Project Journey',
      stages: [
        {
          tag: 'Why I Built It',
          body: 'The core business of the company I work for is public-sector recruitment outsourcing. The national mood around requiring AI-adoption case studies in public-sector hiring has been intensifying, and I judged that we needed to bring that wave inside the company first — so I proposed and built it directly. The AI tools I built are now used as actual weapons when the company goes to pitch public institutions, and this project is one of them. Plain GPT calls only produced "questions that read like the cover letter wasn’t even read," so I oriented the design toward embedding recruitment domain know-how — STAR, drill-down, multi-question cross-analysis, sensitive-info blocking — into the system itself.',
        },
        {
          tag: 'Initial Build',
          body: 'I started with v1, where the GPT prompts were embedded directly in server code. The basic flow — input a cover letter, GPT generates interview questions — was working, and v1 alone went into 10+ real public-sector recruitments (Korea Racing Authority, Construction Workers Mutual Aid Association, NHIS, etc.), giving an early validation of market fit.',
        },
        {
          tag: 'Problems Found → Solutions',
          body: (
            <>
              <p>Operating v1 surfaced the following limits, which I worked through in v2 by category.</p>
              <ul className="prob-cats">
                <li>
                  <span className="cat-name">A. Domain context was missing</span>
                  <p className="cat-prob">Because the same prompt went into every recruitment, institution-specific characteristics (public-sector HR rules, private-sector job orientation, executive interviews, etc.) and per-position job descriptions weren’t reflected at all. Interviewers had weak grounds for "why this question to this candidate."</p>
                  <p className="cat-sol"><strong>Solution</strong> · GPT now automatically extracts evaluation items, required competencies, and ideal-candidate profiles per job from the posting PDF, and injects them as context into the prompt. The same system now produces different results for each recruitment and institution.</p>
                </li>
                <li>
                  <span className="cat-name">B. Operating authority sat with IT only</span>
                  <p className="cat-prob">Prompts lived in server code, so recruitment specialists with the actual domain know-how couldn’t touch them directly — every change depended on developer scheduling.</p>
                  <p className="cat-sol"><strong>Solution</strong> · I decomposed recruitment domain know-how into 40 prompt blocks (29 instructions + 11 prohibitions) and moved them into the DB, letting recruiters visually compose category-organized blocks. Operating authority was handed to the domain experts.</p>
                </li>
                <li>
                  <span className="cat-name">C. Output quality consistency</span>
                  <p className="cat-prob">Generic questions that read like the cover letter wasn’t opened, fact-checks whose answers were already in the cover letter, Yes/No closed-ended questions, sensitive-info questions — low-quality output risked being delivered to interviewers as-is.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Every generated question is re-verified by GPT-4o-mini along 4 axes (already-answered / context / quality / prohibition). Only questions that pass appear on screen; failures stay in operational data for post-hoc analysis.</p>
                </li>
              </ul>
            </>
          ),
        },
        {
          tag: 'Current State',
          body: 'The current v2 system is in production at the Korea Childcare Promotion Institute and aT (Korea Agro-Fisheries & Food Trade Corporation). As of March 2026 it has auto-generated 815 interview question sets for 178 candidates, earning direct praise from interviewers and an internal director: "the job-tailoring and fit with the recruitment type is very strong."',
        },
        {
          tag: "What's Next",
          body: 'I want to use the accumulating snapshots — "which block combination produced what result for which recruitment" — to add a meta-layer that recommends optimal block combinations based on recruitment type and institution profile. Multi-language support, integration with external recruitment SaaS, and a learning loop that converts interviewer feedback into block weights are also on the next-step shortlist.',
        },
        {
          tag: 'Guiding Principle',
          body: 'The principle was to move veteran recruiters’ know-how into the system as an asset. Prompts are managed as data, not code, so the AI system’s operating authority belongs to the domain expert directly.',
        },
      ],
    },

    growth: {
      label: 'What I Gained',
      points: [
        'The view that "prompts are data, not code" — a system-design mindset for handing LLM operating authority to the domain expert',
        'Designing multi-stage LLM pipelines instead of single calls — separating generation from verification, and keeping verification results as operational data',
        'Operational know-how for stabilizing LLM output — combining strict output formats, explicit prohibition rules, and execution-time snapshot preservation so auto-generated results stay traceable and reproducible after the fact',
        'The ability to decompose tacit recruitment-domain knowledge into block-level data models — a method that transfers cleanly to other domains like insurance or legal',
      ],
    },

    photoGalleries: [
      {
        id: 'project-setup',
        title: 'Per-Recruitment Domain Setup',
        summary: 'So the same system can be operated across diverse public-sector recruitments, the steps where the recruiter inputs domain info, evaluation focus, and block composition are split into their own screens.',
        cover: '/images/ai-interview/프로젝트 별로 블록 설정하는 곳_평가방법_해선느 안 되는 판단 등.png',
        items: [
          { tag: 'Job-description OCR input', caption: 'At the start of a recruitment, the posting PDF and job descriptions are uploaded; GPT OCRs the text and automatically identifies the evaluation items, required competencies, and ideal candidate profile per job, then stores them in the system. Eliminates the manual domain-info entry that used to happen every recruitment.', src: '/images/ai-interview/프로젝트별 맞춤 정보_직무기술서 OCR하여 넣는 장면.png' },
          { tag: 'Evaluation-focus customization', caption: 'Evaluation focus differs by recruitment and institution, and the recruiter sets it directly. The system was designed from the start to assume multi-recruitment operation across diverse public-sector clients.', src: '/images/ai-interview/프로젝트별 평가주안점 개별설정 커스텀자염ㄴ.png' },
          { tag: 'Block composition — evaluation method / prohibitions', caption: 'A screen where recruiters visually compose category-organized prompt blocks. Instruction blocks ("how to evaluate") and prohibition blocks ("what not to ask") are run separately, so recruitment domain know-how can be operated by the field directly without code deploys.', src: '/images/ai-interview/프로젝트 별로 블록 설정하는 곳_평가방법_해선느 안 되는 판단 등.png' },
          { tag: 'Block configuration detail', caption: 'A detailed example of how individual blocks turn domain know-how into data. The core screen of the structure that delegates the AI system’s operating authority to the recruiter.', src: '/images/ai-interview/블록설정 예시.png' },
        ],
      },
      {
        id: 'applicant-fit',
        title: 'Candidate-Fit Analysis',
        summary: 'Before the interviewer sees a candidate one-on-one, the system pre-organizes job fit, career, certifications, and document consistency — so the interviewer can focus on verification and judgment.',
        cover: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면1_종합요약.png',
        items: [
          { tag: 'Candidate data dashboard', caption: 'Aggregated candidate data — counts, status, evaluation progress — on one screen, designed so recruiters can grasp the overall picture at once.', src: '/images/ai-interview/지원자데이터 대시보드 예시.png' },
          { tag: 'Fit assessment — overall summary', caption: 'AI’s comprehensive job-fit summary per candidate, designed so interviewers can register key strengths and weaknesses before meeting the candidate.', src: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면1_종합요약.png' },
          { tag: 'Fit assessment — career analysis', caption: 'Candidate career data matched against required competencies. The system pre-organizes "how this experience connects to this job" before handing it to the interviewer.', src: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면2_경력사항분석.png' },
          { tag: 'Fit assessment — certification analysis', caption: 'The candidate’s certifications are automatically compared against job requirements. Whether the required and preferred credentials are met — work that used to be cross-checked by hand — is now handled by the system.', src: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면3_자격증분석.png' },
          { tag: 'Fit assessment — cover letter ↔ documents cross-check', caption: 'Claims in the cover letter are automatically cross-referenced against actual submitted documents (certifications, employment proofs, etc.). Cases where "the cover letter says it but the documents don’t back it up" are surfaced first by the system, narrowing the interviewer’s verification scope ahead of time.', src: '/images/ai-interview/지원자가 얼마나 해당 직무에 적합한지 보여주는 적합성검사 화면4_교차검증_자소서와 실제 입사지원서에 등록한 각종 서류들 내용 일치하는지 파악.png' },
        ],
      },
      {
        id: 'output',
        title: 'AI Question Generation & Output',
        summary: 'The final stage where domain setup combined with candidate data is delivered to the interviewer — output options, generation results, and report packaging are tied into a single flow.',
        cover: '/images/ai-interview/ai면접질문지생성된화면.png',
        items: [
          { tag: 'Question-set output configuration', caption: 'Where the recruiter chooses question count, difficulty, template type, and output options. The same system is designed to produce different deliverables per recruitment type and interview stage.', src: '/images/ai-interview/ai면접질문지 출력 시 설정 넣는 곳.png' },
          { tag: 'Generated AI question set', caption: 'The auto-generated interview question set. Only questions that include cover-letter-specific keywords and pass 4-axis verification (already-answered · context · quality · prohibition) are shown.', src: '/images/ai-interview/ai면접질문지생성된화면.png' },
          { tag: 'Interviewer report output', caption: 'The generated questions are packaged as a report the interviewer can take into the actual interview — evaluation criteria, questions, and assessment items consolidated into a single document ready for use on-site.', src: '/images/ai-interview/ai면접질문지_보고서화.png' },
        ],
      },
    ],

    blockSamples: [
      { id: 17, cat: 'Role assignment', title: 'Public-sector HR committee member', body: 'Persona: 15+ years on HR committees — instinctively senses exaggeration and lack of specificity' },
      { id: 19, cat: 'Reasoning process', title: 'Multi-question cross-analysis', body: 'Verifies framing differences and timeline contradictions across the same experience told in multiple questions' },
      { id: 20, cat: 'Reasoning process', title: 'STAR-method verification', body: 'Prioritizes questions that surface missing pieces of Situation · Task · Action · Result' },
      { id: 37, cat: 'Personal data', title: 'Sensitive-info questions blocked', body: 'Age · family · origin · marital status · religion · health · politics — legally blocked' },
    ],

    relevance: {
      label: 'Connection to This Role',
      lines: [
        { tag: 'Gen AI · LLM in business', body: (<><strong>Multi-stage LLM pipeline</strong> (generate + 4-axis verify) · strict output format · cache — operating-grade patterns <strong>validated through 815 real generations</strong>.</>) },
        { tag: 'AI/ML-based sales support', body: (<><strong>Recruiters edit prompts directly without a developer</strong> — the same structure can be applied to sales-domain experts as-is.</>) },
        { tag: 'Bridge between business and IT', body: (<>Domain know-how <strong>decomposed into 40 blocks as data</strong> — recomposed and operated by field users.</>) },
      ],
    },
  },

  {
    id: 'p3-doc',
    index: '04',
    name: 'Automated Recruitment Document Verification System',
    role: 'Solo · OCR pipeline + RPA · in production (~20,000 cumulative documents)',
    tagline: 'Bundles of submitted documents were analyzed firsthand to define per-document fields and extraction logic — Korean public-document OCR + verification across 13 government/public-sector portals.',
    period: '2024 — Present',
    stack: ['Python · Flask', 'Naver CLOVA OCR', 'Selenium', 'Puppeteer', 'Pandas'],

    overview: (
      <>
        I personally analyzed real submitted-document bundles (certifications, language tests, preferential
        treatment papers, additional points, graduation, transcripts, residence registration, family registration,
        health insurance, national pension), one type at a time, and codified the issuing authority, layout, and
        core identifiers (submission number, date of birth, acquisition date, issue date) for each. On top of that
        sits an OCR pipeline (CLOVA OCR + 9-class auto-categorization of Korean public documents + per-document
        field extractors) combined with verification-portal automation (auto-traversal of 13 government/public-sector
        sites). Roughly 20,000 cumulative document reviews have run through the system, with OCR parsing accuracy
        around 95%.
      </>
    ),

    points: [
      {
        h: 'Per-document research turned into code — different extraction strategy by category',
        p: 'Even within "certifications," the formats issued by HRD Korea, the Korea Chamber of Commerce and Industry, and the Korea Association for ICT Promotion are all different. Language tests (TOEIC, TOEFL, OPIc, TEPS), vocational-training completion certificates, residence/family registrations, health insurance, national pension — I tore each one open and codified (1) what keyword to classify by, (2) what field sits at what position, and (3) what variations exist by issuing authority. The 9-class auto-categorization and per-document field extractors are the output of that domain analysis.',
      },
      {
        h: 'Within one system, precision/recall policy splits per task',
        p: '(1) Match judgment (certifications/languages/vocational-training ↔ application form) targets 99.99% precision — built conservatively to block false positives. Across ~20,000 reviews, judgment rate is 50–60% but error rate is 0%. When the system isn’t sure, it hands the case to a human, who only reviews that 40%. (2) OCR parsing (extracting submission number, date of birth, issue date) prioritizes recall because misses are costlier — some false positives are tolerated to minimize misses, achieving ~95% accuracy.',
      },
      {
        h: 'Verification: input is automated, result-checking is human — legal accountability stays explicit',
        p: 'The system auto-fills authentication number, date of birth, and issue date into verification portals, but the result screen is checked by a human. The screen is intentionally left visible to the user, not silenced. Because verification is the legally accountable final step, the hybrid of "automate input + leave judgment to a human" was the right operational and audit fit.',
      },
      {
        h: 'Auto-traversal that absorbs the dynamic variation of 13 government portals',
        p: 'Traverses 13 government and public-sector verification sites automatically. The required input fields (certification number, date of birth, issue date, authentication number) differ per institution, mapped one-to-one through the same per-document domain analysis. Site label changes are routed through dynamic branching, and bulk verification, side-by-side screenshot composition, and result ZIP packaging are bundled in. By hand it’s 1+ minute per case × 500+ cases per recruitment; automated, ~5 minutes per 100 cases.',
      },
    ],

    journey: {
      label: 'Project Journey',
      stages: [
        {
          tag: 'Why I Built It',
          body: 'I wanted to systematize recruitment document review — work that took 4–5 hours a day. But it was clear that simply calling a commercial OCR API wouldn’t produce meaningful automation: extraction only becomes meaningful when "what field lives at what position in each document, and what variations exist per issuing authority" is defined directly.',
        },
        {
          tag: 'Initial Build',
          body: 'I tore open real submitted-document bundles (certifications, language tests, preferential treatment, additional points, graduation, transcripts, residence/family registration, health insurance, national pension) one type at a time and analyzed them. On top of the layouts and core identifiers (submission number, date of birth, acquisition date, issue date) I codified per issuer, I built CLOVA OCR + 9-class auto-categorization + per-document field extraction into a single pipeline.',
        },
        {
          tag: 'Problems Found → Solutions',
          body: (
            <>
              <p>Once it was running, the following problems surfaced. I split policy by task to address them.</p>
              <ul className="prob-cats">
                <li>
                  <span className="cat-name">A. False-positive risk in match judgment</span>
                  <p className="cat-prob">When auto-comparing certifications/languages/vocational-training to applications, there was risk of false positives — judging different documents as identical. In an area that directly affects pass/fail decisions, even one error carries weight.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Targeted 99.99% precision and built it conservatively, so when the system lacks confidence the case is handed to a human. The judgment rate drops to 50–60%, but false positives are essentially eliminated.</p>
                </li>
                <li>
                  <span className="cat-name">B. Cost of misses in OCR parsing</span>
                  <p className="cat-prob">For extracting identifiers (submission number, date of birth, issue date), misses cost more than false positives. Too many cases requiring human follow-up undermines the value of automation.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Within the same system, policy is split — OCR parsing prioritizes recall. Some false positives are tolerated to minimize misses, achieving ~95% accuracy.</p>
                </li>
                <li>
                  <span className="cat-name">C. Legal accountability of verification results</span>
                  <p className="cat-prob">Verification results carry legal accountability as the final confirmation step. Automating the result judgment too risks making accountability murky in post-hoc disputes.</p>
                  <p className="cat-sol"><strong>Solution</strong> · Input is automated, but the result screen is left to human checking — automation scope was deliberately narrowed. The screen is intentionally visible, keeping accountability clear.</p>
                </li>
              </ul>
            </>
          ),
        },
        {
          tag: 'Current State',
          body: 'Roughly 20,000 cumulative document reviews have run through it, with OCR parsing accuracy around 95%. 13 government/public-sector verification sites are auto-traversed, and review time for ~100 candidates per day has been cut from 4–5 hours to under 1 hour.',
        },
        {
          tag: "What's Next",
          body: 'I want to add a flow that automatically learns patterns and updates classification rules when a new format appears from an issuing authority. New formats currently require a person to analyze and add rules — automating this drops operational cost another notch. Extending OCR-based auto-validation to the verification result screens themselves is also on the next-step list.',
        },
        {
          tag: 'Guiding Principle',
          body: 'The principle was to keep legally accountable steps outside the automation scope. The decision to leave verification result screens visible to the user belongs to the same line of thinking.',
        },
      ],
    },

    growth: {
      label: 'What I Gained',
      points: [
        'A metric-design view that even within one system, precision/recall policy can split by task — keeping "security-critical work uses precision, miss-prevention work uses recall" as a consistent separation principle',
        'The domain-analysis ability to tear open real submitted-document bundles and codify per-issuer variations, layouts, and identifiers',
        'Intentional hybrid of "automate input + leave judgment to a human" — a system-design pattern that deliberately narrows automation scope when legal accountability is involved',
        'An automation-design approach that absorbs site variation through dynamic branching — combining bot-detection circumvention with bulk-processing stability',
      ],
    },

    photoGalleries: [
      {
        id: 'input',
        title: 'Field-Friendly Input Interface',
        summary: 'Verification work is operated by the field, not by IT. Input-stage guides and upload screens are written in the field’s own language so non-developer operators can run the system without IT support.',
        cover: '/images/isbr-doc/처리가능한목록_비개발자인 현업 분들이 쉽게 사용할 수 있도록 수많은 서류 처리 시 어떤 엑셀 컬럼들을 작성해야하는지 정리해놓기도함.png',
        items: [
          { tag: 'Processable-document list guide', caption: 'A guide screen detailing which Excel columns to fill out, and how, when non-developer field staff process large volumes of documents. The system’s usage itself is written in the operator’s language so operations can run without separate IT support.', src: '/images/isbr-doc/처리가능한목록_비개발자인 현업 분들이 쉽게 사용할 수 있도록 수많은 서류 처리 시 어떤 엑셀 컬럼들을 작성해야하는지 정리해놓기도함.png' },
          { tag: 'Excel bulk upload', caption: 'Upload candidate data requiring verification as a single Excel — the work of processing 500+ verifications per recruitment one by one is replaced with a single bulk upload.', src: '/images/isbr-doc/엑셀데이터업로드 화면.png' },
        ],
      },
      {
        id: 'ocr-pipeline',
        title: 'OCR Pipeline — From Unstructured ZIP to Structured Data',
        summary: 'A pipeline that takes a single ZIP upload of randomly-ordered PDFs/images per applicant, auto-classifies and extracts fields, and lands the result as a structured Excel.',
        cover: '/images/isbr-doc/OCR_처리결과UI.png',
        items: [
          { tag: 'ZIP upload entry', caption: 'A separate tab from the verification-Excel flow: a single ZIP containing per-applicant folders is dragged in, and the system auto-runs OCR, document-type classification, and field extraction in one pass — consolidating what used to be multiple screens into one entry point.', src: '/images/isbr-doc/OCR_대시보드_input화면.png' },
          { tag: 'Actual shape of the input data', caption: 'Each applicant folder (e.g., 0005-000003) holds a mixed pile of language tests, certificates, and household records in arbitrary order. Without actually extracting the text, automatic classification is impossible — this was the starting point requiring a domain-analysis-based classifier.', src: '/images/isbr-doc/OCR_인풋데이터구조.png' },
          { tag: 'Per-document extraction UI', caption: 'Extraction results are auto-grouped by document type (TOEFL, language-score pre-registration certificate, OPIC, etc.). Each field is tagged with a "regex" / "GPT" badge showing how the value was filled, so a reviewer can immediately gauge confidence.', src: '/images/isbr-doc/OCR_처리결과UI.png' },
          { tag: 'Detail check — YOLO region overlay', caption: 'Clicking an extracted value opens the source image with YOLO-identified key regions (score, certification number, date) outlined in boxes — letting the user visually verify whether to trust the OCR result on the spot.', src: '/images/isbr-doc/OCR_처리결과_상세페이지_yolo로확인.png' },
          { tag: 'Excel download result', caption: 'Fields needed per document — folder · institution · certificateName · passNum · birth · extraNum · sourceFile, etc. — land in a structured Excel. A gptFilled column records which fields were filled via GPT, enabling post-hoc confidence review.', src: '/images/isbr-doc/OCR_처리결과예시_엑셀다운로드 시 각 서류별 추출이 필요한 요소들 자동 추출.png' },
        ],
      },
      {
        id: 'evidence',
        title: 'Auto Processing + Verification Evidence Preservation',
        summary: 'Because verification carries legal accountability, input is automated while results are preserved in a form that can be re-examined after the fact.',
        cover: '/images/isbr-doc/진위조회 인증 실제 사진_지원자의 문서번호와 그 결과를 좌우로 분기해서 한 화면에 캡처를 하여 이 지원자가 입력한 값이 진위가 확인됐음을 증거로남겨줌.png',
        items: [
          { tag: 'Verification-evidence capture', caption: 'The candidate’s document number and the verification result screen are placed side by side and captured as a single image. "The value this candidate entered was actually verified" is auto-preserved as evidence for post-hoc audit and legal disputes.', src: '/images/isbr-doc/진위조회 인증 실제 사진_지원자의 문서번호와 그 결과를 좌우로 분기해서 한 화면에 캡처를 하여 이 지원자가 입력한 값이 진위가 확인됐음을 증거로남겨줌.png' },
        ],
      },
      {
        id: 'output',
        title: 'Verifiable Result Package',
        summary: 'Results don’t end at "success" — the cause for cases requiring human follow-up is included in the deliverable.',
        cover: '/images/isbr-doc/처리결과 zip파일 목록_처리완료된 서류 카테고리만큼 폴더가 생기고 거기에 진위조회 결과 인증 사진들을 넣어줌 또한 엑셀에 디버깅이 찍힘.png',
        items: [
          { tag: 'Result display', caption: 'Successfully verified cases show "success"; failed/unprocessed cases are immediately separated with a distinct marker. The system narrows down the area requiring human follow-up first.', src: '/images/isbr-doc/처리결과_성공했으면 성공했다고나옴.png' },
          { tag: 'Excel result + debugging columns', caption: 'A result Excel where the result column carries 1/0 outcomes and the error column auto-records failure causes — designed so cases needing follow-up have their cause immediately visible.', src: '/images/isbr-doc/엑셀결과 화면 예시 result 등에 1과 0으로 결과 뜨고 error컬럼에 디버기ㅣㅇ.png' },
          { tag: 'Result ZIP package', caption: 'Processed documents are bundled into per-category folders containing verification screenshots, all packaged into a downloadable ZIP. The verification screenshots and the debugging Excel ship together — keeping retention and handover after the recruitment all in one flow.', src: '/images/isbr-doc/처리결과 zip파일 목록_처리완료된 서류 카테고리만큼 폴더가 생기고 거기에 진위조회 결과 인증 사진들을 넣어줌 또한 엑셀에 디버깅이 찍힘.png' },
        ],
      },
    ],

    metricSplit: [
      { kind: 'Match judgment (cert / language / vocational-training ↔ application)', target: 'Target precision: 99.99%', result: '~20,000 reviewed · 50–60% judgment rate · 0 errors', note: 'Conservative — false positives blocked (security-inspection pattern)' },
      { kind: 'OCR parsing (submission number / DOB / issue date / number)', target: 'Recall first', result: '30,000+ documents · 10+ categories · ~95% accuracy', note: 'False positives tolerated — misses minimized (recall pattern)' },
    ],

    relevance: {
      label: 'Connection to This Role',
      lines: [
        { tag: 'RPA · AI Agent · OCR (preferred)', body: (<><strong>All three preferred items combined in one flow</strong> — auto-traversal across 13 government portals + Korean 9-class document OCR + end-to-end pipeline.</>) },
        { tag: 'Structured / unstructured normalization', body: (<>Unstructured public documents → <strong>9-class auto-categorization + field extraction → structured checklist</strong>.</>) },
        { tag: 'Operational-context service design', body: (<>~100 candidates per day cut from <strong>4–5 hrs → under 1 hr</strong>, with the <strong>legally accountable step deliberately left to a human</strong>.</>) },
      ],
    },
  },
];

export const judgmentMatrix = [
  ['Integrated ERP for a Cosmetics Company', 'Channel · inventory · GPT interpretation', 'DRAFT → CONFIRM as deliberate manual stage', 'Strategy · negotiation · new-product positioning'],
  ['AI Interview Question Generator', 'Question generation · 4-axis verification', 'Stable 815 / Experimental 0 (informed by real feedback)', 'Sensitive-info blocking · final pass/fail decision'],
  ['Government Funding Auto-Matching System', 'Hard → soft → keyword auto-matching', 'GPT second-pass only on top 10', 'Consultant consultation · business-plan review'],
  ['Automated Recruitment Document Verification System', 'OCR · parsing · classification', 'Verification result screens checked by user', 'Legal verification judgment'],
  ['Internal 360-degree Review', 'Diagnosis generation · PDF encryption', 'AI diagnosis + HR can edit', 'Coaching plan'],
  ['4 Lectures', 'Tools · theory transfer', 'Including fallback logic and failure cases', '"What to process" decision belongs to the learner'],
];

export const lectureTimeline = [
  {
    year: '2023',
    title: 'Chungcheong ICT Full-Stack Bootcamp',
    target: '43 students · rating 4.6 / Covered HTML/CSS/JavaScript fundamentals through React, Express, GitHub. Centered on a full-stack flow where students personally walk through simple DB design → CRUD → deployment in one go.',
    tag: 'Full-stack',
  },
  {
    year: '2024',
    duration: '~1 month each',
    title: 'LG Innotek · LG Chem — ML / AI Fundamentals',
    target: 'For large-enterprise employees / Machine learning (Python · scikit-learn) for correlation analysis on basic and public datasets, testing across parameter values. Visualization with matplotlib/seaborn and data analysis with pandas/numpy. Also covered CNN basics and hands-on design.',
    tag: 'ML / AI',
    highlight: true,
  },
  {
    year: '2025.12',
    title: 'In-house GPT · Workflow Automation Bootcamp',
    target: '20 in-house employees · 6 hours / OS automation with PowerShell (folder renaming and moves), Excel automation with Python. Combined with data structures and lightweight DB concepts, centered on "how to handle data by structuring it."',
    tag: 'Gen AI',
  },
];
