if (window.VANTA?.FOG && window.THREE && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  VANTA.FOG({
    el: '#hero-fog',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    highlightColor: 0x6896ff,
    midtoneColor: 0xf24fa9,
    lowlightColor: 0x6d69e5,
    baseColor: 0xf9ecf2,
    speed: 2.20,
    zoom: 0.40
  });
}
function lazyFog(id, opts) {
  const el = document.getElementById(id);
  if (!el || !window.VANTA?.FOG || !window.THREE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let fx = null;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !fx) { fx = VANTA.FOG(Object.assign({ el, gyroControls:false, minHeight:200, minWidth:200 }, opts)); }
    else if (!e.isIntersecting && fx) { fx.destroy(); fx = null; }
  }, { rootMargin:'200px' }).observe(el);
}
lazyFog('statement-fog', { mouseControls:false, touchControls:false, highlightColor:0x6896ff, midtoneColor:0xf24fa9, lowlightColor:0x6d69e5, baseColor:0xf9ecf2, speed:1.6, zoom:0.40 });
lazyFog('cta-fog', { mouseControls:true, touchControls:true, highlightColor:0xb668ff, midtoneColor:0xf24fa9, lowlightColor:0xe5699c, baseColor:0xf9ecf2, speed:2.20, zoom:0.40 });

document.querySelectorAll('[data-pause]').forEach(b=>b.addEventListener('click',()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'Play ':'Pause ')+b.dataset.pause);if(b.dataset.pause==='trending')trendingUserPaused=on;else railUserPaused=on;}));
// Manual previous/next controls use each carousel's own loop offsets.
document.querySelectorAll('[data-carousel]').forEach(button=>button.addEventListener('click',()=>{
 const direction=Number(button.dataset.direction);
 if(button.dataset.carousel==='trending'){
  const step=trendCards[0].getBoundingClientRect().width+22;
  trendingOffset=((trendingOffset+direction*step)%trendingWidth+trendingWidth)%trendingWidth;
  trendingTrack.style.transform=`translate3d(${-trendingOffset}px,0,0)`;
  trendingFrame=0;
 }else{
  const step=originalCards[0].getBoundingClientRect().width+20;
  offset=((offset+direction*step)%loopWidth+loopWidth)%loopWidth;
  track.style.transform=`translate3d(${-offset}px,0,0)`;
  lastFrame=0;
 }
}));
