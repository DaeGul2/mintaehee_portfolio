import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { strings } from './strings';

const KEY = 'mh-lang';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'ko';
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'ko';
  });

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(KEY, lang);
  }, [lang]);

  const value = useMemo(() => {
    const dict = strings[lang] || strings.ko;
    const t = (key) => (key in dict ? dict[key] : key);
    return {
      lang,
      setLang,
      toggle: () => setLang((l) => (l === 'ko' ? 'en' : 'ko')),
      t,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
