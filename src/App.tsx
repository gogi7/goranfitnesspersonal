import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { BottomTabs } from './components/BottomTabs';
import { MobileHeader } from './components/MobileHeader';
import { Dashboard } from './routes/Dashboard';
import { Weight } from './routes/Weight';
import { Food } from './routes/Food';
import { Fasting } from './routes/Fasting';
import { Exercise } from './routes/Exercise';
import { Photos } from './routes/Photos';
import { Roadmap } from './routes/Roadmap';
import { Settings } from './routes/Settings';

const ROUTE_TITLES: Record<string, string> = {
  '/weight': 'Weight',
  '/food': 'Food',
  '/fasting': 'Fasting',
  '/exercise': 'Exercise',
  '/photos': 'Progress',
  '/roadmap': 'Roadmap',
  '/settings': 'Settings',
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/weight" element={<Weight />} />
      <Route path="/food" element={<Food />} />
      <Route path="/fasting" element={<Fasting />} />
      <Route path="/exercise" element={<Exercise />} />
      <Route path="/photos" element={<Photos />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export function App() {
  const loc = useLocation();
  const title = ROUTE_TITLES[loc.pathname];
  const showBack = loc.pathname !== '/';
  return (
    <div className="app-root">
      {/* Mobile shell */}
      <div className="app-mobile">
        <MobileHeader title={title} showBack={showBack} />
        <main className="app-mobile-body">
          <AppRoutes />
        </main>
        <BottomTabs />
      </div>

      {/* Desktop shell */}
      <div className="app-desktop">
        <Sidebar />
        <main className="app-desktop-main">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
