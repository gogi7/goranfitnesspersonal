import type { WeightEntry } from '../lib/types';

interface Props {
  log: WeightEntry[];
  startWeight: number;
  goalWeight: number;
  goalDate: Date;
  today: string;
  width?: number;
  height?: number;
  showProjection?: boolean;
  compact?: boolean;
}

export function WeightTrendChart({
  log,
  startWeight,
  goalWeight,
  goalDate,
  today,
  width = 640,
  height = 260,
  showProjection = true,
  compact = false,
}: Props) {
  if (log.length === 0) {
    return (
      <div className="empty" style={{ padding: 24 }}>
        No weight logged yet. Add your first entry to see the trend.
      </div>
    );
  }
  const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));
  const start = new Date(sorted[0].date);
  const end = new Date(goalDate);
  const totalMs = end.getTime() - start.getTime() || 1;
  const pad = { l: 40, r: 20, t: compact ? 16 : 24, b: 28 };
  const w = width;
  const h = height;
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  const yMax = Math.max(startWeight, sorted[0].kg) + 2;
  const yMin = Math.min(goalWeight, sorted[sorted.length - 1].kg) - 2;
  const yRange = yMax - yMin || 1;
  const yToPx = (v: number) => pad.t + plotH * (1 - (v - yMin) / yRange);
  const tToPx = (d: Date | string) => {
    const t = typeof d === 'string' ? new Date(d) : d;
    return pad.l + plotW * ((t.getTime() - start.getTime()) / totalMs);
  };

  const todayDate = new Date(today);
  const todayWeight = sorted.find((l) => l.date === today)?.kg ?? sorted[sorted.length - 1].kg;
  const projPath = `M ${tToPx(todayDate)} ${yToPx(todayWeight)} L ${tToPx(end)} ${yToPx(goalWeight)}`;

  const actual = sorted
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${tToPx(p.date)} ${yToPx(p.kg)}`)
    .join(' ');

  const yTicks: number[] = [];
  const stepY = Math.max(1, Math.ceil(yRange / 4));
  for (let v = Math.ceil(yMin); v <= yMax; v += stepY) yTicks.push(v);

  const xTicks: Date[] = [];
  {
    let d = new Date(start.getFullYear(), start.getMonth(), 1);
    while (d <= end) {
      if (d >= start) xTicks.push(new Date(d));
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }
  }

  const goalY = yToPx(goalWeight);

  return (
    <svg
      className="px-chart"
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      preserveAspectRatio="none"
    >
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            x2={w - pad.r}
            y1={yToPx(v)}
            y2={yToPx(v)}
            stroke="#ebebeb"
            strokeWidth="1"
          />
          <text
            x={pad.l - 8}
            y={yToPx(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6a6a6a"
            fontWeight="500"
          >
            {v}
          </text>
        </g>
      ))}

      <line
        x1={pad.l}
        x2={w - pad.r}
        y1={goalY}
        y2={goalY}
        stroke="#16a34a"
        strokeWidth="1.25"
        strokeDasharray="3 4"
      />
      <text
        x={w - pad.r - 4}
        y={goalY - 4}
        textAnchor="end"
        fontSize="10"
        fill="#16a34a"
        fontWeight="700"
      >
        GOAL {goalWeight}kg
      </text>

      {showProjection && (
        <>
          <path
            d={projPath}
            stroke="#ff385c"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            fill="none"
            opacity="0.8"
          />
          <circle cx={tToPx(end)} cy={yToPx(goalWeight)} r="4" fill="#ff385c" />
        </>
      )}

      <path
        d={actual}
        stroke="#222"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {sorted.map((p) => (
        <circle key={p.date} cx={tToPx(p.date)} cy={yToPx(p.kg)} r="2.5" fill="#222" />
      ))}

      <line
        x1={tToPx(todayDate)}
        x2={tToPx(todayDate)}
        y1={pad.t}
        y2={h - pad.b}
        stroke="#ff385c"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle
        cx={tToPx(todayDate)}
        cy={yToPx(todayWeight)}
        r="5"
        fill="#ff385c"
        stroke="#fff"
        strokeWidth="2"
      />

      {xTicks.map((d, i) => (
        <text
          key={i}
          x={tToPx(d)}
          y={h - 8}
          textAnchor="middle"
          fontSize="10"
          fill="#6a6a6a"
          fontWeight="500"
        >
          {d.toLocaleDateString('en-AU', { month: 'short' })}
          {d.getMonth() === 0 ? ` '${String(d.getFullYear()).slice(2)}` : ''}
        </text>
      ))}
    </svg>
  );
}
