import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';

const PrintContext = createContext(null);

export function PrintProvider({ children }) {
  const [printMode, setPrintMode] = useState(false);
  const [printVariant, setPrintVariant] = useState('full');
  const [shortView, setShortView] = useState(false);
  const { setLang } = useLang();

  useEffect(() => {
    document.body.dataset.printMode = printMode ? '1' : '';
    document.body.dataset.printVariant = printMode ? printVariant : '';
    document.body.dataset.shortView = shortView ? '1' : '';
  }, [printMode, printVariant, shortView]);

  // 인쇄 다이얼로그가 닫히면 자동으로 평소 모드로 복귀
  useEffect(() => {
    if (!printMode) return;
    const onAfter = () => setPrintMode(false);
    window.addEventListener('afterprint', onAfter);
    return () => window.removeEventListener('afterprint', onAfter);
  }, [printMode]);

  const requestPrint = useCallback((variant = 'full') => {
    setLang('ko');
    setPrintVariant(variant);
    setPrintMode(true);
    // 1) 레이아웃 평탄화 → 2) 폰트 로딩 대기 → 3) 이미지 로딩 대기 → 4) 타이틀 비우고 인쇄
    setTimeout(async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (_) {}
      const imgs = Array.from(document.images).filter((i) => !i.complete);
      if (imgs.length > 0) {
        await Promise.all(
          imgs.map(
            (i) =>
              new Promise((res) => {
                i.addEventListener('load', res, { once: true });
                i.addEventListener('error', res, { once: true });
              }),
          ),
        );
      }
      // 인쇄 헤더에서 페이지 타이틀 제거
      const originalTitle = document.title;
      document.title = ' ';
      try {
        window.print();
      } finally {
        // 다이얼로그가 끝나면 복귀 (afterprint도 별개로 발화)
        setTimeout(() => {
          document.title = originalTitle;
        }, 200);
      }
    }, 400);
  }, [setLang]);

  const toggleShortView = useCallback(() => {
    setShortView((v) => {
      const next = !v;
      // 짧은 뷰 진입/이탈 시 한국어 강제 + 페이지 최상단으로 스크롤
      if (next) setLang('ko');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return next;
    });
  }, [setLang]);

  return (
    <PrintContext.Provider value={{ printMode, printVariant, requestPrint, shortView, toggleShortView }}>
      {children}
    </PrintContext.Provider>
  );
}

export function usePrint() {
  const ctx = useContext(PrintContext);
  if (!ctx) throw new Error('usePrint must be inside PrintProvider');
  return ctx;
}
