import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { fmtDateShort } from '../lib/health';
import { PhotoTile } from '../components/PhotoTile';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { AddPhotoForm } from '../components/forms/AddPhotoForm';
import { deletePhoto } from '../lib/photoStore';

type View = 'grid' | 'compare' | 'slider';

export function Photos() {
  const photos = useStore((s) => s.photos);
  const deletePhotoMeta = useStore((s) => s.deletePhotoMeta);
  const [view, setView] = useState<View>('grid');
  const [modal, setModal] = useState(false);
  const sorted = useMemo(
    () => [...photos].sort((a, b) => a.date.localeCompare(b.date)),
    [photos]
  );

  const [beforeId, setBeforeId] = useState<string | null>(null);
  const [afterId, setAfterId] = useState<string | null>(null);

  const resolvedBefore = beforeId ?? sorted[0]?.id ?? null;
  const resolvedAfter = afterId ?? sorted[sorted.length - 1]?.id ?? null;

  const before = sorted.find((p) => p.id === resolvedBefore);
  const after = sorted.find((p) => p.id === resolvedAfter);

  const removePhoto = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    deletePhotoMeta(id);
    await deletePhoto(id);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Progress photos</h1>
          <div className="page-sub">
            Private · stored only on this device · {sorted.length}{' '}
            {sorted.length === 1 ? 'photo' : 'photos'}
          </div>
        </div>
        <button className="px-btn is-primary" onClick={() => setModal(true)}>
          <Icon.camera size={16} /> Add photo
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['grid', 'compare', 'slider'] as View[]).map((v) => (
          <button
            key={v}
            className={`px-pill ${view === v ? 'is-sel' : ''}`}
            onClick={() => setView(v)}
          >
            {v === 'grid' ? 'Grid' : v === 'compare' ? 'Compare' : 'Slider'}
          </button>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="px-card" style={{ padding: 24 }}>
          <div className="empty">
            No photos yet.
            <div>
              <button className="px-btn is-primary" onClick={() => setModal(true)}>
                <Icon.camera size={16} /> Add your first
              </button>
            </div>
          </div>
        </div>
      )}

      {sorted.length > 0 && view === 'grid' && (
        <div className="px-card" style={{ padding: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 10,
            }}
          >
            {sorted.map((p) => (
              <div key={p.id} style={{ position: 'relative' }}>
                <PhotoTile id={p.id} date={p.date} weightKg={p.weightKg} label={p.label} />
                <button
                  className="px-btn is-ghost is-sm"
                  onClick={() => removePhoto(p.id)}
                  aria-label="Delete"
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: 'rgba(255,255,255,0.9)',
                    padding: '4px 6px',
                  }}
                >
                  <Icon.trash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {sorted.length > 0 && view === 'compare' && before && after && (
        <div className="px-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <PhotoPicker
              photos={sorted}
              selected={resolvedBefore}
              onChange={setBeforeId}
              label="Before"
            />
            <PhotoPicker
              photos={sorted}
              selected={resolvedAfter}
              onChange={setAfterId}
              label="After"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhotoTile
              id={before.id}
              date={before.date}
              weightKg={before.weightKg}
              label={before.label ?? fmtDateShort(before.date)}
            />
            <PhotoTile
              id={after.id}
              date={after.date}
              weightKg={after.weightKg}
              label={after.label ?? fmtDateShort(after.date)}
              current
            />
          </div>
          <div className="px-meta-sm" style={{ marginTop: 12, textAlign: 'center' }}>
            {(before.weightKg - after.weightKg > 0 ? '−' : '+') +
              Math.abs(before.weightKg - after.weightKg).toFixed(1)}{' '}
            kg between these
          </div>
        </div>
      )}

      {sorted.length > 0 && view === 'slider' && before && after && (
        <div className="px-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <PhotoPicker
              photos={sorted}
              selected={resolvedBefore}
              onChange={setBeforeId}
              label="Before"
            />
            <PhotoPicker
              photos={sorted}
              selected={resolvedAfter}
              onChange={setAfterId}
              label="After"
            />
          </div>
          <BeforeAfterSlider
            beforeId={before.id}
            afterId={after.id}
            beforeLabel={`${fmtDateShort(before.date)} · ${before.weightKg.toFixed(1)}kg`}
            afterLabel={`${fmtDateShort(after.date)} · ${after.weightKg.toFixed(1)}kg`}
          />
          <div className="px-meta-sm" style={{ marginTop: 8, textAlign: 'center' }}>
            Drag the handle to wipe between photos.
          </div>
        </div>
      )}

      <Modal open={modal} title="Add progress photo" onClose={() => setModal(false)}>
        <AddPhotoForm onDone={() => setModal(false)} />
      </Modal>
    </>
  );
}

interface PickerProps {
  photos: Array<{ id: string; date: string; weightKg: number }>;
  selected: string | null;
  onChange: (id: string) => void;
  label: string;
}

function PhotoPicker({ photos, selected, onChange, label }: PickerProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span className="form-label">{label}</span>
      <select
        className="px-input"
        value={selected ?? ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ minWidth: 180 }}
      >
        {photos.map((p) => (
          <option key={p.id} value={p.id}>
            {fmtDateShort(p.date)} · {p.weightKg.toFixed(1)} kg
          </option>
        ))}
      </select>
    </label>
  );
}
