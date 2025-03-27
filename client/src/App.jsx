import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`app-container ${isHomePage ? 'home-page' : 'not-home-page'}`}>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
}

export default App;
