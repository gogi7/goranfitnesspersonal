import { useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { Icon } from '../components/Icon';

export function Settings() {
  const user = useStore((s) => s.user);
  const updateUser = useStore((s) => s.updateUser);
  const exportJSON = useStore((s) => s.exportJSON);
  const importJSON = useStore((s) => s.importJSON);
  const reset = useStore((s) => s.reset);

  const [draft, setDraft] = useState(user);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const download = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importJSON(text);
    if (!result.ok) {
      setErr(result.error ?? 'Import failed');
    } else {
      setErr(null);
      alert('Imported successfully. Photos are kept on the device they were added on.');
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  const onReset = () => {
    if (
      confirm(
        'Reset everything to seed data? This erases your logged weight, food, workouts, fasts, and photo references on this device.'
      )
    ) {
      reset();
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Profile, goals, and data backup</div>
        </div>
      </div>

      <div className="stack-lg">
        <form className="px-card" style={{ padding: 20 }} onSubmit={saveProfile}>
          <div className="px-title-sm" style={{ marginBottom: 14 }}>
            Profile
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <div className="form-row">
              <label className="form-label">Name</label>
              <input
                className="px-input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Age</label>
              <input
                className="px-input"
                type="number"
                min="10"
                max="120"
                value={draft.age}
                onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Sex</label>
              <select
                className="px-input"
                value={draft.sex}
                onChange={(e) => setDraft({ ...draft, sex: e.target.value as 'male' | 'female' })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Height (cm)</label>
              <input
                className="px-input"
                type="number"
                min="100"
                max="250"
                value={draft.heightCm}
                onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Start weight (kg)</label>
              <input
                className="px-input"
                type="number"
                step="0.1"
                value={draft.startWeight}
                onChange={(e) => setDraft({ ...draft, startWeight: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Start date</label>
              <input
                className="px-input"
                type="date"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Goal weight (kg)</label>
              <input
                className="px-input"
                type="number"
                step="0.1"
                value={draft.goalWeight}
                onChange={(e) => setDraft({ ...draft, goalWeight: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Activity factor</label>
              <select
                className="px-input"
                value={draft.activityFactor}
                onChange={(e) => setDraft({ ...draft, activityFactor: Number(e.target.value) })}
              >
                <option value="1.2">Sedentary (1.2)</option>
                <option value="1.375">Lightly active (1.375)</option>
                <option value="1.55">Moderately active (1.55)</option>
                <option value="1.725">Very active (1.725)</option>
              </select>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              marginTop: 8,
            }}
          >
            <div className="form-row">
              <label className="form-label">Protein target (g)</label>
              <input
                className="px-input"
                type="number"
                min="0"
                value={draft.proteinTargetG}
                onChange={(e) =>
                  setDraft({ ...draft, proteinTargetG: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-row">
              <label className="form-label">Carb target (g)</label>
              <input
                className="px-input"
                type="number"
                min="0"
                value={draft.carbTargetG}
                onChange={(e) => setDraft({ ...draft, carbTargetG: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Fat target (g)</label>
              <input
                className="px-input"
                type="number"
                min="0"
                value={draft.fatTargetG}
                onChange={(e) => setDraft({ ...draft, fatTargetG: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: 10 }}>
            <div style={{ flex: 1 }}>
              {saved && (
                <span className="px-badge is-ok">
                  <Icon.check size={12} /> Saved
                </span>
              )}
            </div>
            <button type="submit" className="px-btn is-primary">
              Save profile
            </button>
          </div>
        </form>

        <div className="px-card" style={{ padding: 20 }}>
          <div className="px-title-sm" style={{ marginBottom: 8 }}>
            Backup
          </div>
          <div className="px-meta" style={{ marginBottom: 14 }}>
            Your data lives in this browser. Export a JSON backup to move it between devices
            or keep it safe. Photos stay on the device they were added on.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="px-btn is-secondary" onClick={download}>
              <Icon.download size={16} /> Export backup
            </button>
            <label className="px-btn is-secondary" style={{ cursor: 'pointer' }}>
              <Icon.upload size={16} /> Import backup
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {err && (
            <div className="px-meta-sm" style={{ color: '#be123c', marginTop: 8 }}>
              {err}
            </div>
          )}
        </div>

        <div className="px-card" style={{ padding: 20 }}>
          <div className="px-title-sm" style={{ marginBottom: 8 }}>
            Danger zone
          </div>
          <div className="px-meta" style={{ marginBottom: 14 }}>
            Reset all tracked data to Goran's seed values.
          </div>
          <button
            className="px-btn is-secondary"
            style={{ borderColor: '#ff385c', color: '#ff385c' }}
            onClick={onReset}
          >
            <Icon.trash size={16} /> Reset to seed
          </button>
        </div>
      </div>
    </>
  );
}
