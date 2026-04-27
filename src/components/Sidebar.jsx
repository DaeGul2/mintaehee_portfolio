import { useEffect, useRef, useState } from 'react';
import { PhotoModal } from './PhotoModal';
import { ThemeToggle } from './ThemeToggle';
import { LangToggle } from './LangToggle';
import { PrintButton } from './PrintButton';
import { useLang } from '../i18n/LanguageContext';

export function Sidebar() {
  const { t } = useLang();
  const [active, setActive] = useState('about');
  const [photoError, setPhotoError] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const autoCanCollapseRef = useRef(true);

  useEffect(() => {
    document.body.dataset.sbCollapsed = collapsed ? '1' : '';
  }, [collapsed]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth <= 1024) return;
      const y = window.scrollY;
      if (y < 60) autoCanCollapseRef.current = true;
      if (y > 220 && autoCanCollapseRef.current) {
        setCollapsed(true);
        autoCanCollapseRef.current = false;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <>
      <button
        type="button"
        className="sb-reopen"
        onClick={() => setCollapsed(false)}
        aria-label={t('sbOpen')}
        title={t('sbOpen')}
      >
        <span className="sb-reopen-icon" aria-hidden="true">›</span>
        <span className="sb-reopen-label">MENU</span>
      </button>
    <aside className={`sidebar${collapsed ? ' is-collapsed' : ''}`}>
      <button
        type="button"
        className="sb-close"
        onClick={() => setCollapsed(true)}
        aria-label={t('sbClose')}
        title={t('sbClose')}
      >
        ‹
      </button>
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
          <ul className="sb-bio">
            <li>
              <span className="sb-bio-key">{t('bioBirthKey')}</span>
              <span className="sb-bio-val">{t('bioBirthVal')}</span>
            </li>
            <li>
              <span className="sb-bio-key">{t('bioAddressKey')}</span>
              <span className="sb-bio-val">{t('bioAddressVal')}</span>
            </li>
          </ul>
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
          <PrintButton />
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
    </>
  );
}
