import { useEffect, useRef, useState } from 'react';
import { getPhoto } from '../lib/photoStore';

interface Props {
  beforeId: string;
  afterId: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({ beforeId, afterId, beforeLabel, afterLabel }: Props) {
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [pct, setPct] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    let a: string | null = null;
    let b: string | null = null;
    let cancelled = false;
    (async () => {
      const [bBlob, aBlob] = await Promise.all([getPhoto(beforeId), getPhoto(afterId)]);
      if (cancelled) return;
      if (bBlob) {
        b = URL.createObjectURL(bBlob);
        setBeforeUrl(b);
      }
      if (aBlob) {
        a = URL.createObjectURL(aBlob);
        setAfterUrl(a);
      }
    })();
    return () => {
      cancelled = true;
      if (a) URL.revokeObjectURL(a);
      if (b) URL.revokeObjectURL(b);
    };
  }, [beforeId, afterId]);

  const updateFromEvent = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, next)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromEvent(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromEvent(e.clientX);
  };
  const handlePointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={wrapRef}
      className="ba-slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {beforeUrl && <img src={beforeUrl} alt={beforeLabel ?? 'Before'} />}
      <div className="after-wrap" style={{ width: `${pct}%` }}>
        {afterUrl && <img src={afterUrl} alt={afterLabel ?? 'After'} />}
      </div>
      <div className="ba-handle" style={{ left: `${pct}%` }} />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 12,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          zIndex: 3,
        }}
      >
        {afterLabel ?? 'After'}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 12,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          zIndex: 3,
        }}
      >
        {beforeLabel ?? 'Before'}
      </div>
    </div>
  );
}
