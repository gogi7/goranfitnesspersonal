import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WeightEntry } from '../lib/types';
import { fmtDateShort } from '../lib/health';

interface Props {
  log: WeightEntry[];
  startWeight: number;
  goalWeight: number;
  goalDate: Date;
  today: string;
  height?: number;
  showProjection?: boolean;
}

interface ChartPoint {
  ts: number;
  kg?: number;
  projection?: number;
  date: string;
}

export function WeightTrendChart({
  log,
  startWeight,
  goalWeight,
  goalDate,
  today,
  height = 260,
  showProjection = true,
}: Props) {
  const sorted = useMemo(
    () => [...log].sort((a, b) => a.date.localeCompare(b.date)),
    [log]
  );

  const { data, yMin, yMax, xMin, xMax, todayTs, todayKg } = useMemo(() => {
    if (sorted.length === 0) {
      return {
        data: [] as ChartPoint[],
        yMin: goalWeight - 2,
        yMax: Math.max(goalWeight + 10, startWeight + 2),
        xMin: new Date(today).getTime(),
        xMax: goalDate.getTime(),
        todayTs: new Date(today).getTime(),
        todayKg: startWeight || goalWeight,
      };
    }
    const startTs = new Date(sorted[0].date).getTime();
    const goalTs = goalDate.getTime();
    const todayTs = new Date(today).getTime();
    const todayKg = sorted.find((e) => e.date === today)?.kg ?? sorted[sorted.length - 1].kg;

    const pts: ChartPoint[] = sorted.map((e) => ({
      ts: new Date(e.date).getTime(),
      kg: e.kg,
      date: e.date,
    }));

    // Projection anchor: today's weight is also the start of the projection line.
    const lastPt = pts[pts.length - 1];
    lastPt.projection = lastPt.kg;

    if (showProjection && goalTs > lastPt.ts) {
      pts.push({
        ts: goalTs,
        projection: goalWeight,
        date: goalDate.toISOString().slice(0, 10),
      });
    }

    const kgValues = sorted.map((e) => e.kg);
    const yMax = Math.max(startWeight, ...kgValues) + 2;
    const yMin = Math.min(goalWeight, ...kgValues) - 2;

    return {
      data: pts,
      yMin,
      yMax,
      xMin: startTs,
      xMax: goalTs,
      todayTs,
      todayKg,
    };
  }, [sorted, goalDate, goalWeight, startWeight, today, showProjection]);

  if (sorted.length === 0) {
    return (
      <div className="empty" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No trend yet</div>
        <div className="px-meta-sm">
          Log your first weight to start the chart. That entry becomes your baseline.
        </div>
      </div>
    );
  }

  const monthTickFormatter = (ts: number) => {
    const d = new Date(ts);
    const label = d.toLocaleDateString('en-AU', { month: 'short' });
    return d.getMonth() === 0 ? `${label} '${String(d.getFullYear()).slice(2)}` : label;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 16, right: 24, bottom: 8, left: 8 }}
        >
          <defs>
            <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--pulse-ink)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--pulse-ink)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projectionFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff385c" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#ff385c" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--pulse-hair)"
            vertical={false}
          />

          <XAxis
            dataKey="ts"
            type="number"
            scale="time"
            domain={[xMin, xMax]}
            tickFormatter={monthTickFormatter}
            stroke="var(--pulse-muted)"
            tick={{ fill: 'var(--pulse-muted)', fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: 'var(--pulse-hair)' }}
            tickLine={{ stroke: 'var(--pulse-hair)' }}
            minTickGap={40}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={(v: number) => `${v.toFixed(0)}`}
            stroke="var(--pulse-muted)"
            tick={{ fill: 'var(--pulse-muted)', fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />

          <Tooltip
            content={<TrendTooltip />}
            cursor={{ stroke: 'var(--pulse-hair-strong)', strokeDasharray: '4 4' }}
          />

          {/* Goal reference line */}
          <ReferenceLine
            y={goalWeight}
            stroke="#16a34a"
            strokeDasharray="4 4"
            strokeWidth={1.25}
            label={{
              value: `GOAL ${goalWeight}kg`,
              position: 'insideTopRight',
              fill: '#16a34a',
              fontSize: 10,
              fontWeight: 700,
            }}
            ifOverflow="extendDomain"
          />

          {/* Today vertical marker */}
          <ReferenceLine
            x={todayTs}
            stroke="#ff385c"
            strokeWidth={1}
            opacity={0.35}
          />

          {/* Projection line + faint fill */}
          {showProjection && (
            <Area
              type="monotone"
              dataKey="projection"
              stroke="#ff385c"
              strokeWidth={1.75}
              strokeDasharray="5 4"
              fill="url(#projectionFill)"
              connectNulls
              dot={false}
              activeDot={false}
              isAnimationActive
              animationDuration={600}
            />
          )}

          {/* Actual weight line with gradient area fill */}
          <Area
            type="monotone"
            dataKey="kg"
            stroke="var(--pulse-ink)"
            strokeWidth={2.25}
            fill="url(#weightFill)"
            connectNulls
            dot={{ r: 3, fill: 'var(--pulse-ink)', strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: '#ff385c',
              stroke: 'var(--sa-bg)',
              strokeWidth: 2,
            }}
            isAnimationActive
            animationDuration={600}
          />

          {/* Today dot on top */}
          <ReferenceDot
            x={todayTs}
            y={todayKg}
            r={5}
            fill="#ff385c"
            stroke="var(--sa-bg)"
            strokeWidth={2}
            ifOverflow="discard"
          />

          {/* Goal dot at right edge */}
          {showProjection && (
            <ReferenceDot
              x={xMax}
              y={goalWeight}
              r={4}
              fill="#ff385c"
              stroke="none"
              ifOverflow="discard"
            />
          )}

          {/* Hide the extra projection line's built-in area stroke by using Line on top */}
          <Line
            type="monotone"
            dataKey="kg"
            stroke="transparent"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PointPayload {
  ts: number;
  kg?: number;
  projection?: number;
  date: string;
}

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: PointPayload }>;
}

function TrendTooltip({ active, payload }: TrendTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const raw = payload[0]?.payload;
  if (!raw) return null;

  const kg = raw.kg;
  const projection = raw.projection;
  const date = raw.date;

  return (
    <div
      style={{
        background: 'var(--sa-fg)',
        color: 'var(--sa-bg)',
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
        pointerEvents: 'none',
      }}
    >
      {kg != null ? (
        <>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}>
            {kg.toFixed(1)} kg
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, marginTop: 2 }}>
            {fmtDateShort(date)}
          </div>
        </>
      ) : projection != null ? (
        <>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px', color: '#ff8ba1' }}>
            {projection.toFixed(1)} kg
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, marginTop: 2 }}>
            Projected · {fmtDateShort(date)}
          </div>
        </>
      ) : null}
    </div>
  );
}
