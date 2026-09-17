/* Shared-element geometry: story arch -> storytelling media. */
ensureMotionStylesheet('shared-transition.css', 'shared-transition');

if (!reduceMotion.matches && window.matchMedia('(min-width:1001px)').matches) {
  const sourceSection = document.querySelector('.story');
  const sourceCard = document.querySelector('.story .arch-card');
  const sourceImage = sourceCard?.querySelector('img');
  const destinationSection = document.querySelector('.storytelling');
  const destinationMedia = document.querySelector('.story-media');

  if (sourceSection && sourceCard && sourceImage && destinationSection && destinationMedia && !document.querySelector('.shared-story-zone')) {
    const zone = document.createElement('span');
    zone.className = 'shared-story-zone';
    destinationSection.prepend(zone);

    const ghost = document.createElement('div');
    ghost.className = 'shared-story-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    const ghostImage = document.createElement('img');
    ghostImage.src = sourceImage.currentSrc || sourceImage.src;
    ghostImage.alt = '';
    ghostImage.decoding = 'async';
    ghost.appendChild(ghostImage);
    document.body.appendChild(ghost);

    const seam = document.createElement('div');
    seam.className = 'shared-story-seam';
    seam.setAttribute('aria-hidden', 'true');
    document.body.appendChild(seam);

    let active = false;
    let raf = 0;
    let sourceRect = null;
    let sourceRadius = 44;
    let pageVisible = document.visibilityState !== 'hidden';

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const lerp = (from, to, progress) => from + (to - from) * progress;
    const ease = (value) => value < .5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

    function readRadius() {
      const radius = Number.parseFloat(getComputedStyle(sourceCard).borderTopLeftRadius);
      return Number.isFinite(radius) ? radius : 44;
    }

    function captureSource() {
      sourceRect = sourceCard.getBoundingClientRect();
      sourceRadius = readRadius();
    }

    function setTransitionState(progress) {
      destinationSection.style.setProperty('--shared-progress', progress.toFixed(4));
      sourceSection.style.setProperty('--shared-progress', progress.toFixed(4));
      seam.style.setProperty('--seam-distance', (Math.abs(progress - .5) * 2).toFixed(4));
    }

    function render() {
      raf = 0;
      if (!active || !pageVisible) return;

      const destinationRect = destinationMedia.getBoundingClientRect();
      const destinationTop = destinationSection.getBoundingClientRect().top;
      const viewport = Math.max(1, window.innerHeight);
      const startAt = viewport * .94;
      const endAt = viewport * .05;
      const rawProgress = clamp((startAt - destinationTop) / (startAt - endAt));
      const progress = ease(rawProgress);

      if (!sourceRect || rawProgress < .025) captureSource();
      if (!sourceRect) return;

      const left = lerp(sourceRect.left, destinationRect.left, progress);
      const top = lerp(sourceRect.top, destinationRect.top, progress);
      const width = lerp(sourceRect.width, destinationRect.width, progress);
      const height = lerp(sourceRect.height, destinationRect.height, progress);
      const radius = lerp(sourceRadius, 0, clamp((progress - .18) / .72));
      const lift = Math.sin(progress * Math.PI) * -18;

      ghost.style.left = `${left.toFixed(2)}px`;
      ghost.style.top = `${(top + lift).toFixed(2)}px`;
      ghost.style.width = `${Math.max(1, width).toFixed(2)}px`;
      ghost.style.height = `${Math.max(1, height).toFixed(2)}px`;
      ghost.style.borderRadius = `${Math.max(0, radius).toFixed(2)}px`;
      ghost.style.setProperty('--ghost-progress', progress.toFixed(4));

      const imageScale = lerp(1.035, 1.005, progress);
      const imageBrightness = lerp(.96, .82, clamp((progress - .55) / .45));
      ghostImage.style.transform = `scale(${imageScale.toFixed(4)}) translate3d(0,${lerp(0,-1.4,progress).toFixed(2)}%,0)`;
      ghostImage.style.filter = `saturate(${lerp(.96,.82,progress).toFixed(3)}) contrast(1.015) brightness(${imageBrightness.toFixed(3)})`;

      setTransitionState(progress);

      const visible = rawProgress > .005 && rawProgress < .995;
      ghost.classList.toggle('is-active', visible);
      seam.classList.toggle('is-active', visible);
      ghost.style.opacity = rawProgress >= .985
        ? String(clamp((1 - rawProgress) / .015))
        : rawProgress <= .04
          ? String(clamp(rawProgress / .04))
          : '1';
    }

    function requestRender() {
      if (!active || !pageVisible || raf) return;
      raf = requestAnimationFrame(render);
    }

    const zoneObserver = new IntersectionObserver((entries) => {
      const shouldActivate = entries.some((entry) => entry.isIntersecting);
      if (shouldActivate === active) return;
      active = shouldActivate;
      sourceSection.classList.toggle('shared-transition-active', active);
      destinationSection.classList.toggle('shared-transition-active', active);
      ghost.classList.toggle('is-active', active);
      seam.classList.toggle('is-active', active);

      if (active) {
        captureSource();
        render();
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        ghost.classList.remove('is-active');
        seam.classList.remove('is-active');
        setTransitionState(destinationSection.getBoundingClientRect().top <= window.innerHeight * .05 ? 1 : 0);
      }
    }, { rootMargin:'95% 0px 5% 0px', threshold:0 });

    zoneObserver.observe(zone);
    window.addEventListener('scroll', requestRender, { passive:true });
    window.addEventListener('resize', () => {
      sourceRect = null;
      requestRender();
    }, { passive:true });
    document.addEventListener('visibilitychange', () => {
      pageVisible = document.visibilityState !== 'hidden';
      if (!pageVisible) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        requestRender();
      }
    });
  }
}
