import type { CSSProperties, ReactNode } from 'react';

interface Props {
  pct: number;
  color?: string;
  size?: number;
  thickness?: number;
  children?: ReactNode;
  className?: string;
}

export function ProgressRing({
  pct,
  color = '#222',
  size = 76,
  thickness = 8,
  children,
  className,
}: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  const style = {
    '--pct': clamped,
    '--col': color,
    '--sz': `${size}px`,
    '--th': `${thickness}px`,
  } as CSSProperties;
  return (
    <div className={`px-ring ${className ?? ''}`} style={style}>
      <div className="px-ring-inner">{children}</div>
    </div>
  );
}
