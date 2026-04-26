import { useEffect, useState } from 'react';
import { PhotoModal } from './PhotoModal';
import { ThemeToggle } from './ThemeToggle';
import { LangToggle } from './LangToggle';
import { useLang } from '../i18n/LanguageContext';

export function Sidebar() {
  const { t } = useLang();
  const [active, setActive] = useState('about');
  const [photoError, setPhotoError] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const NAV_ITEMS = [
    { id: 'about', label: t('navAbout') },
    { id: 'profile', label: t('navProfile') },
    { id: 'projects', label: t('navProjects') },
    { id: 'teaching', label: t('navTeaching') },
    { id: 'contact', label: t('navContact') },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onJump = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const profileSrc = '/images/profile.jpg';

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sb-id">
          <button
            type="button"
            className="sb-photo"
            onClick={() => !photoError && setPhotoOpen(true)}
            aria-label={t('photoAria')}
          >
            {!photoError ? (
              <img src={profileSrc} alt={t('name')} onError={() => setPhotoError(true)} />
            ) : (
              <span className="sb-photo-fallback">photo</span>
            )}
          </button>
          <h1 className="sb-name">{t('name')}</h1>
          <p className="sb-role">{t('role')}</p>
          <p className="sb-tag">{t('tag')}</p>
        </div>

        <nav className="sb-nav">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className={active === item.id ? 'active' : ''}>
                <a href={`#${item.id}`} onClick={onJump(item.id)}>
                  <span className="sb-bar" />
                  <span className="sb-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sb-foot">
          <div className="sb-toggles">
            <ThemeToggle />
            <LangToggle />
          </div>
          <a href="mailto:alsxogml1234@gmail.com">alsxogml1234@gmail.com</a>
          <div className="sb-apply">
            {!logoError && (
              <img
                src="/images/metlife-logo.png"
                alt={t('metlifeAlt')}
                className="sb-metlogo"
                onError={() => setLogoError(true)}
              />
            )}
            <p>{t('apply')}</p>
          </div>
        </div>
      </div>

      <PhotoModal
        photo={
          photoOpen
            ? { src: profileSrc, caption: t('photoCaption'), tag: t('photoTag') }
            : null
        }
        onClose={() => setPhotoOpen(false)}
      />
    </aside>
  );
}
