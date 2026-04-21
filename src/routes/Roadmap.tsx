import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import {
  buildMilestones,
  currentWeight,
  fmtDate,
  fmtDateShort,
  KCAL_PER_KG,
  projectTimeline,
  type Milestone,
} from '../lib/health';
import { Icon } from '../components/Icon';
import type { Pace } from '../lib/types';

type Variant = 'timeline' | 'arc' | 'stack';

const PACES: Pace[] = [0.5, 0.75, 1.0];

export function Roadmap() {
  const user = useStore((s) => s.user);
  const weightLog = useStore((s) => s.weightLog);
  const prefs = useStore((s) => s.prefs);
  const setPace = useStore((s) => s.setPace);
  const [variant, setVariant] = useState<Variant>('timeline');

  const pace = prefs.paceKgPerWeek;
  const kg = currentWeight(weightLog, user.startWeight);
  const { end, weeksRemaining } = projectTimeline({
    startWeight: user.startWeight,
    goalWeight: user.goalWeight,
    kgPerWeek: pace,
    startDate: user.startDate,
    currentWeight: kg,
  });
  const ms = useMemo(
    () => buildMilestones(user.startWeight, user.goalWeight, pace, user.startDate),
    [user.startWeight, user.goalWeight, user.startDate, pace]
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Roadmap</h1>
          <div className="page-sub">Where you're headed if you stay on track</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="px-caption">Pace</span>
          {PACES.map((v) => (
            <button
              key={v}
              onClick={() => setPace(v)}
              className={`px-pill ${pace === v ? 'is-sel' : ''}`}
            >
              {v.toFixed(2)} kg/wk
            </button>
          ))}
        </div>
      </div>

      <div
        className="px-card"
        style={{
          padding: 24,
          marginBottom: 20,
          background: 'linear-gradient(135deg,#fff,#fff0f3)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
          }}
        >
          <div>
            <div className="px-caption">Arrival at goal</div>
            <div
              className="px-num"
              style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: '-1px',
                color: '#ff385c',
                marginTop: 4,
              }}
            >
              {fmtDate(end)}
            </div>
            <div className="px-meta" style={{ marginTop: 4 }}>
              {weeksRemaining} weeks from today
            </div>
          </div>
          <div>
            <div className="px-caption">Weight to lose</div>
            <div
              className="px-num"
              style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginTop: 4 }}
            >
              {Math.max(0, +(kg - user.goalWeight).toFixed(1))} kg
            </div>
            <div className="px-meta" style={{ marginTop: 4 }}>
              {kg.toFixed(1)} → {user.goalWeight} kg
            </div>
          </div>
          <div>
            <div className="px-caption">Daily deficit needed</div>
            <div
              className="px-num"
              style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginTop: 4 }}
            >
              ~{Math.round((pace * KCAL_PER_KG) / 7)}
            </div>
            <div className="px-meta" style={{ marginTop: 4 }}>
              kcal below TDEE
            </div>
          </div>
        </div>
        {pace >= 1.0 && (
          <div
            style={{
              marginTop: 16,
              background: '#fff',
              border: '1px solid #ebebeb',
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: 12,
              color: '#6a6a6a',
              fontWeight: 500,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Icon.info size={14} /> Not medical advice. 0.5–1.0 kg/wk is the medically-safe
            range. Consult a clinician before an aggressive deficit.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['timeline', 'arc', 'stack'] as Variant[]).map((v) => (
          <button
            key={v}
            className={`px-pill ${variant === v ? 'is-sel' : ''}`}
            onClick={() => setVariant(v)}
          >
            {v === 'timeline' ? 'Timeline' : v === 'arc' ? 'Trajectory' : 'Cards'}
          </button>
        ))}
      </div>

      {variant === 'timeline' && <RoadmapTimeline ms={ms} kg={kg} user={user} />}
      {variant === 'arc' && <RoadmapArc ms={ms} kg={kg} user={user} />}
      {variant === 'stack' && <RoadmapStack ms={ms} kg={kg} user={user} />}
    </>
  );
}

interface VariantProps {
  ms: Milestone[];
  kg: number;
  user: {
    startWeight: number;
    startDate: string;
    goalWeight: number;
  };
}

function RoadmapTimeline({ ms, kg, user }: VariantProps) {
  const stops = [
    { d: fmtDate(user.startDate), w: user.startWeight, label: 'Baseline', done: true, current: false },
    { d: fmtDate(new Date()), w: kg, label: 'Today', done: false, current: true },
    ...ms.map((m) => ({
      d: fmtDate(m.date),
      w: m.weightKg,
      label: m.label,
      done: false,
      current: false,
    })),
  ];
  return (
    <div className="px-card" style={{ padding: 24 }}>
      <div className="px-title-sm" style={{ marginBottom: 8 }}>
        Milestones — linear
      </div>
      <div className="px-meta" style={{ marginBottom: 16 }}>
        Dots along a straight path from start to goal.
      </div>
      <div style={{ position: 'relative', padding: '16px 0 24px', overflowX: 'auto' }}>
        <div
          style={{
            position: 'absolute',
            left: '4%',
            right: '4%',
            top: '50%',
            height: 2,
            background: '#ebebeb',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            gap: 8,
            minWidth: 600,
          }}
        >
          {stops.map((n, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
              <div
                className="px-num"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.3px',
                  color: n.current ? '#ff385c' : '#222',
                  marginBottom: 12,
                }}
              >
                {n.w.toFixed(1)} kg
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: n.current ? '#ff385c' : n.done ? '#222' : '#fff',
                    border: n.done || n.current ? 'none' : '2px solid #dddddd',
                    boxShadow: n.current
                      ? '0 0 0 4px #fff, 0 0 0 6px #ff385c'
                      : '0 0 0 4px #fff',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: n.current ? '#ff385c' : '#222',
                }}
              >
                {n.d}
              </div>
              <div className="px-meta-sm" style={{ fontSize: 10, marginTop: 4, lineHeight: 1.4 }}>
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapArc({ ms, kg, user }: VariantProps) {
  const stops = [
    { w: user.startWeight, d: fmtDateShort(user.startDate), l: 'Start', done: true, current: false },
    { w: kg, d: 'Today', l: 'Today', done: false, current: true },
    ...ms.map((m) => ({
      w: m.weightKg,
      d: fmtDateShort(m.date),
      l: m.label,
      done: false,
      current: false,
    })),
  ];
  const W = 1100;
  const H = 320;
  const padL = 60;
  const padR = 60;
  const padT = 60;
  const padB = 80;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  return (
    <div className="px-card" style={{ padding: 24 }}>
      <div className="px-title-sm" style={{ marginBottom: 8 }}>
        Trajectory arc
      </div>
      <div className="px-meta" style={{ marginBottom: 16 }}>
        A curve through each milestone, falling toward goal.
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
        <path
          d={`M ${padL} ${padT} Q ${padL + plotW * 0.3} ${padT} ${padL + plotW * 0.5} ${padT + plotH * 0.5} T ${padL + plotW} ${padT + plotH}`}
          stroke="#ff385c"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {stops.map((s, i) => {
          const x = padL + (plotW * i) / (stops.length - 1);
          const y = padT + (plotH * i) / (stops.length - 1);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={s.current ? 10 : 7}
                fill={s.current ? '#ff385c' : s.done ? '#222' : '#fff'}
                stroke={s.done || s.current ? 'none' : '#dddddd'}
                strokeWidth="2"
              />
              {s.current && (
                <circle cx={x} cy={y} r="14" fill="none" stroke="#ff385c" strokeWidth="2" opacity="0.3" />
              )}
              <text
                x={x}
                y={y - 22}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill={s.current ? '#ff385c' : '#222'}
              >
                {s.w.toFixed(1)} kg
              </text>
              <text x={x} y={y + 28} textAnchor="middle" fontSize="11" fontWeight="700" fill="#222">
                {s.d}
              </text>
              <text x={x} y={y + 44} textAnchor="middle" fontSize="10" fill="#6a6a6a">
                {s.l.length > 24 ? s.l.slice(0, 22) + '…' : s.l}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RoadmapStack({ ms, kg, user }: VariantProps) {
  const all = [
    { w: user.startWeight, d: fmtDateShort(user.startDate), l: 'Baseline', done: true, current: false },
    { w: kg, d: 'Today', l: 'Where you are right now', done: false, current: true },
    ...ms.map((m) => ({ w: m.weightKg, d: fmtDateShort(m.date), l: m.label, done: false, current: false })),
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      {all.map((s, i) => (
        <div
          key={i}
          className="px-card lift"
          style={{
            padding: 20,
            border: s.current ? '2px solid #ff385c' : undefined,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div
              className="px-caption"
              style={{ color: s.current ? '#ff385c' : '#6a6a6a' }}
            >
              {s.current ? 'Now' : s.done ? 'Done' : `Milestone ${i - 1}`}
            </div>
            {s.done && <Icon.check size={14} />}
          </div>
          <div
            className="px-num"
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.8px',
              marginTop: 8,
              color: s.current ? '#ff385c' : '#222',
            }}
          >
            {s.w.toFixed(1)} kg
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{s.d}</div>
          <div className="px-meta-sm" style={{ marginTop: 8, lineHeight: 1.4 }}>
            {s.l}
          </div>
        </div>
      ))}
    </div>
  );
}
