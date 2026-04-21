import { useStore } from '../lib/store';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  title?: string;
  showBack?: boolean;
}

export function MobileHeader({ title, showBack }: Props) {
  const user = useStore((s) => s.user);
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="app-mobile-header">
      {showBack ? (
        <NavLink to="/" className="px-btn is-ghost is-sm" aria-label="Home">
          <Icon.chevronR size={16} style={{ transform: 'rotate(180deg)' }} />
        </NavLink>
      ) : (
        <div>
          <div className="px-meta-sm">Pulse</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.44px' }}>
            {title ?? `Hi, ${user.name.split(' ')[0]}`}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle compact />
        <NavLink to="/settings" className="app-avatar" aria-label="Settings">
          {initials}
        </NavLink>
      </div>
    </header>
  );
}
