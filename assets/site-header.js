(() => {
  'use strict';
  const button=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#navigation');
  if(!button||!nav)return;
  function setMenu(open){button.setAttribute('aria-expanded',String(open));button.firstChild.textContent=open?'메뉴 닫기 ':'메뉴 열기 ';button.querySelector('span').textContent=open?'−':'＋';nav.classList.toggle('open',open);}
  button.addEventListener('click',()=>setMenu(button.getAttribute('aria-expanded')!=='true'));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){setMenu(false);button.focus();}});
  matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});
  // Grade tools share the same current-section treatment as the analysis detail.
  const links=[...document.querySelectorAll('.section-nav[aria-label="계산 도구"] a')];
  const sections=links.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if(sections.length){
    const update=()=>{
      let current=sections[0];
      for(const section of sections)if(section.getBoundingClientRect().top<=130)current=section;
      links.forEach(link=>{
        const active=link.getAttribute('href')==='#'+current.id;
        link.classList.toggle('active',active);
        if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    };
    addEventListener('scroll',update,{passive:true});
    update();
  }
})();
