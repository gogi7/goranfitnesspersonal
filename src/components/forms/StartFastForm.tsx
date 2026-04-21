import { useState } from 'react';
import { useStore } from '../../lib/store';
import { nowISO } from '../../lib/dates';
import type { FastingPlan } from '../../lib/types';

interface Props {
  onDone: () => void;
}

const PLANS: Array<{ plan: FastingPlan; hours: number }> = [
  { plan: '14:10', hours: 14 },
  { plan: '16:8', hours: 16 },
  { plan: '18:6', hours: 18 },
  { plan: 'OMAD', hours: 23 },
];

export function StartFastForm({ onDone }: Props) {
  const startFast = useStore((s) => s.startFast);
  const defaults = useStore((s) => s.prefs);
  const [plan, setPlan] = useState<FastingPlan>(defaults.fastingPlanDefault);
  const [hours, setHours] = useState(defaults.fastingGoalDefaultHours);
  const [startedAt, setStartedAt] = useState(nowISO());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startFast(plan, hours, startedAt);
    onDone();
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label className="form-label">Plan</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PLANS.map((p) => (
            <button
              key={p.plan}
              type="button"
              onClick={() => {
                setPlan(p.plan);
                setHours(p.hours);
              }}
              className={`px-pill ${plan === p.plan ? 'is-sel' : ''}`}
            >
              {p.plan}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlan('custom')}
            className={`px-pill ${plan === 'custom' ? 'is-sel' : ''}`}
          >
            custom
          </button>
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Goal (hours)</label>
        <input
          className="px-input"
          type="number"
          inputMode="numeric"
          min="1"
          max="48"
          value={hours}
          onChange={(e) => setHours(Math.max(1, Math.min(48, Number(e.target.value) || 1)))}
          required
        />
      </div>
      <div className="form-row">
        <label className="form-label">Started at</label>
        <input
          className="px-input"
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" className="px-btn is-secondary" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="px-btn is-primary">
          Start fast
        </button>
      </div>
    </form>
  );
}
