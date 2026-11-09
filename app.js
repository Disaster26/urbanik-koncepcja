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

  // aktywna pozycja menu: usługa (karta w widoku) albo kontakt
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]'));
  function ustaw(id){linki.forEach(function(a){if(id&&a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
  var karty=d.getElementById('karty'), kartyEl=[].slice.call(karty.querySelectorAll('.karta'));
  var wybrana=null;
  function aktywnaKarta(){
    // na telefonie: karta przewinięta do lewej krawędzi; na komputerze: ostatnio wybrana z menu
    if(karty.scrollWidth>karty.clientWidth+4){
      var x=karty.scrollLeft, best=kartyEl[0], bd=1e9;
      kartyEl.forEach(function(k){var dd=Math.abs(k.offsetLeft-karty.offsetLeft-x-20);if(dd<bd){bd=dd;best=k}});
      return best.id;
    }
    return wybrana;
  }
  var widoczna=null;
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wp){
      wp.forEach(function(w){if(w.isIntersecting){widoczna=w.target.id}});
      ustaw(widoczna==='uslugi'?aktywnaKarta():(widoczna==='kontakt'?'kontakt':null));
    },{rootMargin:'-45% 0px -50% 0px'});
    ['uslugi','firma','kontakt'].forEach(function(id){io.observe(d.getElementById(id))});
    var hero=d.querySelector('.hero'); io.observe(hero); hero.id=hero.id||'start';
  }
  linki.forEach(function(a){a.addEventListener('click',function(){
    var id=a.getAttribute('href').slice(1);
    if(a.dataset.k){wybrana=id;var k=d.getElementById(id);
      if(karty.scrollWidth>karty.clientWidth+4){karty.scrollTo({left:k.offsetLeft-karty.offsetLeft-20,behavior:'smooth'})}}
  })});
  d.querySelectorAll('.kafel').forEach(function(a){a.addEventListener('click',function(){
    var id=a.getAttribute('href').slice(1),k=d.getElementById(id);wybrana=id;
    if(karty.scrollWidth>karty.clientWidth+4){setTimeout(function(){karty.scrollTo({left:k.offsetLeft-karty.offsetLeft-20,behavior:'smooth'})},350)}
  })});

  // karty: palec natywnie, mysz przeciąganiem, strzałki
  var strz=d.querySelectorAll('[data-kar]');
  function krok(){var k=kartyEl[0];return k?k.getBoundingClientRect().width+14:300}
  function stanStrz(){
    var max=karty.scrollWidth-karty.clientWidth-2;
    strz.forEach(function(b){b.disabled=(+b.dataset.kar<0)?karty.scrollLeft<=2:karty.scrollLeft>=max});
    if(widoczna==='uslugi')ustaw(aktywnaKarta());
  }
  strz.forEach(function(b){b.addEventListener('click',function(){karty.scrollBy({left:+b.dataset.kar*krok(),behavior:'smooth'})})});
  karty.addEventListener('scroll',function(){window.requestAnimationFrame(stanStrz)},{passive:true});
  window.addEventListener('resize',stanStrz);stanStrz();
  var ciag=false,sx=0,sl=0,ruch=0;
  karty.addEventListener('pointerdown',function(e){
    if(e.pointerType!=='mouse'||karty.scrollWidth<=karty.clientWidth)return;
    ciag=true;sx=e.clientX;sl=karty.scrollLeft;ruch=0;karty.style.scrollSnapType='none';karty.style.cursor='grabbing';
  });
  window.addEventListener('pointermove',function(e){if(!ciag)return;ruch=e.clientX-sx;karty.scrollLeft=sl-ruch});
  window.addEventListener('pointerup',function(){
    if(!ciag)return;ciag=false;karty.style.cursor='';
    var k=krok(),cel=Math.round(karty.scrollLeft/k)*k;
    karty.scrollTo({left:cel,behavior:'smooth'});
    setTimeout(function(){karty.style.scrollSnapType=''},400);
  });
  karty.addEventListener('click',function(e){if(Math.abs(ruch)>6){e.preventDefault();e.stopPropagation();ruch=0}},true);
  karty.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){karty.scrollBy({left:krok(),behavior:'smooth'});e.preventDefault()}
    if(e.key==='ArrowLeft'){karty.scrollBy({left:-krok(),behavior:'smooth'});e.preventDefault()}
  });

  // "Zapytaj o..." ustawia temat wiadomości
  var temat=d.getElementById('temat');
  d.querySelectorAll('[data-temat]').forEach(function(a){a.addEventListener('click',function(){temat.value=a.dataset.temat})});

  // formularz pokazowy
  d.getElementById('form').addEventListener('submit',function(e){e.preventDefault();d.getElementById('formInfo').hidden=false});

  // dolny pasek na telefonie dopiero po przewinięciu za pierwszy ekran
  var mob=d.getElementById('mob'), cta=d.querySelector('.hero-cta'), kont=d.getElementById('kontakt');
  if('IntersectionObserver' in window){
    var zaCta=false,wKont=false;
    function pokaz(){var on=zaCta&&!wKont;mob.classList.toggle('widac',on);mob.setAttribute('aria-hidden',String(!on));mob.querySelectorAll('a').forEach(function(a){a.tabIndex=on?0:-1})}
    new IntersectionObserver(function(w){zaCta=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;pokaz()}).observe(cta);
    new IntersectionObserver(function(w){wKont=w[0].isIntersecting;pokaz()},{rootMargin:'0px 0px -30% 0px'}).observe(kont);
  }
})();
