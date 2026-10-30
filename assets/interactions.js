/* Shared site behavior: personalization, carousels, and navigation. */
function updatePersonalisation(){
  const name=you.trim();
  $("#cta-heading").textContent=name?`Create a story, ${name}.`:"Create your story.";
  $("#name-label").textContent=name?`Nice to meet you, ${name}.`:"What should the characters call you?";
  const cta=$("#nav-cta");
  cta.firstElementChild.textContent=name?`Get the app, ${name}`:"Get the app";
  cta.classList.remove("is-named");
  if(name){void cta.offsetWidth;cta.classList.add("is-named");}
  if(protoMode==="play"&&currentStep===0&&!st.sheet)screen.innerHTML=V[0]();
}
// Apply the name once the visitor is done (Enter or tapping away), not on every keystroke.
const nameInput=$("#name");
const commitName=()=>{
  const v=nameInput.value.trim();
  const clean=v.charAt(0).toLocaleUpperCase()+v.slice(1);
  nameInput.value=clean;
  if(clean===you)return;
  you=clean;updatePersonalisation();
};
nameInput.addEventListener("change",commitName);
nameInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();commitName();nameInput.blur();}});
show(0);

// Phone status bar: real device time, connection and (where the browser allows) battery.
const sbTime=$("#sb-time"),sbWifi=$("#sb-wifi"),sbBattery=$("#sb-battery");
const tickClock=()=>{sbTime.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}).replace(/\s?[AP]M$/i,"");setTimeout(tickClock,60000-Date.now()%60000)};
tickClock();
const syncOnline=()=>sbWifi.classList.toggle("is-off",!navigator.onLine);
addEventListener("online",syncOnline);addEventListener("offline",syncOnline);syncOnline();
navigator.getBattery?.().then(b=>{const sync=()=>{sbBattery.style.setProperty("--lvl",b.level);sbBattery.classList.toggle("is-low",b.level<=.2&&!b.charging);sbBattery.classList.toggle("is-charging",b.charging)};["levelchange","chargingchange"].forEach(t=>b.addEventListener(t,sync));sync()}).catch(()=>{});

// votes
const v=[0,0,0];const o=$("#opts");
const draw=()=>{const t=v.reduce((a,b)=>a+b,0)||1;o.querySelectorAll("button").forEach((b,k)=>{const p=Math.round(v[k]/t*100);b.innerHTML=`<i style="width:${p}%"></i><span>${["Go in","Wait for Wren","Run"][k]}</span><span>${p}%</span>`})};
v[0]=3;v[1]=2;v[2]=1;draw();
o.onclick=e=>{const b=e.target.closest("button");if(!b)return;v.fill(0);v[b.dataset.v]=1;[0,1,2].forEach(k=>{if(k!=b.dataset.v)v[k]=k?1:2});draw()};
// Trending covers loop continuously only while in view. The original links remain usable.
const trending = document.querySelector(".feat-row");
const trendingTrack = document.createElement("div");
trendingTrack.className = "feat-track";
const trendCards = [...trending.children];
trendCards.forEach(card => trendingTrack.append(card));
trendCards.forEach(card => {
  const clone = card.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  clone.tabIndex = -1;
  trendingTrack.append(clone);
});
trending.append(trendingTrack);
let trendingVisible = false;
let trendingPaused = false;
let trendingUserPaused = false;
let trendingOffset = 0;
let trendingWidth = 1;
let trendingFrame = 0;
let trendingDragging = false;
let trendingPointerX = 0;
const trendingReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function measureTrending() {
  trendingWidth = trendingTrack.children[trendCards.length].offsetLeft - trendingTrack.children[0].offsetLeft;
  trendingOffset %= trendingWidth;
  trendingTrack.style.transform = `translate3d(${-trendingOffset}px,0,0)`;
}
function animateTrending(time) {
  const elapsed = trendingFrame ? Math.min(time - trendingFrame, 64) : 0;
  trendingFrame = time;
  if (trendingVisible && !trendingPaused && !trendingUserPaused && !trendingDragging && !document.hidden && !trendingReducedMotion.matches) {
    trendingOffset = (trendingOffset + elapsed * 0.028) % trendingWidth;
    trendingTrack.style.transform = `translate3d(${-trendingOffset}px,0,0)`;
  }
  requestAnimationFrame(animateTrending);
}
new IntersectionObserver(([entry]) => {
  trendingVisible = entry.isIntersecting;
  trendingFrame = 0;
}, {threshold: .15}).observe(trending);
trending.addEventListener("mouseenter", () => trendingPaused = true);
trending.addEventListener("mouseleave", () => trendingPaused = false);
trending.addEventListener("focusin", () => trendingPaused = true);
trending.addEventListener("focusout", event => {
  if (!trending.contains(event.relatedTarget)) trendingPaused = false;
});
trending.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  trendingDragging = true;
  trendingPointerX = event.clientX;
  trending.setPointerCapture(event.pointerId);
});
trending.addEventListener("pointermove", event => {
  if (!trendingDragging) return;
  trendingOffset = ((trendingOffset + trendingPointerX - event.clientX) % trendingWidth + trendingWidth) % trendingWidth;
  trendingPointerX = event.clientX;
  trendingTrack.style.transform = `translate3d(${-trendingOffset}px,0,0)`;
});
trending.addEventListener("pointerup", () => trendingDragging = false);
trending.addEventListener("pointercancel", () => trendingDragging = false);
window.addEventListener("resize", measureTrending);
measureTrending();
requestAnimationFrame(animateTrending);
// Seamless reader carousel: starts on view, loops without snapping back, and has no scrollbar.
const rail = document.getElementById("rail");
const track = document.createElement("div");
track.className = "rail-track";
const originalCards = [...rail.children];
originalCards.forEach(card => track.append(card));
originalCards.forEach(card => {
  const copy = card.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  copy.querySelectorAll("a, button, input, [tabindex]").forEach(el => el.tabIndex = -1);
  track.append(copy);
});
rail.append(track);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let railVisible = false;
let railUserPaused = false;
let railHovered = false;
let railFocused = false;
let dragging = false;
let offset = 0;
let lastFrame = 0;
let pointerX = 0;
let loopWidth = 1;

function measureRail() {
  // Gap after the last original card is included in the repeated track width.
  loopWidth = track.children[originalCards.length].offsetLeft - track.children[0].offsetLeft;
  offset = ((offset % loopWidth) + loopWidth) % loopWidth;
  track.style.transform = `translate3d(${-offset}px, 0, 0)`;
}
function animateRail(timestamp) {
  const elapsed = lastFrame ? Math.min(timestamp - lastFrame, 64) : 0;
  lastFrame = timestamp;
  if (railVisible && !railUserPaused && !document.hidden && !reducedMotion.matches && !railHovered && !railFocused && !dragging) {
    offset = (offset + elapsed * 0.035) % loopWidth;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }
  requestAnimationFrame(animateRail);
}
const railObserver = new IntersectionObserver(([entry]) => {
  railVisible = entry.isIntersecting;
  lastFrame = 0;
}, { threshold: 0.15 });
railObserver.observe(rail);
rail.addEventListener("mouseenter", () => { railHovered = true; });
rail.addEventListener("mouseleave", () => { railHovered = false; });
rail.addEventListener("focusin", () => { railFocused = true; });
rail.addEventListener("focusout", event => {
  if (!rail.contains(event.relatedTarget)) railFocused = false;
});
rail.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  dragging = true;
  pointerX = event.clientX;
  rail.setPointerCapture(event.pointerId);
});
rail.addEventListener("pointermove", event => {
  if (!dragging) return;
  offset = (((offset + pointerX - event.clientX) % loopWidth) + loopWidth) % loopWidth;
  pointerX = event.clientX;
  track.style.transform = `translate3d(${-offset}px, 0, 0)`;
});
function endRailDrag() { dragging = false; }
rail.addEventListener("pointerup", endRailDrag);
rail.addEventListener("pointercancel", endRailDrag);
rail.addEventListener("keydown", event => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  const step = originalCards[0].getBoundingClientRect().width + 20;
  offset = (((offset + (event.key === "ArrowRight" ? step : -step)) % loopWidth) + loopWidth) % loopWidth;
  track.style.transform = `translate3d(${-offset}px, 0, 0)`;
});
window.addEventListener("resize", measureRail);
measureRail();
requestAnimationFrame(animateRail);
// Switch images immediately after the first small scroll, with no crossfade.
const hoodScene = document.querySelector('.hood-art');
const updateHoodScene = () => {
  hoodScene.classList.toggle('is-scrolled', window.scrollY > 36);
};
window.addEventListener('scroll', updateHoodScene, {passive:true});
updateHoodScene();

// A lightweight, illustrative activity counter (not connected to live analytics).
const storyCount = document.getElementById("story-count");
let displayedStories = 1385775;
function advanceStoryCount() {
  // Simulated activity: irregular pauses, increments and timing.
  const increment = Math.random() < .16 ? 0 : 1 + Math.floor(Math.random() * 4);
  displayedStories += increment;
  storyCount.textContent = displayedStories.toLocaleString("en-GB");
  window.setTimeout(advanceStoryCount, 3500 + Math.random() * 6500);
}
window.setTimeout(advanceStoryCount, 3500 + Math.random() * 6500);
