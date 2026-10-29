(() => {
  'use strict';
  // Keep the map's destinations inside the hero as viewport height changes.
  // The landscape remains large and cropped; the labels keep their proportions.
  const hero = document.querySelector('.hero');
  const map = document.querySelector('.map-art');
  const network = document.querySelector('.map-network');
  const fitMap = () => {
    if (!hero || !map || !network) return;
    const scale = map.clientWidth / 1000;
    if (!matchMedia('(min-width: 701px)').matches || scale <= 0) {
      network.removeAttribute('transform');
      return;
    }
    const bounds = network.getBBox();
    const fit = Math.min(1, Math.max(1, hero.clientHeight - 90) / (scale * bounds.height));
    const shift = Math.max(24 / scale - fit * bounds.y,
      Math.min(0, (hero.clientHeight - 66) / scale - fit * (bounds.y + bounds.height)));
    // Shrink uniformly around the right edge on short, wide screens. Translating
    // alone can push Grade Planning above the hero while keeping the last stop in view.
    network.setAttribute('transform', `translate(${((1 - fit) * 900).toFixed(2)} ${shift.toFixed(2)}) scale(${fit.toFixed(4)})`);
  };
  if (hero && network) new ResizeObserver(fitMap).observe(hero);
  fitMap();
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstChild.textContent = open ? '메뉴 닫기 ' : '메뉴 열기 ';
    toggle.querySelector('span').textContent = open ? '−' : '＋';
    navigation.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false); toggle.focus();
    }
  });
  matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  const about = document.querySelector('#about-dialog');
  document.querySelector('#about-button').addEventListener('click', () => about.showModal());
  about.addEventListener('click', event => {
    const bounds = about.getBoundingClientRect();
    if (event.target === about && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) about.close();
  });

  const start = document.querySelector('#explore-button');
  const panel = document.querySelector('#explore-panel');
  const news = document.querySelector('.atlas-news');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // The two entrance states manage their own scroll position, including reloads.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let openingTimer;
  const showExplore = (animate = true) => {
    clearTimeout(openingTimer);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    panel.hidden = false;
    hero.inert = true;
    news.inert = true;
    document.body.classList.toggle('explore-instant', !animate || reducedMotion.matches);
    document.body.classList.add('is-exploring');
    const finish = () => {
      document.body.classList.add('explore-ready');
      panel.inert = false;
      document.querySelector('#explore-title').focus({ preventScroll: true });
    };
    if (!animate || reducedMotion.matches) finish();
    else openingTimer = setTimeout(finish, 850);
  };
  const showMap = () => {
    clearTimeout(openingTimer);
    document.body.classList.remove('is-exploring', 'explore-ready', 'explore-instant');
    panel.hidden = true;
    panel.inert = true;
    hero.inert = false;
    news.inert = false;
    fitMap();
    start.focus({ preventScroll: true });
  };
  start.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState({ ataaExplore: true }, '', '#explore');
    showExplore();
  });
  document.querySelector('.explore-back').addEventListener('click', () => {
    if (history.state?.ataaExplore) history.back();
    else {
      history.replaceState(null, '', location.pathname + location.search);
      showMap();
    }
  });
  addEventListener('popstate', () => {
    if (location.hash === '#explore') showExplore(false);
    else showMap();
  });
  if (location.hash === '#explore') showExplore(false);
})();
