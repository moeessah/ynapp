/* Rewind demo: plays while the card is at least half on screen, stops when it leaves,
   and starts again from the top when it comes back. Reduced-motion visitors keep the static frame. */
(() => {
  const tile = document.querySelector('[data-rewind-demo]');
  if (!tile || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const thread = tile.querySelector('.rw-thread');
  const typed = tile.querySelector('.rw-typed');
  const take = tile.querySelector('.rw-take');
  const btn = tile.querySelector('.rw-btn');
  const OPENER = '“You weren’t supposed to find this.”';
  const TAKES = [
    { you: '“Then tell me why.”', them: '“Because I was trying to protect you.”', mood: 'Dante softens', cool: false },
    { you: '“Who else knows?”', them: '“Nobody. Yet.”', mood: 'Dante pulls away', cool: true }
  ];
  const CANCEL = Symbol('cancel');
  let run = 0, inView = false;

  const node = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls; if (text) n.textContent = text; return n; };
  const bubble = (who, text) => { const b = node('div', 'rw-b ' + who, text); thread.append(b); return b; };
  const dots = () => { const b = node('div', 'rw-b them rw-dots'); b.innerHTML = '<span></span><span></span><span></span>'; thread.append(b); return b; };
  const chip = t => { const c = node('div', 'rw-chip' + (t.cool ? ' cool' : '')); c.innerHTML = '<i></i>'; c.append(t.mood); thread.append(c); return c; };
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const setTake = n => { take.textContent = 'Take ' + n; if (n > 1) restart(take, 'roll'); else take.classList.remove('roll'); };
  const reset = () => {
    thread.replaceChildren(); thread.classList.remove('fade');
    typed.textContent = ''; typed.classList.remove('typing');
    setTake(1);
  };

  async function play(id) {
    const wait = ms => new Promise(r => setTimeout(r, ms)).then(() => { if (id !== run) throw CANCEL; });
    const type = async text => {
      typed.classList.add('typing');
      for (const ch of text) { typed.textContent += ch; await wait(36 + Math.random() * 40); }
    };
    const unplay = async n => { n.classList.add('out'); await wait(230); n.remove(); };
    try {
      for (;;) {
        reset(); await wait(500);
        const d = dots(); await wait(1000); d.remove();
        bubble('them', OPENER); await wait(900);
        for (let i = 0; i < TAKES.length; i++) {
          const t = TAKES[i];
          if (i > 0) {
            restart(btn, 'is-press'); await wait(320);
            for (const n of [...thread.children].slice(1).reverse()) await unplay(n);
            setTake(i + 1); await wait(450);
          }
          await type(t.you); await wait(350);
          typed.textContent = ''; typed.classList.remove('typing');
          bubble('me', t.you); await wait(500);
          const d2 = dots(); await wait(1200); d2.remove();
          bubble('them', t.them); await wait(450);
          chip(t);
          await wait(i === TAKES.length - 1 ? 3200 : 1900);
        }
        thread.classList.add('fade'); await wait(500);
      }
    } catch (e) { if (e !== CANCEL) throw e; }
  }

  const start = () => play(++run);
  const stop = () => { run++; };

  reset();
  new IntersectionObserver(([e]) => {
    if (e.intersectionRatio >= 0.5 && !inView) { inView = true; if (!document.hidden) start(); }
    else if (e.intersectionRatio < 0.15 && inView) { inView = false; stop(); }
  }, { threshold: [0, 0.15, 0.5] }).observe(tile);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (inView) start();
  });
})();
