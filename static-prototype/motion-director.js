/* Global motion director: one dominant attraction at a time, with adaptive quality. */
(() => {
  const body = document.body;
  if (!body) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  const balanced = cores <= 4 || memory <= 4;

  body.dataset.motionQuality = reduced ? 'reduced' : balanced ? 'balanced' : 'high';

  if (reduced) {
    body.dataset.motionFocus = 'quiet';
    return;
  }

  const focusMap = new Map([
    ['top', 'hero'],
    ['story', 'bridge'],
    ['storytelling', 'narrative'],
    ['universes', 'gallery'],
    ['craft', 'material'],
    ['madagascar', 'territory'],
    ['closing', 'closing']
  ]);

  const sections = [...document.querySelectorAll('#top,#story,#storytelling,#universes,#craft,#madagascar,#closing')];
  let focusTimer = 0;

  function setFocus(focus) {
    if (!focus || body.dataset.motionFocus === focus) return;
    body.dataset.motionFocus = focus;
    body.classList.add('motion-focus-changing');
    clearTimeout(focusTimer);
    focusTimer = window.setTimeout(() => body.classList.remove('motion-focus-changing'), 320);
  }

  if ('IntersectionObserver' in window && sections.length) {
    const focusObserver = new IntersectionObserver((entries) => {
      const entering = entries.find((entry) => entry.isIntersecting);
      if (!entering) return;
      setFocus(focusMap.get(entering.target.id) || 'quiet');
    }, {
      rootMargin: '-49% 0px -49% 0px',
      threshold: 0
    });
    sections.forEach((section) => focusObserver.observe(section));
  } else {
    setFocus('hero');
  }

  const bridge = document.querySelector('.story');
  const narrative = document.querySelector('.storytelling');

  if ('MutationObserver' in window && bridge && narrative) {
    const syncSharedState = () => {
      const active = bridge.classList.contains('shared-transition-active') || narrative.classList.contains('shared-transition-active');
      body.classList.toggle('is-shared-transitioning', active);
    };
    const sharedObserver = new MutationObserver(syncSharedState);
    sharedObserver.observe(bridge, { attributes:true, attributeFilter:['class'] });
    sharedObserver.observe(narrative, { attributes:true, attributeFilter:['class'] });
    syncSharedState();
  }

  document.addEventListener('visibilitychange', () => {
    body.classList.toggle('motion-page-hidden', document.hidden);
  });
})();
