import { usePrint } from './PrintContext';

export function PrintButton() {
  const { printMode, requestPrint, shortView, toggleShortView } = usePrint();
  if (printMode) return null;
  return (
    <div className="print-btn-group">
      <button
        type="button"
        className="print-btn"
        onClick={() => requestPrint('full')}
        aria-label="포트폴리오를 PDF로 저장"
        title="A4 인쇄 / PDF로 저장"
      >
        <span className="print-btn-icon" aria-hidden="true">⎙</span>
        <span className="print-btn-label">PDF로 저장</span>
      </button>
      <button
        type="button"
        className={`print-btn print-btn-short${shortView ? ' is-active' : ''}`}
        onClick={toggleShortView}
        aria-label={shortView ? '풀 버전으로 돌아가기' : '요약 버전 보기'}
        title={shortView ? '풀 버전으로 돌아가기' : '요약 버전을 화면에 펼쳐 캡처'}
      >
        <span className="print-btn-icon" aria-hidden="true">{shortView ? '↩' : '≡'}</span>
        <span className="print-btn-label">{shortView ? '풀 버전 보기' : '요약 보기'}</span>
      </button>
    </div>
  );
}
