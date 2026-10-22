(() => {
  'use strict';
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
})();
