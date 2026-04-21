import { Sun, Moon, Monitor } from 'lucide-react';
import { useStore } from '../lib/store';
import { cycleTheme } from '../lib/theme';
import type { ThemeMode } from '../lib/types';

const ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const NEXT_LABEL: Record<ThemeMode, string> = {
  light: 'Switch to dark',
  dark: 'Match system',
  system: 'Switch to light',
};

interface Props {
  compact?: boolean;
}

export function ThemeToggle({ compact }: Props) {
  const theme = useStore((s) => s.prefs.theme);
  const setTheme = useStore((s) => s.setTheme);
  const Icon = ICONS[theme];

  const onClick = () => setTheme(cycleTheme(theme));

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="px-btn is-ghost is-sm"
        aria-label={NEXT_LABEL[theme]}
        title={NEXT_LABEL[theme]}
        style={{ padding: '6px 8px' }}
      >
        <Icon size={16} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="sidebar-nav"
      aria-label={NEXT_LABEL[theme]}
      title={NEXT_LABEL[theme]}
    >
      <Icon size={18} strokeWidth={1.75} />
      Theme · {theme}
    </button>
  );
}
