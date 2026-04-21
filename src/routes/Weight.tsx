import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import {
  currentWeight,
  fmtDate,
  fmtDateShort,
  projectTimeline,
  sortedWeightLog,
} from '../lib/health';
import { todayISO } from '../lib/dates';
import { WeightTrendChart } from '../components/WeightTrendChart';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { LogWeightForm } from '../components/forms/LogWeightForm';

export function Weight() {
  const user = useStore((s) => s.user);
  const weightLog = useStore((s) => s.weightLog);
  const prefs = useStore((s) => s.prefs);
  const deleteWeight = useStore((s) => s.deleteWeight);
  const [modal, setModal] = useState(false);

  const sorted = useMemo(() => sortedWeightLog(weightLog), [weightLog]);
  const kg = currentWeight(sorted, user.startWeight);
  const lost = Math.max(0, +(user.startWeight - kg).toFixed(1));
  const { end, weeksRemaining } = projectTimeline({
    startWeight: user.startWeight,
    goalWeight: user.goalWeight,
    kgPerWeek: prefs.paceKgPerWeek,
    startDate: user.startDate,
    currentWeight: kg,
  });

  const reversed = [...sorted].reverse();

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Weight</h1>
          <div className="page-sub">
            {kg.toFixed(1)} kg · −{lost} kg since start ·{' '}
            {user.startWeight > user.goalWeight
              ? Math.round(((user.startWeight - kg) / (user.startWeight - user.goalWeight)) * 100)
              : 0}
            % of the way to {user.goalWeight} kg
          </div>
        </div>
        <button className="px-btn is-primary" onClick={() => setModal(true)}>
          <Icon.plus size={16} /> Log weight
        </button>
      </div>

      <div className="stack-lg">
        <div className="px-card" style={{ padding: 20 }}>
          <div className="px-caption">Today · {fmtDateShort(todayISO())}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span
              className="px-num"
              style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 1 }}
            >
              {kg.toFixed(1)}
            </span>
            <span style={{ fontSize: 18, color: '#6a6a6a', fontWeight: 600 }}>kg</span>
          </div>
          <div className="px-meta-sm" style={{ marginTop: 8 }}>
            Projected {user.goalWeight} kg by <b style={{ color: '#222' }}>{fmtDate(end)}</b> ·{' '}
            {weeksRemaining} weeks at {prefs.paceKgPerWeek.toFixed(2)} kg/wk
          </div>
        </div>

        <div className="px-card" style={{ padding: 16 }}>
          <div className="px-title-sm" style={{ marginBottom: 8 }}>
            Trend → Goal
          </div>
          <WeightTrendChart
            log={sorted}
            startWeight={user.startWeight}
            goalWeight={user.goalWeight}
            goalDate={end}
            today={todayISO()}
            width={1100}
            height={280}
          />
        </div>

        <div className="px-card" style={{ padding: 16 }}>
          <div className="px-title-sm" style={{ marginBottom: 10 }}>
            Entries
          </div>
          {reversed.length === 0 ? (
            <div className="empty">
              No weight logged yet.
              <div>
                <button className="px-btn is-primary" onClick={() => setModal(true)}>
                  <Icon.plus size={16} /> Log your first
                </button>
              </div>
            </div>
          ) : (
            reversed.map((row, i) => {
              const prev = reversed[i + 1];
              const delta = prev ? +(row.kg - prev.kg).toFixed(1) : 0;
              return (
                <div
                  key={row.date}
                  style={{
                    display: 'flex',
                    padding: '12px 0',
                    borderTop: i === 0 ? 'none' : '1px solid #ebebeb',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{fmtDate(row.date)}</div>
                    <div className="px-meta-sm">{relativeDay(row.date)}</div>
                  </div>
                  <div
                    className="px-num"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '-0.3px',
                      marginRight: 12,
                    }}
                  >
                    {row.kg.toFixed(1)} kg
                  </div>
                  {prev && (
                    <span
                      className={`px-badge ${
                        delta < 0 ? 'is-ok' : delta > 0 ? 'is-bad' : 'is-neutral'
                      }`}
                      style={{ minWidth: 60, justifyContent: 'center' }}
                    >
                      {delta < 0 ? '▼' : delta > 0 ? '▲' : '—'} {Math.abs(delta).toFixed(1)}
                    </span>
                  )}
                  <button
                    className="px-btn is-ghost is-sm"
                    onClick={() => {
                      if (confirm(`Delete ${fmtDateShort(row.date)} entry?`)) {
                        deleteWeight(row.date);
                      }
                    }}
                    aria-label="Delete"
                    style={{ padding: '6px 8px' }}
                  >
                    <Icon.trash size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Modal open={modal} title="Log weight" onClose={() => setModal(false)}>
        <LogWeightForm onDone={() => setModal(false)} />
      </Modal>
    </>
  );
}

function relativeDay(date: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 0) return `In ${-diff} days`;
  return `${diff} days ago`;
}
