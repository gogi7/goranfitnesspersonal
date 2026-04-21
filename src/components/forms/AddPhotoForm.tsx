import { useState } from 'react';
import { useStore } from '../../lib/store';
import { savePhoto } from '../../lib/photoStore';
import { todayISO } from '../../lib/dates';

interface Props {
  onDone: () => void;
}

const MAX_DIMENSION = 1600;

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
      'image/jpeg',
      0.88
    )
  );
}

export function AddPhotoForm({ onDone }: Props) {
  const addPhotoMeta = useStore((s) => s.addPhotoMeta);
  const weightLog = useStore((s) => s.weightLog);
  const latestKg = weightLog.length ? weightLog[weightLog.length - 1].kg : 0;
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState<string>(latestKg ? String(latestKg) : '');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErr('Pick a photo first.');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const blob = await compressImage(file);
      const id = addPhotoMeta({
        date,
        weightKg: Number(weight) || 0,
        label: label.trim() || undefined,
      });
      await savePhoto(id, blob);
      onDone();
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label className="form-label">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
        <div className="px-meta-sm" style={{ fontSize: 11, marginTop: 4 }}>
          Stored only on this device. Never uploaded.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="form-row">
          <label className="form-label">Date</label>
          <input
            className="px-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayISO()}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Weight (kg)</label>
          <input
            className="px-input"
            type="number"
            step="0.1"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Label (optional)</label>
        <input
          className="px-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Week 3"
        />
      </div>
      {err && (
        <div className="px-meta-sm" style={{ color: '#be123c', marginBottom: 10 }}>
          {err}
        </div>
      )}
      <div className="form-actions">
        <button type="button" className="px-btn is-secondary" onClick={onDone} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="px-btn is-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save photo'}
        </button>
      </div>
    </form>
  );
}
