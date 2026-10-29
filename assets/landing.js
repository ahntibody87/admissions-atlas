(() => {
  'use strict';
  // Keep the map's destinations inside the hero as viewport height changes.
  // The landscape remains large and cropped; the labels keep their proportions.
  const hero = document.querySelector('.hero');
  const map = document.querySelector('.map-art');
  const network = document.querySelector('.map-network');
  const fitMap = () => {
    if (!hero || !map || !network || document.body.classList.contains('is-exploring')) return;
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
  if (hero && network) new ResizeObserver(() => { fitMap(); scheduleMap(); }).observe(hero);
  fitMap();
  // Cache a bitmap of the fitted map while idle. Zooming this bitmap avoids
  // rerasterizing thousands of terrain segments and SVG masks on every frame.
  const snapshot = document.createElement('canvas');
  snapshot.className = 'map-snapshot';
  snapshot.setAttribute('aria-hidden', 'true');
  map.after(snapshot);
  const lights = document.createElement('div');
  lights.className = 'map-lights';
  lights.setAttribute('aria-hidden', 'true');
  snapshot.after(lights);
  const journeys = ['.route-main', '.route-secondary'].map(selector => {
    const sprite = document.createElement('span');
    sprite.className = 'map-light';
    lights.append(sprite);
    return { path: map.querySelector(selector), sprite, frames: [] };
  });
  let lightAnimations = [];
  const stopLights = () => { lightAnimations.forEach(animation => animation.cancel()); lightAnimations = []; };
  const cacheJourneys = () => {
    const matrix = network.transform.baseVal.consolidate()?.matrix;
    const scale = map.clientWidth / 1000;
    journeys.forEach(journey => {
      const length = journey.path.getTotalLength();
      journey.frames = Array.from({length:81}, (_, i) => {
        const progress = i / 80;
        const point = journey.path.getPointAtLength(length * progress);
        const next = journey.path.getPointAtLength(Math.min(length, length * progress + 1));
        const fit = p => matrix ? { x:matrix.a*p.x+matrix.c*p.y+matrix.e, y:matrix.b*p.x+matrix.d*p.y+matrix.f } : p;
        const p = fit(point), n = fit(next);
        const angle = Math.atan2(n.y-p.y, n.x-p.x) * 180 / Math.PI;
        return { offset:progress, transform:`translate3d(${(p.x*scale).toFixed(2)}px,${(p.y*scale).toFixed(2)}px,0) rotate(${angle.toFixed(1)}deg)`, opacity:i===0||i===80?0:1 };
      });
    });
  };
  const playLights = () => {
    stopLights();
    if (!document.body.classList.contains('snapshot-ready')) return;
    journeys.forEach((journey, i) => lightAnimations.push(journey.sprite.animate(journey.frames, {
      duration:i ? 1050 : 740, delay:i ? 170 : 130, easing:'cubic-bezier(.2,.55,.35,1)', fill:'both'
    })));
  };
  const terrain = fetch(new URL('atlas-terrain.svg', document.currentScript.src))
    .then(response => { if (!response.ok) throw new Error('terrain'); return response.text(); });
  let snapshotRevision = 0;
  let snapshotTimer;
  const cacheMap = async () => {
    if (document.body.classList.contains('is-exploring')) return;
    const revision = ++snapshotRevision;
    document.body.classList.remove('snapshot-ready');
    try {
      await document.fonts.ready;
      const terrainSource = await terrain;
      if (revision !== snapshotRevision || document.body.classList.contains('is-exploring')) return;
      const copy = map.cloneNode(true);
      const originalNodes = [map, ...map.querySelectorAll('*')];
      const copiedNodes = [copy, ...copy.querySelectorAll('*')];
      const properties = ['fill','stroke','stroke-width','stroke-linejoin','stroke-linecap','paint-order','font-family','font-size','font-weight','letter-spacing','text-anchor','opacity'];
      copiedNodes.forEach((node, i) => {
        const style = getComputedStyle(originalNodes[i]);
        for (const property of properties) node.style.setProperty(property, style.getPropertyValue(property));
        const bluePalette = {
          'rgb(23, 63, 59)':'#24486e', 'rgb(171, 114, 76)':'#3977ce',
          'rgb(247, 245, 238)':'#eef4fd', 'rgb(49, 94, 85)':'#4e7da8',
          'rgb(184, 172, 144)':'#b2c4de', 'rgb(167, 169, 140)':'#b2c4de',
          'rgb(108, 123, 109)':'#718ba9', 'rgb(177, 124, 83)':'#6193d2'
        };
        for (const property of ['fill','stroke']) {
          const color = bluePalette[style.getPropertyValue(property)];
          if (color) node.style.setProperty(property, color);
        }
      });
      copy.setAttribute('width', map.clientWidth);
      copy.setAttribute('height', map.clientHeight);
      const blueTerrain = terrainSource.replaceAll('#929c83','#8da8c6').replaceAll('#b6b8a1','#bdcee2');
      copy.querySelector('image').setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(blueTerrain));
      copy.querySelectorAll('#paper stop').forEach((stop, i) => stop.setAttribute('stop-color', i ? '#dce8f8' : '#f7faff'));
      copy.querySelectorAll('.route-main,.route-secondary').forEach(path => path.style.strokeDashoffset = '0');
      copy.querySelectorAll('.route-dotted').forEach(path => {
        path.style.strokeDasharray = '.004 .008';
        path.style.opacity = '.8';
      });
      const blob = new Blob([new XMLSerializer().serializeToString(copy)], {type:'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      try {
        const bitmap = new Image();
        bitmap.src = url;
        await bitmap.decode();
        if (revision !== snapshotRevision || document.body.classList.contains('is-exploring')) return;
        const ratio = Math.min(devicePixelRatio || 1, 1.5);
        snapshot.width = Math.round(map.clientWidth * ratio);
        snapshot.height = Math.round(map.clientHeight * ratio);
        const context = snapshot.getContext('2d');
        context.drawImage(bitmap, 0, 0, snapshot.width, snapshot.height);
        if (matchMedia('(min-width:701px)').matches) {
          const fade = context.createLinearGradient(0, 0, snapshot.width * .15, 0);
          fade.addColorStop(0, 'transparent');
          fade.addColorStop(1, '#000');
          context.globalCompositeOperation = 'destination-in';
          context.fillStyle = fade;
          context.fillRect(0, 0, snapshot.width, snapshot.height);
        }
        document.body.classList.add('snapshot-ready');
        cacheJourneys();
      } finally { URL.revokeObjectURL(url); }
    } catch { /* Keep the original map usable and use a simple fade instead. */ }
  };
  const scheduleMap = () => {
    clearTimeout(snapshotTimer);
    snapshotTimer = setTimeout(cacheMap, 160);
  };
  new ResizeObserver(scheduleMap).observe(map);
  terrain.catch(() => {});
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
  let openingFrame;
  const prepareExplore = () => document.body.classList.add('explore-preparing');
  start.addEventListener('pointerenter', prepareExplore);
  start.addEventListener('focus', prepareExplore);
  const showExplore = (animate = true) => {
    clearTimeout(openingTimer);
    cancelAnimationFrame(openingFrame);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    panel.hidden = false;
    hero.inert = true;
    news.inert = true;
    const instant = !animate || reducedMotion.matches;
    document.body.classList.toggle('explore-instant', instant);
    const finish = () => {
      stopLights();
      document.body.classList.add('explore-ready');
      panel.inert = false;
      document.querySelector('#explore-title').focus({ preventScroll: true });
    };
    const begin = () => {
      document.body.classList.add('is-exploring');
      if (instant) finish();
      else { playLights(); openingTimer = setTimeout(finish, 1550); }
    };
    if (instant) begin();
    else {
      prepareExplore();
      // Paint the static SVG once before animating its composited layer.
      openingFrame = requestAnimationFrame(() => {
        openingFrame = requestAnimationFrame(begin);
      });
    }
  };
  const showMap = () => {
    clearTimeout(openingTimer);
    cancelAnimationFrame(openingFrame);
    stopLights();
    document.body.classList.remove('is-exploring', 'explore-ready', 'explore-instant', 'explore-preparing');
    panel.hidden = true;
    panel.inert = true;
    hero.inert = false;
    news.inert = false;
    fitMap();
    scheduleMap();
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
