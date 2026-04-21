import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';
import { useStore } from '../lib/store';

const items = [
  { to: '/', label: 'Dashboard', icon: Icon.home, end: true },
  { to: '/weight', label: 'Weight', icon: Icon.scale },
  { to: '/food', label: 'Food', icon: Icon.food },
  { to: '/fasting', label: 'Fasting', icon: Icon.clock },
  { to: '/exercise', label: 'Exercise', icon: Icon.run },
  { to: '/roadmap', label: 'Roadmap', icon: Icon.map },
  { to: '/photos', label: 'Progress photos', icon: Icon.camera },
];

export function Sidebar() {
  const user = useStore((s) => s.user);
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <aside className="app-desktop-sidebar" aria-label="Primary">
      <div className="sidebar-brand">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M2 14h5l2-6 4 12 2-8 3 4h8"
            stroke="#ff385c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="sidebar-brand-word">Pulse</div>
      </div>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) => `sidebar-nav ${isActive ? 'is-active' : ''}`}
        >
          <it.icon size={18} />
          {it.label}
        </NavLink>
      ))}
      <div style={{ flex: 1 }} />
      <NavLink
        to="/settings"
        className={({ isActive }) => `sidebar-nav ${isActive ? 'is-active' : ''}`}
      >
        <Icon.settings size={18} />
        Settings
      </NavLink>
      <div className="sidebar-user">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: '#222',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
          <div className="px-meta-sm" style={{ fontSize: 11 }}>
            {user.age} · {user.heightCm}cm
          </div>
        </div>
      </div>
    </aside>
  );
}
