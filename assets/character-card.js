const featureCharacterImage = document.querySelector('.feature-character-img');
if (featureCharacterImage) {
  const featureCharacterSources = ['people/card-lucien.webp','people/card-rhett.webp','people/card-nova.webp','people/card-elara.webp','people/card-jude.webp','people/card-cassian.webp','people/card-seraphine.webp','people/card-ambrose.webp','people/card-koa.webp','people/card-valeria.webp','people/card-dorian.webp'];
  let featureCharacterIndex = 0;
  let featureCharacterVisible = false;
  let featureCharacterPaused = false;
  const featureCard = featureCharacterImage.closest('.tile');
  const featureObserver = new IntersectionObserver(entries => {
    featureCharacterVisible = entries[0].isIntersecting;
  }, { threshold: 0.25 });
  featureObserver.observe(featureCard);
  featureCard.addEventListener('mouseenter', () => { featureCharacterPaused = true; });
  featureCard.addEventListener('mouseleave', () => { featureCharacterPaused = false; });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      if (!featureCharacterVisible || featureCharacterPaused || document.hidden) return;
      featureCharacterIndex = (featureCharacterIndex + 1) % featureCharacterSources.length;
      featureCharacterImage.src = featureCharacterSources[featureCharacterIndex];
    }, 3800);
  }
}
