import { Outlet } from 'react-router-dom';
import ReDesignHeader from './components/layouts/Header';

function App() {
  return (
    <>
      <ReDesignHeader />
      <Outlet />
    </>
  );
}

export default App;
