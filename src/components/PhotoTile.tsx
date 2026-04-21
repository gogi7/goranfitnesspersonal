import { useEffect, useState } from 'react';
import { getPhoto } from '../lib/photoStore';
import { fmtDateShort } from '../lib/health';

interface Props {
  id?: string;
  date?: string;
  weightKg?: number;
  label?: string;
  current?: boolean;
  small?: boolean;
  onClick?: () => void;
}

export function PhotoTile({ id, date, weightKg, label, current, small, onClick }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let revokedUrl: string | null = null;
    let cancelled = false;
    (async () => {
      const blob = await getPhoto(id);
      if (cancelled || !blob) return;
      const u = URL.createObjectURL(blob);
      revokedUrl = u;
      setUrl(u);
    })();
    return () => {
      cancelled = true;
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [id]);

  const displayLabel = label ?? (date ? fmtDateShort(date) : '');
  const weightLabel = weightKg != null ? `${weightKg.toFixed(1)} kg` : '';

  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: '3 / 4',
        borderRadius: small ? 10 : 14,
        background: url
          ? '#000'
          : 'linear-gradient(165deg, #f0efe9, #e3e0d6)',
        position: 'relative',
        overflow: 'hidden',
        border: current ? '2px solid #ff385c' : '1px solid #ebebeb',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {url ? (
        <img
          src={url}
          alt={displayLabel}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <svg
          viewBox="0 0 60 80"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <circle cx="30" cy="18" r="8" fill="#c9c3b5" />
          <path d="M14 80 Q14 40 30 40 Q46 40 46 80 Z" fill="#c9c3b5" />
        </svg>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 8,
          right: 8,
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: small ? 10 : 12,
          fontWeight: 700,
        }}
      >
        <span>{displayLabel}</span>
        <span className="px-num">{weightLabel}</span>
      </div>
    </div>
  );
}
