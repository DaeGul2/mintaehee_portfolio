import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';

export function ScrollTop() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-top"
      aria-label={t('scrollTopAria')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span className="st-arrow">↑</span>
      <span className="st-label">{t('scrollTopLabel')}</span>
    </button>
  );
}
