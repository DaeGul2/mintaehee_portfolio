import { Sidebar } from './components/Sidebar';
import { Main } from './components/Main';
import { ScrollTop } from './components/ScrollTop';
import { usePrint } from './components/PrintContext';
import { PrintCover, PrintThanks } from './components/PrintCover';
import { ShortPrintLayout } from './components/ShortPrintLayout';

function App() {
  const { printMode, shortView, toggleShortView } = usePrint();

  if (shortView) {
    return (
      <>
        <button
          type="button"
          className="short-exit"
          onClick={toggleShortView}
          aria-label="풀 버전으로 돌아가기"
          title="풀 버전으로 돌아가기"
        >
          ← 풀 버전 보기
        </button>
        <ShortPrintLayout />
      </>
    );
  }

  return (
    <>
      {printMode && <PrintCover />}
      <div className={`layout${printMode ? ' is-print' : ''}`}>
        <Sidebar />
        <Main />
      </div>
      {printMode && <PrintThanks />}
      {!printMode && <ScrollTop />}
    </>
  );
}

export default App;
