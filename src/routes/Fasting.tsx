import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { fmtDate, fmtTime } from '../lib/health';
import { hoursBetween } from '../lib/dates';
import { ProgressRing } from '../components/ProgressRing';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { StartFastForm } from '../components/forms/StartFastForm';
import type { FastingPlan } from '../lib/types';

const PLANS: Array<{ plan: FastingPlan; hours: number }> = [
  { plan: '14:10', hours: 14 },
  { plan: '16:8', hours: 16 },
  { plan: '18:6', hours: 18 },
  { plan: 'OMAD', hours: 23 },
];

export function Fasting() {
  const fasting = useStore((s) => s.fasting);
  const endFast = useStore((s) => s.endFast);
  const setPlan = useStore((s) => s.setFastingPlan);
  const [modal, setModal] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!fasting.active) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [fasting.active]);

  const hrs =
    fasting.active && fasting.startedAt ? hoursBetween(fasting.startedAt, new Date()) : 0;
  const pct = fasting.goalHours > 0 ? Math.min(100, (hrs / fasting.goalHours) * 100) : 0;
  const endsAt =
    fasting.active && fasting.startedAt
      ? new Date(new Date(fasting.startedAt).getTime() + fasting.goalHours * 3600000)
      : null;

  const recent = fasting.history.slice(0, 7);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Fasting</h1>
          <div className="page-sub">
            {fasting.active
              ? `${fasting.plan} · ${Math.floor(hrs)}h elapsed of ${fasting.goalHours}h`
              : 'No active fast'}
          </div>
        </div>
        {!fasting.active && (
          <button className="px-btn is-primary" onClick={() => setModal(true)}>
            <Icon.plus size={16} /> Start fast
          </button>
        )}
      </div>

      <div className="stack-lg">
        <div className="px-card" style={{ padding: 24, textAlign: 'center' }}>
          <div className="px-caption" style={{ color: fasting.active ? '#6b21a8' : '#6a6a6a' }}>
            {fasting.active ? `Active · ${fasting.plan}` : 'Idle'}
          </div>
          <div style={{ margin: '20px auto 16px', display: 'flex', justifyContent: 'center' }}>
            <ProgressRing
              pct={pct}
              color={fasting.active ? '#6b21a8' : '#ebebeb'}
              size={220}
              thickness={14}
            >
              {fasting.active ? (
                <>
                  <div
                    className="px-num"
                    style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.8px' }}
                  >
                    {Math.floor(hrs)}:
                    {String(Math.floor((hrs % 1) * 60)).padStart(2, '0')}
                  </div>
                  <div className="px-caption" style={{ marginTop: 4 }}>
                    elapsed
                  </div>
                </>
              ) : (
                <div style={{ color: '#6a6a6a', fontWeight: 600, fontSize: 14 }}>
                  Ready when you are
                </div>
              )}
            </ProgressRing>
          </div>

          {fasting.active && fasting.startedAt && endsAt && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
                <div>
                  <div className="px-caption">Started</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                    {fmtTime(fasting.startedAt)}
                  </div>
                  <div className="px-meta-sm">{fmtDate(fasting.startedAt)}</div>
                </div>
                <div style={{ width: 1, background: '#ebebeb' }} />
                <div>
                  <div className="px-caption">Ends</div>
                  <div
                    style={{ fontSize: 14, fontWeight: 600, marginTop: 4, color: '#ff385c' }}
                  >
                    {fmtTime(endsAt)}
                  </div>
                  <div className="px-meta-sm">
                    {hrs < fasting.goalHours
                      ? `in ${Math.ceil(fasting.goalHours - hrs)}h`
                      : 'complete'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="px-btn is-primary" onClick={() => endFast()}>
                  End fast
                </button>
              </div>
            </>
          )}

          {!fasting.active && (
            <button className="px-btn is-primary" onClick={() => setModal(true)}>
              <Icon.plus size={16} /> Start new fast
            </button>
          )}
        </div>

        <div className="px-card" style={{ padding: 16 }}>
          <div className="px-title-sm" style={{ marginBottom: 10 }}>
            Plan
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PLANS.map((p) => (
              <button
                key={p.plan}
                onClick={() => setPlan(p.plan, p.hours)}
                className={`px-pill ${fasting.plan === p.plan ? 'is-sel' : ''}`}
                disabled={fasting.active}
              >
                {p.plan}
              </button>
            ))}
          </div>
          <div className="px-meta-sm" style={{ marginTop: 10 }}>
            {fasting.active
              ? "Current fast locks the plan until you end it."
              : 'Pick a plan, then start a fast. History won’t be affected.'}
          </div>
        </div>

        <div className="px-card" style={{ padding: 16 }}>
          <div className="px-title-sm" style={{ marginBottom: 10 }}>
            Recent fasts
          </div>
          {recent.length === 0 ? (
            <div className="empty">No fasts logged yet.</div>
          ) : (
            recent.map((h, i) => (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderTop: i === 0 ? 'none' : '1px solid #ebebeb',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {fmtDate(h.date)} · {h.plan}
                  </div>
                  <div className="px-meta-sm">
                    {fmtTime(h.startedAt)} → {fmtTime(h.endedAt)}
                  </div>
                </div>
                <div
                  className="px-num"
                  style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px' }}
                >
                  {h.hours.toFixed(1)}h
                </div>
                <span
                  className={`px-badge ${h.completed ? 'is-ok' : 'is-warn'}`}
                  style={{ minWidth: 70, justifyContent: 'center' }}
                >
                  {h.completed ? 'Complete' : 'Partial'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal open={modal} title="Start fast" onClose={() => setModal(false)}>
        <StartFastForm onDone={() => setModal(false)} />
      </Modal>
    </>
  );
}
