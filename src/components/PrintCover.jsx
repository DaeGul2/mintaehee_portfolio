import { useLang } from '../i18n/LanguageContext';

// 인쇄 시 첫 페이지 — 표지
export function PrintCover() {
  const { t } = useLang();
  return (
    <section className="print-cover" aria-hidden="true">
      <span className="print-cover-kicker">PORTFOLIO · 2026</span>
      <h1 className="print-cover-name">{t('name')}</h1>
      <p className="print-cover-role">{t('role')}</p>
      <p className="print-cover-tag">{t('tag')}</p>
      <div className="print-cover-rule" aria-hidden="true" />
      <p className="print-cover-apply">{t('contactApplyVal')}</p>
    </section>
  );
}

// 인쇄 시 마지막 페이지 — 감사 인사
export function PrintThanks() {
  return (
    <section className="print-thanks" aria-hidden="true">
      <h2 className="print-thanks-title">감사합니다.</h2>
      <p className="print-thanks-mail">alsxogml1234@gmail.com</p>
    </section>
  );
}
