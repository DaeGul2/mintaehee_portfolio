import { useRef, useState } from 'react';
import { PhotoBlock } from './MediaPlaceholder';
import { PhotoModal } from './PhotoModal';
import { GalleryModal } from './GalleryModal';
import { useLang } from '../i18n/LanguageContext';

function ApilogTable({ rows }) {
  const { t } = useLang();
  return (
    <table className="data-table">
      <thead>
        <tr><th>{t('thAction')}</th><th>{t('thCount')}</th><th>{t('thDesc')}</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.action}>
            <td><code>{r.action}</code></td>
            <td className={`num${r.highlight ? ' highlight' : ''}`}>{r.count}</td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ScoreDistTable({ rows }) {
  const { t } = useLang();
  return (
    <table className="data-table">
      <thead>
        <tr><th>{t('thScoreRange')}</th><th>{t('thCount')}</th><th style={{ width: '120px' }}>{t('thDist')}</th><th>{t('thDesc')}</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.range}>
            <td>{r.range}</td>
            <td className="num">{r.count}</td>
            <td><div className="bar" style={{ width: `${r.barW}px` }} /></td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BlockSamplesTable({ rows }) {
  const { t } = useLang();
  return (
    <table className="data-table">
      <thead>
        <tr><th>{t('thNum')}</th><th>{t('thCat')}</th><th>{t('thBlockTitle')}</th><th>{t('thBlockBody')}</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="num">{r.id}</td>
            <td>{r.cat}</td>
            <td>{r.title}</td>
            <td>{r.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MetricSplitGrid({ rows }) {
  return (
    <div className="ms-grid">
      {rows.map((r, i) => (
        <div key={i} className="ms-cell">
          <span className="ms-kind">{r.kind}</span>
          <span className="ms-target">{r.target}</span>
          <p className="ms-result">{r.result}</p>
          <small className="ms-note">{r.note}</small>
        </div>
      ))}
    </div>
  );
}

function DataInsert({ project }) {
  const { t } = useLang();
  if (project.blockSamples) {
    return (
      <div className="data-insert">
        <header>
          <span className="di-tag">{t('diSamples')}</span>
          <span className="di-src">{t('diSamplesSrc')}</span>
        </header>
        <BlockSamplesTable rows={project.blockSamples} />
      </div>
    );
  }
  if (project.apilogTop) {
    return (
      <div className="data-insert">
        <header>
          <span className="di-tag">{t('diAuditLog')}</span>
          <span className="di-src">{t('diAuditSrc')}</span>
        </header>
        <ApilogTable rows={project.apilogTop} />
      </div>
    );
  }
  if (project.scoreDist) {
    return (
      <div className="data-insert">
        <header>
          <span className="di-tag">{t('diScore')}</span>
          <span className="di-src">{t('diScoreSrc')}</span>
        </header>
        <ScoreDistTable rows={project.scoreDist} />
      </div>
    );
  }
  if (project.metricSplit) {
    return (
      <div className="data-insert metric-split">
        <header>
          <span className="di-tag">{t('diMetric')}</span>
          <span className="di-src">{t('diMetricSrc')}</span>
        </header>
        <MetricSplitGrid rows={project.metricSplit} />
      </div>
    );
  }
  return null;
}

export function ProjectCard({ project }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [activeGalleryId, setActiveGalleryId] = useState(null);
  const [dataOpen, setDataOpen] = useState(false);
  const articleRef = useRef(null);
  const {
    id, index, name, role, tagline, period, stack,
    overview, points, feedback, photos, photoCols, relevance,
  } = project;

  const handleCollapse = () => {
    setOpen(false);
    setTimeout(() => {
      articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <article ref={articleRef} id={id} className={`pcard${open ? ' is-open' : ''}`}>
      <div className="pcard-head" onClick={() => setOpen(!open)}>
        <div className="pcard-meta">
          <span className="pcard-index">{index}</span>
          <span className="pcard-period">{period}</span>
        </div>
        <h3 className="pcard-name">{name}</h3>
        <p className="pcard-role">{role}</p>
        <p className="pcard-tagline">{tagline}</p>
        <div className="pcard-stack">
          {stack.map((s) => <span key={s} className="stack-chip">{s}</span>)}
        </div>
        <button
          className="pcard-toggle"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          aria-expanded={open}
        >
          {open ? t('pcardCollapse') : t('pcardExpand')}
        </button>
      </div>

      {open && (
        <div className="pcard-body">
          <div className="pcard-block pcard-block-relevance">
            <h4 className="pcard-blocktitle">{relevance.label}</h4>
            <ul className="rel-ul">
              {relevance.lines.map((l, i) => (
                <li key={i}>
                  <span className="rel-tag">{l.tag}</span>
                  <p>{l.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="pcard-overview">
            <p>{overview}</p>
          </div>

          {project.journey && (
            <div className="pcard-block">
              <h4 className="pcard-blocktitle">{project.journey.label}</h4>
              <ol className="jrn-list">
                {project.journey.stages.map((s, i) => (
                  <li key={i} className="jrn-item">
                    <div className="jrn-marker">
                      <span className="jrn-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="jrn-line" />
                    </div>
                    <div className="jrn-body">
                      <span className="jrn-tag">{s.tag}</span>
                      {typeof s.body === 'string' ? <p>{s.body}</p> : <div className="jrn-rich">{s.body}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="pcard-block">
            <h4 className="pcard-blocktitle">{t('pcardPoints')}</h4>
            <ul className="hl-ul">
              {points.map((pt, i) => (
                <li key={i}>
                  <h5>{pt.h}</h5>
                  <p>{pt.p}</p>
                </li>
              ))}
            </ul>
          </div>

          {project.photoGalleries && project.photoGalleries.length > 0 && (
            <div className="pcard-block">
              <h4 className="pcard-blocktitle">{t('pcardGalleries')} <span className="pcard-hint">{t('pcardGalleriesHint')}</span></h4>
              <div className="gal-grid">
                {project.photoGalleries.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className="gal-card"
                    onClick={() => setActiveGalleryId(g.id)}
                  >
                    <div className="gal-cover">
                      <img src={g.cover} alt={g.title} />
                      <span className="gal-count">{g.items.length} {t('pcardImgCount')}</span>
                    </div>
                    <div className="gal-meta">
                      <h5 className="gal-title">{g.title}</h5>
                      <p className="gal-summary">{g.summary}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!project.photoGalleries && photos && photos.length > 0 && (
            <div className="pcard-block">
              <h4 className="pcard-blocktitle">{t('pcardPhotos')} <span className="pcard-hint">{t('pcardPhotosHint')}</span></h4>
              <div className={`photo-grid ${photoCols}`}>
                {photos.map((p, i) => <PhotoBlock key={i} {...p} onOpen={setActivePhoto} />)}
              </div>
            </div>
          )}

          {(project.blockSamples || project.apilogTop || project.scoreDist || project.metricSplit) && (
            <div className="pcard-block">
              <button
                type="button"
                className="pcard-data-toggle"
                onClick={() => setDataOpen((v) => !v)}
                aria-expanded={dataOpen}
              >
                <span className="pcard-data-title">{t('pcardData')}</span>
                <span className="pcard-data-hint">{dataOpen ? t('pcardDataClose') : t('pcardDataOpen')}</span>
              </button>
              {dataOpen && (
                <div className="pcard-data-body">
                  <DataInsert project={project} />
                </div>
              )}
            </div>
          )}

          {feedback && (
            <div className="pcard-block">
              <h4 className="pcard-blocktitle">{feedback.label}</h4>
              <blockquote className="fb">
                <p>"{feedback.text}"</p>
                <cite>— {feedback.cite}</cite>
              </blockquote>
            </div>
          )}

          {project.growth && (
            <div className="pcard-block">
              <h4 className="pcard-blocktitle">{project.growth.label}</h4>
              <ul className="growth-ul">
                {project.growth.points.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pcard-foot">
            <button className="pcard-foot-collapse" onClick={handleCollapse}>
              {t('pcardFootCollapse')}
            </button>
          </div>
        </div>
      )}

      <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
      {project.photoGalleries && (
        <GalleryModal
          galleries={project.photoGalleries}
          openId={activeGalleryId}
          onClose={() => setActiveGalleryId(null)}
        />
      )}
    </article>
  );
}
