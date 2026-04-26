import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../i18n/LanguageContext';

export function GalleryModal({ galleries, openId, onClose }) {
  const { t } = useLang();
  const [activeId, setActiveId] = useState(openId);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => { setActiveId(openId); setActiveItem(null); }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (activeItem) setActiveItem(null);
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openId, activeItem, onClose]);

  if (!openId) return null;

  const active = galleries.find((g) => g.id === activeId) ?? galleries[0];

  return createPortal(
    <div className="gm-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <button className="gm-close" onClick={onClose} aria-label={t('modalClose')}>×</button>
      <div className="gm-stage" onClick={(e) => e.stopPropagation()}>
        <aside className="gm-side">
          <h3 className="gm-side-title">{t('galCategory')}</h3>
          <ul className="gm-side-list">
            {galleries.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  className={`gm-side-item${g.id === active.id ? ' is-active' : ''}`}
                  onClick={() => { setActiveId(g.id); setActiveItem(null); }}
                >
                  <span className="gm-side-name">{g.title}</span>
                  <span className="gm-side-count">{g.items.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="gm-main">
          <header className="gm-main-head">
            <h2 className="gm-main-title">{active.title}</h2>
            <p className="gm-main-summary">{active.summary}</p>
          </header>
          <div className="gm-grid">
            {active.items.map((item, i) => (
              <button
                key={i}
                type="button"
                className="gm-item"
                onClick={() => setActiveItem(item)}
                aria-label={item.caption}
              >
                <div className="gm-item-img"><img src={item.src} alt={item.caption} /></div>
                <div className="gm-item-cap">
                  {item.tag && <span className="gm-item-tag">{item.tag}</span>}
                  <p>{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {activeItem && (
        <div
          className="gm-detail"
          onClick={(e) => { e.stopPropagation(); setActiveItem(null); }}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="gm-detail-close"
            onClick={(e) => { e.stopPropagation(); setActiveItem(null); }}
            aria-label={t('modalDetailClose')}
          >×</button>
          <div className="gm-detail-stage" onClick={(e) => e.stopPropagation()}>
            <img src={activeItem.src} alt={activeItem.caption} className="gm-detail-img" />
            <div className="gm-detail-caption">
              {activeItem.tag && <span className="gm-detail-tag">{activeItem.tag}</span>}
              <p>{activeItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
