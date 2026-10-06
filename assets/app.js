(() => {
  'use strict';
  const content = window.ATAA_CONTENT;
  const nav = document.querySelector('#section-navigation');
  const collections = document.querySelector('#collections');
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function link(text, href, className) {
    const node = el('a', className, text);
    const url = new URL(href, window.location.href);
    if (['https:', 'http:'].includes(url.protocol)) node.href = url.href;
    return node;
  }
  content.sections.forEach(section => {
    if (!/^[a-z][a-z0-9-]*$/.test(section.id)) return;
    nav.append(link(section.label, '#' + section.id));
    const block = el('section', 'collection'); block.id = section.id;
    const heading = el('div', 'section-heading');
    const titles = el('div');
    titles.append(el('p', 'eyebrow', section.english), el('h2', '', section.label));
    heading.append(titles, el('span', 'count', section.items.length + '개'));
    block.append(heading, el('p', 'section-description', section.description));
    if (!section.items.length) block.append(el('p', 'empty', section.empty));
    else {
      const list = el('div', 'resource-list');
      section.items.forEach(item => {
        const card = el('article', 'resource');
        if (item.year) card.append(el('span', 'year', item.year + '학년도'));
        const h3 = el('h3'); h3.append(link(item.title, item.href)); card.append(h3);
        if (item.description) card.append(el('p', '', item.description));
        const details = [item.source && '출처: ' + item.source, item.updated && '확인: ' + item.updated].filter(Boolean);
        if (details.length) card.append(el('small', 'metadata', details.join(' · ')));
        list.append(card);
      });
      block.append(list);
    }
    collections.append(block);
  });
  const banners = document.querySelector('#banners');
  content.banners.forEach(item => {
    const banner = el('article', 'banner');
    banner.append(el('h2', '', item.title), el('p', '', item.description));
    if (item.href) banner.append(link(item.linkLabel || '자세히 보기 →', item.href));
    banners.append(banner);
  });
  banners.hidden = !content.banners.length;
  const button = document.querySelector('#menu-button');
  const navigation = document.querySelector('#navigation');
  function setMenu(open) {
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? '메뉴 닫기' : '메뉴 열기';
    navigation.classList.toggle('open', open);
  }
  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
})();
