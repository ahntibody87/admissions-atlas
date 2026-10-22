(() => {
  'use strict';
  const container = document.querySelector('#resources[data-section]');
  if (!container || !window.ATAA_CONTENT) return;
  const section = window.ATAA_CONTENT.sections.find(item => item.id === container.dataset.section);
  if (!section) return;
  const count = document.querySelector('#resource-count');
  if (count) count.textContent = `${section.items.length}개`;
  // The static HTML remains useful when this collection is empty or JS is disabled.
  if (!section.items.length) return;
  const fragment = document.createDocumentFragment();
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  section.items.forEach((item, index) => {
    const url = new URL(item.href, location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const card = el('a', 'university-card resource-card');
    card.href = url.href;
    const label = el('div', 'university-label');
    label.append(el('span', '', item.category || item.source || section.label), el('span', '', item.year || ''));
    const number = el('div', 'tool-monogram', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    card.append(label, number, el('h2', '', item.title), el('p', '', item.description));
    if (item.updated) card.append(el('small', 'resource-meta', '자료 확인 · ' + item.updated));
    const bottom = el('div', 'card-bottom');
    const arrow = el('span', 'card-arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    bottom.append(el('span', '', item.linkLabel || '자료 열기'), arrow);
    card.append(bottom);
    fragment.append(card);
  });
  container.classList.add('resource-grid');
  container.replaceChildren(fragment);
})();
