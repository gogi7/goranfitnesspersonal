import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { fmtDate, fmtDateShort } from '../lib/health';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { LogWorkoutForm } from '../components/forms/LogWorkoutForm';
import type { Impact } from '../lib/types';

type Filter = 'all' | Impact;

const IMPACT_COLOR: Record<Impact, string> = {
  low: '#16a34a',
  med: '#f59e0b',
  high: '#ff385c',
};

export function Exercise() {
  const log = useStore((s) => s.exerciseLog);
  const deleteExercise = useStore((s) => s.deleteExercise);
  const user = useStore((s) => s.user);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? log : log.filter((e) => e.impact === filter)),
    [log, filter]
  );

  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  }, []);

  const thisWeek = log.filter((e) => e.date >= weekAgo);
  const totalKcal = thisWeek.reduce((s, e) => s + e.kcal, 0);
  const totalMin = thisWeek.reduce((s, e) => s + e.minutes, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Exercise</h1>
          <div className="page-sub">Low-impact favoured · tennis 1×/wk</div>
        </div>
        <button className="px-btn is-primary" onClick={() => setModal(true)}>
          <Icon.plus size={16} /> Log activity
        </button>
      </div>

      <div className="stack-lg">
        <div className="px-card" style={{ padding: 20 }}>
          <div className="px-caption">This week</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 10,
            }}
          >
            <div>
              <div
                className="px-num"
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.6px' }}
              >
                {totalKcal}
              </div>
              <div className="px-meta-sm">kcal burned</div>
            </div>
            <div>
              <div
                className="px-num"
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.6px' }}
              >
                {Math.floor(totalMin / 60)}h {totalMin % 60}m
              </div>
              <div className="px-meta-sm">moving time</div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              background: '#e7f5ec',
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: 12,
              color: '#0f5132',
              fontWeight: 600,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Icon.check size={14} /> {user.conditions.join(' · ')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'low', 'med', 'high'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`px-pill ${filter === f ? 'is-sel' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        <div className="px-card" style={{ padding: 16 }}>
          <div className="px-title-sm" style={{ marginBottom: 10 }}>
            Activity log
          </div>
          {filtered.length === 0 ? (
            <div className="empty">
              No {filter === 'all' ? '' : `${filter}-impact `}activity yet.
              <div>
                <button className="px-btn is-primary" onClick={() => setModal(true)}>
                  <Icon.plus size={16} /> Log activity
                </button>
              </div>
            </div>
          ) : (
            filtered.map((e, i) => (
              <div
                key={e.id}
                style={{
                  padding: '14px 0',
                  borderTop: i === 0 ? 'none' : '1px solid #ebebeb',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(180deg,#d3f2ee,#a8e0d5)',
                    color: '#0f766e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon.run size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>
                    {e.type}
                  </div>
                  <div className="px-meta-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {fmtDateShort(e.date)} · {e.minutes} min
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: IMPACT_COLOR[e.impact],
                      }}
                    />
                    {e.impact}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    className="px-num"
                    style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}
                  >
                    {e.kcal}
                  </div>
                  <div className="px-meta-sm" style={{ fontSize: 10 }}>
                    kcal
                  </div>
                </div>
                <button
                  className="px-btn is-ghost is-sm"
                  onClick={() => {
                    if (confirm(`Remove ${e.type} on ${fmtDate(e.date)}?`)) deleteExercise(e.id);
                  }}
                  aria-label="Remove"
                  style={{ padding: '6px 8px' }}
                >
                  <Icon.trash size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal open={modal} title="Log workout" onClose={() => setModal(false)}>
        <LogWorkoutForm onDone={() => setModal(false)} />
      </Modal>
    </>
  );
}
