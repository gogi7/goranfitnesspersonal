import { useMemo, useRef, useState } from 'react';
import type { WeightEntry } from '../lib/types';
import { fmtDateShort } from '../lib/health';

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
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const sorted = useMemo(
    () => [...log].sort((a, b) => a.date.localeCompare(b.date)),
    [log]
  );

  if (sorted.length === 0) {
    return (
      <div
        className="empty"
        style={{ padding: 32, textAlign: 'center' }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
          No trend yet
        </div>
        <div className="px-meta-sm">
          Log your first weight to start the chart. That entry becomes your baseline.
        </div>
      </div>
    );
  }

  const start = new Date(sorted[0].date);
  const end = new Date(goalDate);
  const totalMs = Math.max(end.getTime() - start.getTime(), 86400000);
  const pad = { l: 40, r: 20, t: compact ? 16 : 28, b: 28 };
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
  const todayWeight =
    sorted.find((l) => l.date === today)?.kg ?? sorted[sorted.length - 1].kg;
  const projPath = `M ${tToPx(todayDate)} ${yToPx(todayWeight)} L ${tToPx(end)} ${yToPx(
    goalWeight
  )}`;
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

  // Find nearest point under cursor for hover tooltip.
  const pickNearest = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    // Map client coords back into viewBox coords.
    const vx = ((clientX - rect.left) / rect.width) * w;
    const vy = ((clientY - rect.top) / rect.height) * h;
    let best = -1;
    let bestD = Infinity;
    for (let i = 0; i < sorted.length; i++) {
      const px = tToPx(sorted[i].date);
      const py = yToPx(sorted[i].kg);
      const d = Math.hypot(px - vx, py - vy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    // Only snap if reasonably close.
    return bestD < 40 ? best : null;
  };

  const onMove = (e: React.PointerEvent) => {
    const idx = pickNearest(e.clientX, e.clientY);
    setHoverIdx(idx);
  };

  const onLeave = () => setHoverIdx(null);

  const hovered = hoverIdx != null ? sorted[hoverIdx] : null;
  const hoveredPrev = hoverIdx != null && hoverIdx > 0 ? sorted[hoverIdx - 1] : null;
  const hoveredDelta =
    hovered && hoveredPrev ? +(hovered.kg - hoveredPrev.kg).toFixed(1) : null;

  const tooltipX = hovered ? tToPx(hovered.date) : 0;
  const tooltipY = hovered ? yToPx(hovered.kg) : 0;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        style={{ display: 'block', touchAction: 'pan-y' }}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
        role="img"
        aria-label="Weight trend chart"
      >
        {/* gridlines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={pad.l}
              x2={w - pad.r}
              y1={yToPx(v)}
              y2={yToPx(v)}
              stroke="var(--pulse-hair)"
              strokeWidth="1"
            />
            <text
              x={pad.l - 8}
              y={yToPx(v) + 4}
              textAnchor="end"
              fontSize="10"
              fill="var(--pulse-muted)"
              fontWeight="500"
            >
              {v}
            </text>
          </g>
        ))}

        {/* goal line */}
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

        {/* projection */}
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

        {/* actual line */}
        <path
          d={actual}
          stroke="var(--pulse-ink)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* data dots */}
        {sorted.map((p, i) => {
          const active = i === hoverIdx;
          return (
            <circle
              key={p.date}
              cx={tToPx(p.date)}
              cy={yToPx(p.kg)}
              r={active ? 5 : 2.5}
              fill={active ? '#ff385c' : 'var(--pulse-ink)'}
              stroke={active ? '#fff' : 'none'}
              strokeWidth={active ? 2 : 0}
              style={{ transition: 'r 120ms, fill 120ms' }}
            />
          );
        })}

        {/* today marker (only if not hovering) */}
        {hoverIdx == null && (
          <>
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
              stroke="var(--sa-bg)"
              strokeWidth="2"
            />
          </>
        )}

        {/* x labels */}
        {xTicks.map((d, i) => (
          <text
            key={i}
            x={tToPx(d)}
            y={h - 8}
            textAnchor="middle"
            fontSize="10"
            fill="var(--pulse-muted)"
            fontWeight="500"
          >
            {d.toLocaleDateString('en-AU', { month: 'short' })}
            {d.getMonth() === 0 ? ` '${String(d.getFullYear()).slice(2)}` : ''}
          </text>
        ))}
      </svg>

      {hovered && (
        <ChartTooltip
          xPct={(tooltipX / w) * 100}
          yPct={(tooltipY / h) * 100}
          date={hovered.date}
          kg={hovered.kg}
          delta={hoveredDelta}
        />
      )}
    </div>
  );
}

interface TooltipProps {
  xPct: number;
  yPct: number;
  date: string;
  kg: number;
  delta: number | null;
}

function ChartTooltip({ xPct, yPct, date, kg, delta }: TooltipProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: 'translate(-50%, calc(-100% - 12px))',
        pointerEvents: 'none',
        background: 'var(--sa-fg)',
        color: 'var(--sa-bg)',
        padding: '6px 10px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 5,
      }}
    >
      <div style={{ fontWeight: 700, letterSpacing: '-0.2px' }}>
        {kg.toFixed(1)} kg
      </div>
      <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>
        {fmtDateShort(date)}
        {delta != null && delta !== 0 && (
          <>
            {' · '}
            <span style={{ color: delta < 0 ? '#6fd093' : '#ff8ba1' }}>
              {delta < 0 ? '▼' : '▲'} {Math.abs(delta).toFixed(1)} kg
            </span>
          </>
        )}
      </div>
    </div>
  );
}
