import { Sidebar } from './components/Sidebar';
import { Main } from './components/Main';
import { ScrollTop } from './components/ScrollTop';

function App() {
  return (
    <>
      <div className="layout">
        <Sidebar />
        <Main />
      </div>
      <ScrollTop />
    </>
  );
}

export default App;
