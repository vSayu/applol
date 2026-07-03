(function(){
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false;

  root.classList.add('page-transitions');

  function ready(){
    navigating = false;
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-ready');
  }

  function isLocalPageLink(link){
    if(!link || link.target || link.hasAttribute('download')) return false;
    const url = new URL(link.href, window.location.href);
    if(url.origin !== window.location.origin) return false;
    if(url.pathname === window.location.pathname && url.hash) return false;
    return url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  }

  window.goPage = function(url){
    if(navigating) return;
    navigating = true;
    if(reduceMotion.matches){
      window.location.href = url;
      return;
    }
    document.body.classList.add('page-leaving');
    window.setTimeout(()=>{ window.location.href = url; }, 220);
  };

  window.addEventListener('pageshow', ready);
  window.addEventListener('DOMContentLoaded', ()=>{
    window.requestAnimationFrame(ready);
    document.addEventListener('click', event=>{
      const link = event.target.closest('a[href]');
      if(!isLocalPageLink(link)) return;
      event.preventDefault();
      window.goPage(link.href);
    });
  });
})();
