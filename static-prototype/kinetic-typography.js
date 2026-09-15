/* Word-level kinetic typography. Runs once, then CSS scroll timelines do the motion. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const patterns = [
    { x:-22, y:20, r:-2.4, s:.955, track:-.018 },
    { x:18, y:-12, r:1.7, s:1.035, track:.012 },
    { x:-10, y:26, r:-1.15, s:.975, track:.006 },
    { x:24, y:10, r:2.05, s:.965, track:-.008 },
    { x:-16, y:-8, r:-1.6, s:1.025, track:.016 },
    { x:12, y:22, r:.95, s:.98, track:-.012 }
  ];

  const titleTargets = [
    document.querySelector('.hero h1'),
    document.querySelector('.story h2'),
    document.querySelector('.universes .section-head h2'),
    document.querySelector('.craft h2'),
    document.querySelector('.madagascar-copy h2'),
    document.querySelector('.closing h2')
  ].filter(Boolean);

  function normalizeLabel(element) {
    return (element.getAttribute('aria-label') || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function wrapTextNode(node, state) {
    const parts = node.nodeValue.split(/(\s+)/);
    const fragment = document.createDocumentFragment();

    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }

      const pattern = patterns[(state.index + state.seed) % patterns.length];
      const word = document.createElement('span');
      word.className = 'kinetic-word';
      word.setAttribute('aria-hidden', 'true');
      word.textContent = part;

      const xOut = Math.round(pattern.x * -.42);
      const yOut = Math.round(pattern.y * -.32);
      const rOut = +(pattern.r * -.28).toFixed(2);

      word.style.setProperty('--kinetic-x', `${pattern.x}px`);
      word.style.setProperty('--kinetic-y', `${pattern.y}px`);
      word.style.setProperty('--kinetic-r', `${pattern.r}deg`);
      word.style.setProperty('--kinetic-s', String(pattern.s));
      word.style.setProperty('--kinetic-track', `${pattern.track}em`);
      word.style.setProperty('--kinetic-x-out', `${xOut}px`);
      word.style.setProperty('--kinetic-y-out', `${yOut}px`);
      word.style.setProperty('--kinetic-r-out', `${rOut}deg`);
      word.style.setProperty('--kinetic-index', String(state.index));

      state.words.push(word);
      state.index += 1;
      fragment.appendChild(word);
    });

    node.replaceWith(fragment);
  }

  function walkAndWrap(root, state) {
    [...root.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue.trim()) wrapTextNode(node, state);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.classList.contains('kinetic-word')) return;
      walkAndWrap(node, state);
    });
  }

  titleTargets.forEach((title, titleIndex) => {
    if (title.dataset.kineticReady === 'true') return;

    const label = normalizeLabel(title);
    if (!label) return;

    title.dataset.kineticReady = 'true';
    title.classList.add('kinetic-title');
    title.setAttribute('aria-label', label);

    const state = { index:0, seed:titleIndex * 2, words:[] };
    walkAndWrap(title, state);

    if (state.words.length) {
      const focusIndex = Math.min(
        state.words.length - 1,
        Math.max(0, Math.floor(state.words.length * .62))
      );
      state.words[focusIndex].classList.add('is-kinetic-focus');
    }
  });
})();
