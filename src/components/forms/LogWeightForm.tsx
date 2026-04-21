import { useState } from 'react';
import { useStore } from '../../lib/store';
import { todayISO } from '../../lib/dates';

interface Props {
  initialDate?: string;
  initialKg?: number;
  onDone: () => void;
}

export function LogWeightForm({ initialDate, initialKg, onDone }: Props) {
  const logWeight = useStore((s) => s.logWeight);
  const [date, setDate] = useState(initialDate ?? todayISO());
  const [kg, setKg] = useState<string>(initialKg?.toString() ?? '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(kg);
    if (!Number.isFinite(n) || n <= 0 || n > 500) return;
    logWeight(+n.toFixed(2), date);
    onDone();
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label className="form-label">Weight (kg)</label>
        <input
          className="px-input"
          type="number"
          step="0.1"
          min="20"
          max="500"
          inputMode="decimal"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          placeholder="e.g. 107.0"
          autoFocus
          required
        />
      </div>
      <div className="form-row">
        <label className="form-label">Date</label>
        <input
          className="px-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayISO()}
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" className="px-btn is-secondary" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="px-btn is-primary">
          Save
        </button>
      </div>
    </form>
  );
}
