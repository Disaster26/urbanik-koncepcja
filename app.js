(function(){
  var d=document;
  d.getElementById('rok').textContent=new Date().getFullYear();

  // menu mobilne
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');d.body.style.overflow=''}
  burger.addEventListener('click',function(){
    var otw=!menu.classList.contains('otw');
    menu.classList.toggle('otw',otw);burger.setAttribute('aria-expanded',String(otw));d.body.style.overflow=otw?'hidden':'';
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij()});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});

  // przewijane rzędy: palec natywnie, mysz przeciąganiem, strzałki
  function rzad(el,attr){
    var strz=d.querySelectorAll('['+attr+']');
    function krok(){var k=el.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(el).columnGap||14):300}
    function stan(){var max=el.scrollWidth-el.clientWidth-2;strz.forEach(function(b){b.disabled=(+b.getAttribute(attr)<0)?el.scrollLeft<=2:el.scrollLeft>=max})}
    strz.forEach(function(b){b.addEventListener('click',function(){el.scrollBy({left:+b.getAttribute(attr)*krok(),behavior:'smooth'})})});
    el.addEventListener('scroll',function(){requestAnimationFrame(stan)},{passive:true});
    addEventListener('resize',stan);stan();
    var ciag=false,sx=0,sl=0,ruch=0;
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||el.scrollWidth<=el.clientWidth)return;
      ciag=true;sx=e.clientX;sl=el.scrollLeft;ruch=0;el.style.scrollSnapType='none';el.style.cursor='grabbing';e.preventDefault();
    });
    addEventListener('pointermove',function(e){if(!ciag)return;ruch=e.clientX-sx;el.scrollLeft=sl-ruch});
    addEventListener('pointerup',function(){
      if(!ciag)return;ciag=false;el.style.cursor='';
      var k=krok(),cel=Math.round(el.scrollLeft/k)*k;el.scrollTo({left:cel,behavior:'smooth'});
      setTimeout(function(){el.style.scrollSnapType=''},400);
    });
    el.addEventListener('click',function(e){if(Math.abs(ruch)>6){e.preventDefault();e.stopPropagation();ruch=0}},true);
    el.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){el.scrollBy({left:krok(),behavior:'smooth'});e.preventDefault()}
      if(e.key==='ArrowLeft'){el.scrollBy({left:-krok(),behavior:'smooth'});e.preventDefault()}
    });
    return el;
  }
  var karty=rzad(d.getElementById('karty'),'data-kar');
  rzad(d.getElementById('gal'),'data-gal');

  // skok do karty usługi: na telefonie przewiń rząd kart do właściwej
  function doKarty(id){
    var k=d.getElementById(id);
    if(k&&k.parentNode===karty&&karty.scrollWidth>karty.clientWidth+4){
      setTimeout(function(){karty.scrollTo({left:k.offsetLeft-karty.offsetLeft-20,behavior:'smooth'})},350);
    }
  }
  d.querySelectorAll('a[href="#hurtownia"],a[href="#magazyny"]').forEach(function(a){a.addEventListener('click',function(){doKarty(a.getAttribute('href').slice(1))})});

  // aktywna pozycja menu = bieżąca sekcja
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]'));
  function ustaw(href){linki.forEach(function(a){if(a.getAttribute('href')===href)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
  var mapa={start:'#top',firma:'#firma',auta:'#auta',kontakt:'#kontakt'};
  var hero=d.querySelector('.hero');hero.id='start';
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wp){
      wp.forEach(function(w){if(!w.isIntersecting)return;
        if(w.target.id==='uslugi'){
          var x=karty.scrollLeft,kk=[].slice.call(karty.children),best=kk[0],bd=1e9;
          if(karty.scrollWidth>karty.clientWidth+4){kk.forEach(function(k){var dd=Math.abs(k.offsetLeft-karty.offsetLeft-x-20);if(dd<bd){bd=dd;best=k}})}
          ustaw(best.id==='auta-karta'?'#auta':'#'+best.id);
        } else ustaw(mapa[w.target.id]);
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    ['start','firma','uslugi','auta','kontakt'].forEach(function(id){io.observe(d.getElementById(id))});
  }

  // "Zapytaj o..." ustawia temat wiadomości
  var temat=d.getElementById('temat');
  d.querySelectorAll('[data-temat]').forEach(function(a){a.addEventListener('click',function(){temat.value=a.dataset.temat})});

  // formularz pokazowy
  d.getElementById('form').addEventListener('submit',function(e){e.preventDefault();d.getElementById('formInfo').hidden=false});

  // dolny pasek na telefonie dopiero po przewinięciu za pierwszy ekran
  var mob=d.getElementById('mob'), bar=d.querySelector('.hero-bar'), kont=d.getElementById('kontakt');
  if('IntersectionObserver' in window){
    var za=false,wK=false;
    function pokaz(){var on=za&&!wK;mob.classList.toggle('widac',on);mob.setAttribute('aria-hidden',String(!on));mob.querySelectorAll('a').forEach(function(a){a.tabIndex=on?0:-1})}
    new IntersectionObserver(function(w){za=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;pokaz()}).observe(bar);
    new IntersectionObserver(function(w){wK=w[0].isIntersecting;pokaz()},{rootMargin:'0px 0px -30% 0px'}).observe(kont);
  }
})();
