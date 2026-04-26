# 민태희 포트폴리오 — MetLife DT 지원

Vite + React 18.

## 실행

```bash
npm install
npm run dev   # http://localhost:5173
```

## 빌드 / 배포

```bash
npm run build
# dist/ 폴더를 GitHub Pages · Netlify · Vercel 등에 그대로 업로드
```

## 폴더 구조

```
portfolio-vite/
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx                  # 전체 조립
│   ├── index.css                # 단색 미니멀 스타일 전체
│   ├── components/
│   │   ├── Nav.jsx              # 상단 sticky 네비
│   │   ├── Hero.jsx             # 자기 정의 + 학력 + KPI 3 + 증명사진
│   │   ├── TechSection.jsx      # 기술 섹션 공용 템플릿
│   │   ├── DumpBox.jsx          # 실측 데이터 박스 6종
│   │   ├── About.jsx            # 자동화 판단 매트릭스
│   │   ├── Contact.jsx
│   │   ├── MediaPlaceholder.jsx # 영상·사진 폴백 (파일 없으면 placeholder)
│   │   └── FadeIn.jsx
│   └── data/
│       └── sections.jsx         # 6 기술 섹션 콘텐츠 데이터
└── public/
    ├── images/                  # 증명사진 + 사진 17장 자리
    │   └── profile.jpg          # ← 여기에 증명사진 넣으면 자동 표시
    └── videos/                  # 영상 5개 자리
```

## 미디어 채우는 법

각 영상·사진의 `src` 경로 그대로 파일 넣으면 placeholder가 자동으로 실제 미디어로 교체됨.

| 항목 | 경로 |
|---|---|
| 증명사진 | `public/images/profile.jpg` |
| 영상 1~6 | `public/videos/0X_*.mp4` |
| 사진 1-1, 2-1 등 | `public/images/0X_*.png` |

자세한 촬영 가이드는 `이력정리/포트폴리오_미디어_가이드.xlsx` 참조.

## 텍스트 수정

모든 섹션 텍스트는 **`src/data/sections.jsx`** 한 곳에 집중. 직접 편집해도 되고,
`이력정리/포트폴리오_텍스트_원고.xlsx`를 수정해서 주면 그대로 반영해드림.
