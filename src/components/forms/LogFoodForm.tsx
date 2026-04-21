import { useState } from 'react';
import { useStore } from '../../lib/store';
import { todayISO, nowTimeHHMM } from '../../lib/dates';
import type { MealKind } from '../../lib/types';

interface Props {
  initialMeal?: MealKind;
  onDone: () => void;
}

const MEALS: MealKind[] = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

export function LogFoodForm({ initialMeal, onDone }: Props) {
  const addFood = useStore((s) => s.addFood);
  const [meal, setMeal] = useState<MealKind>(initialMeal ?? 'Snack');
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [p, setP] = useState('');
  const [c, setC] = useState('');
  const [f, setF] = useState('');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(nowTimeHHMM());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !kcal) return;
    addFood({
      date,
      meal,
      time,
      name: name.trim(),
      kcal: Math.max(0, Number(kcal) || 0),
      p: Math.max(0, Number(p) || 0),
      c: Math.max(0, Number(c) || 0),
      f: Math.max(0, Number(f) || 0),
    });
    onDone();
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label className="form-label">Meal</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {MEALS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMeal(m)}
              className={`px-pill ${meal === m ? 'is-sel' : ''}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">What did you eat?</label>
        <input
          className="px-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grilled chicken bowl"
          autoFocus
          required
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
        <div className="form-row">
          <label className="form-label">Protein (g)</label>
          <input
            className="px-input"
            type="number"
            inputMode="numeric"
            min="0"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Carbs (g)</label>
          <input
            className="px-input"
            type="number"
            inputMode="numeric"
            min="0"
            value={c}
            onChange={(e) => setC(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Fat (g)</label>
          <input
            className="px-input"
            type="number"
            inputMode="numeric"
            min="0"
            value={f}
            onChange={(e) => setF(e.target.value)}
          />
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
        <div className="form-row">
          <label className="form-label">Time</label>
          <input
            className="px-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="px-btn is-secondary" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="px-btn is-primary">
          Add food
        </button>
      </div>
    </form>
  );
}
