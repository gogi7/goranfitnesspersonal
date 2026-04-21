import { useState } from 'react';
import { useStore } from '../../lib/store';
import { todayISO } from '../../lib/dates';
import type { Impact } from '../../lib/types';

interface Props {
  onDone: () => void;
}

const SUGGESTIONS: Array<{ label: string; impact: Impact; kcalPerMin: number }> = [
  { label: 'Walk', impact: 'low', kcalPerMin: 4.5 },
  { label: 'Tennis · singles', impact: 'med', kcalPerMin: 8.5 },
  { label: 'Swim · freestyle', impact: 'low', kcalPerMin: 9.5 },
  { label: 'Stationary bike', impact: 'low', kcalPerMin: 9 },
  { label: 'Elliptical', impact: 'low', kcalPerMin: 7.5 },
  { label: 'Rowing', impact: 'low', kcalPerMin: 9 },
  { label: 'Stretch / yoga', impact: 'low', kcalPerMin: 3 },
];

export function LogWorkoutForm({ onDone }: Props) {
  const addExercise = useStore((s) => s.addExercise);
  const [type, setType] = useState('Walk');
  const [impact, setImpact] = useState<Impact>('low');
  const [minutes, setMinutes] = useState('30');
  const [kcal, setKcal] = useState('135');
  const [date, setDate] = useState(todayISO());

  const pickSuggestion = (s: (typeof SUGGESTIONS)[number]) => {
    setType(s.label);
    setImpact(s.impact);
    const m = Number(minutes) || 30;
    setKcal(String(Math.round(m * s.kcalPerMin)));
  };

  const onMinutesChange = (v: string) => {
    setMinutes(v);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = Math.max(1, Number(minutes) || 0);
    const k = Math.max(0, Number(kcal) || 0);
    if (!type.trim()) return;
    addExercise({
      date,
      type: type.trim(),
      minutes: m,
      kcal: k,
      impact,
    });
    onDone();
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label className="form-label">Quick pick</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => pickSuggestion(s)}
              className={`px-pill ${type === s.label ? 'is-sel' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Type</label>
        <input
          className="px-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="form-row">
          <label className="form-label">Minutes</label>
          <input
            className="px-input"
            type="number"
            inputMode="numeric"
            min="1"
            value={minutes}
            onChange={(e) => onMinutesChange(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label className="form-label">kcal</label>
          <input
            className="px-input"
            type="number"
            inputMode="numeric"
            min="0"
            value={kcal}
            onChange={(e) => setKcal(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Impact</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['low', 'med', 'high'] as Impact[]).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setImpact(i)}
              className={`px-pill ${impact === i ? 'is-sel' : ''}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Date</label>
        <input
          className="px-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="px-btn is-secondary" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="px-btn is-primary">
          Log workout
        </button>
      </div>
    </form>
  );
}
