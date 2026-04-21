interface Props {
  label: string;
  value: number;
  target: number;
  color?: string;
}

export function MacroBar({ label, value, target, color = '#222' }: Props) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          fontWeight: 600,
          color: '#222',
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span className="px-num" style={{ color: '#6a6a6a', fontWeight: 500 }}>
          {Math.round(value)}/{target}g
        </span>
      </div>
      <div className="px-bar">
        <i style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
