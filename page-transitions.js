(function(){
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#F4A7B9','#E07A9A','#C9B8E8','#FDDCCC','#FAE3A0','#C8E6DA'];
  let navigating = false;

  root.classList.add('page-transitions');

  function takeStoredDirection(){
    try{
      const direction = sessionStorage.getItem('pageTransitionDirection');
      sessionStorage.removeItem('pageTransitionDirection');
      return direction;
    }catch(error){
      return null;
    }
  }

  function storeDirection(direction){
    try{
      sessionStorage.setItem('pageTransitionDirection', direction);
    }catch(error){}
  }

  function ready(){
    navigating = false;
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-ready');

    if(reduceMotion.matches) return;

    const direction = takeStoredDirection();
    if(direction) runHearts(direction, 460);
  }

  function isLocalPageLink(link){
    if(!link || link.target || link.hasAttribute('download')) return false;
    const url = new URL(link.href, window.location.href);
    if(url.origin !== window.location.origin) return false;
    if(url.pathname === window.location.pathname && url.hash) return false;
    return url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  }

  function getDirection(link, fallback){
    if(fallback) return fallback;
    return link && link.classList.contains('back-btn') ? 'rtl' : 'ltr';
  }

  function runHearts(direction, duration){
    const layer = document.createElement('div');
    const columns = 7;
    const rows = 6;
    const total = columns * rows;

    layer.className = 'heart-transition-layer';

    for(let i = 0; i < total; i++){
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = ((col + .5) / columns) * 100;
      const y = ((row + .5) / rows) * 100;
      const sweepCol = direction === 'rtl' ? columns - 1 - col : col;
      const el = document.createElement('span');
      const drift = (Math.random() - .5) * 6;
      const delay = (sweepCol * 48) + (row * 18) + Math.random() * 34;

      el.className = 'heart-transition';
      el.style.setProperty('--x', Math.min(96, Math.max(4, x + drift)));
      el.style.setProperty('--y', Math.min(94, Math.max(6, y + (Math.random() - .5) * 7)));
      el.style.setProperty('--size', `${16 + Math.random() * 20}px`);
      el.style.setProperty('--delay', `${delay}ms`);
      el.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
      layer.appendChild(el);
    }

    document.body.appendChild(layer);
    window.setTimeout(()=>layer.remove(), duration + 520);
  }

  window.goPage = function(url, direction){
    if(navigating) return;
    navigating = true;

    if(reduceMotion.matches){
      window.location.href = url;
      return;
    }

    document.body.classList.add('page-leaving');
    storeDirection(direction || 'ltr');
    runHearts(direction || 'ltr', 720);
    window.setTimeout(()=>{ window.location.href = url; }, 560);
  };

  window.addEventListener('pageshow', ready);
  window.addEventListener('DOMContentLoaded', ()=>{
    window.requestAnimationFrame(ready);
    document.addEventListener('click', event=>{
      const link = event.target.closest('a[href]');
      if(!isLocalPageLink(link)) return;
      event.preventDefault();
      window.goPage(link.href, getDirection(link));
    });
  });
})();
