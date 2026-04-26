import { useLang } from '../i18n/LanguageContext';

export function LangToggle() {
  const { lang, toggle, t } = useLang();
  const isKo = lang === 'ko';
  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={isKo ? t('langAriaToEn') : t('langAriaToKo')}
      title={isKo ? t('langAriaToEn') : t('langAriaToKo')}
    >
      <span className="lt-icon" aria-hidden="true">⌘</span>
      <span className="lt-label">{isKo ? t('langLabelEn') : t('langLabelKo')}</span>
    </button>
  );
}
