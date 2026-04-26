import { useState } from 'react';

export function PhotoBlock({ tag, caption, src, onOpen }) {
  const [error, setError] = useState(false);
  const handleClick = () => onOpen?.({ tag, caption, src });

  if (!error && src) {
    return (
      <button type="button" className="photo-thumb" onClick={handleClick} aria-label={caption}>
        <img src={src} alt={caption} onError={() => setError(true)} />
        <div className="thumb-overlay">
          {tag && <span className="thumb-tag">{tag}</span>}
          <span className="thumb-caption">{caption}</span>
        </div>
      </button>
    );
  }
  return (
    <button type="button" className="media-placeholder photo" onClick={handleClick}>
      <span className="ph-tag">{tag}</span>
      <p>{caption}</p>
      <code>{src}</code>
    </button>
  );
}
