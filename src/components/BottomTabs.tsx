import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';

const tabs = [
  { to: '/', label: 'Home', icon: Icon.home, end: true },
  { to: '/weight', label: 'Weight', icon: Icon.scale },
  { to: '/food', label: 'Food', icon: Icon.food },
  { to: '/fasting', label: 'Fasting', icon: Icon.clock },
  { to: '/exercise', label: 'Move', icon: Icon.run },
];

export function BottomTabs() {
  return (
    <nav className="bottom-tabs" aria-label="Primary">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => `bottom-tab ${isActive ? 'is-active' : ''}`}
        >
          <t.icon size={22} />
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
