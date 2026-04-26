import { useLang } from '../i18n/LanguageContext';
import { projects as projectsKo, lectureTimeline as lectureKo } from './sections';
import { projects as projectsEn, lectureTimeline as lectureEn } from './sections.en';

export function useSections() {
  const { lang } = useLang();
  if (lang === 'en') {
    return { projects: projectsEn, lectureTimeline: lectureEn };
  }
  return { projects: projectsKo, lectureTimeline: lectureKo };
}
