import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../i18n/LanguageContext';

export function PhotoModal({ photo, onClose }) {
  const { t } = useLang();
  useEffect(() => {
    if (!photo) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return createPortal(
    <div className="photo-modal" onClick={onClose} role="dialog" aria-modal="true">
      <button className="pm-close" onClick={onClose} aria-label={t('modalClose')}>×</button>
      <div className="pm-stage" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.caption} className="pm-img" />
        <div className="pm-caption">
          {photo.tag && <span className="pm-tag">{photo.tag}</span>}
          <p>{photo.caption}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
