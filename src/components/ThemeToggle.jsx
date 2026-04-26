import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LanguageContext';

const KEY = 'mh-theme';

export function ThemeToggle() {
  const { t } = useLang();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(KEY) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((tt) => (tt === 'dark' ? 'light' : 'dark'));

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? t('themeAriaToLight') : t('themeAriaToDark')}
      title={theme === 'dark' ? t('themeTitleToLight') : t('themeTitleToDark')}
    >
      {theme === 'dark' ? '☀︎' : '☾'}
      <span className="tt-label">{theme === 'dark' ? t('themeLabelLight') : t('themeLabelDark')}</span>
    </button>
  );
}
