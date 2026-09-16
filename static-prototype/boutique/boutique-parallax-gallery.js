/* Native scroll-driven parallax gallery for the static Boutique. */
(() => {
  const section = document.querySelector('[data-parallax-gallery]');
  if (!section) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width:900px)');
  const track = section.querySelector('[data-gallery-track]');
  const slides = [...section.querySelectorAll('[data-gallery-slide]')];
  const inners = [...section.querySelectorAll('[data-gallery-inner]')];
  const leftTrack = section.querySelector('[data-gallery-thumbs-left]');
  const rightTrack = section.querySelector('[data-gallery-thumbs-right]');
  const counterCurrent = section.querySelector('[data-gallery-current]');
  const counterTotal = section.querySelector('[data-gallery-total]');
  const caption = section.querySelector('[data-gallery-caption]');
  const captionIndex = section.querySelector('[data-gallery-caption-index]');
  const captionTitle = section.querySelector('[data-gallery-caption-title]');
  const captionMeta = section.querySelector('[data-gallery-caption-meta]');
  const total = slides.length;
  let activeIndex = 0;
  let raf = 0;
  let snapTimer = 0;
  let captionTimer = 0;
  let snapping = false;
  let pointerActive = false;

  if (!total || !track) return;
  if (counterTotal) counterTotal.textContent = String(total).padStart(2,'0');

  const labels = slides.map((slide) => ({
    title: slide.dataset.galleryTitle || '',
    meta: slide.dataset.galleryMeta || ''
  }));

  function clamp(value,min,max){ return Math.min(max,Math.max(min,value)); }

  function setActive(index){
    const safe = clamp(index,0,total - 1);
    if (safe === activeIndex && section.dataset.galleryReady === 'true') return;
    activeIndex = safe;
    section.dataset.galleryReady = 'true';
    if (counterCurrent) counterCurrent.textContent = String(safe + 1).padStart(2,'0');
    if (captionIndex) captionIndex.textContent = String(safe + 1).padStart(2,'0');

    clearTimeout(captionTimer);
    caption?.classList.add('is-changing');
    captionTimer = window.setTimeout(() => {
      if (captionTitle) captionTitle.textContent = labels[safe]?.title || '';
      if (captionMeta) captionMeta.textContent = labels[safe]?.meta || '';
      caption?.classList.remove('is-changing');
    }, reduce.matches ? 0 : 130);

    slides.forEach((slide,i) => {
      if (i === safe) slide.setAttribute('aria-current','true');
      else slide.removeAttribute('aria-current');
    });
  }

  function metrics(){
    const slideW = slides[0]?.getBoundingClientRect().width || 1;
    const thumb = section.querySelector('.parallax-gallery__thumb');
    const thumbW = thumb?.getBoundingClientRect().width || 1;
    return { slideW, thumbItem:thumbW + 12 };
  }

  function applyPosition(pos){
    const { slideW, thumbItem } = metrics();
    track.style.transform = `translate3d(${(-pos * slideW).toFixed(2)}px,0,0)`;
    inners.forEach((inner,index) => {
      const dist = index - pos;
      const abs = Math.min(Math.abs(dist),1);
      const rotation = (dist >= 0 ? 1 : -1) * abs * 6;
      const scale = 1 + abs * .2;
      inner.style.transform = `rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      const img = inner.querySelector('img');
      if (img) img.style.transform = `translate3d(${(-dist * 7).toFixed(2)}%,0,0) scale(1.04)`;
    });
    if (leftTrack) leftTrack.style.transform = `translate3d(${(-pos * thumbItem).toFixed(2)}px,-50%,0)`;
    if (rightTrack) rightTrack.style.transform = `translate3d(${(-(pos + 1) * thumbItem).toFixed(2)}px,-50%,0)`;
    section.style.setProperty('--gallery-progress', String(total > 1 ? pos / (total - 1) : 0));
    setActive(Math.round(pos));
  }

  function progressPosition(){
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - innerHeight);
    const progressed = clamp(-rect.top / travel,0,1);
    return progressed * Math.max(0,total - 1);
  }

  function render(){
    raf = 0;
    if (reduce.matches || compact.matches) return;
    applyPosition(progressPosition());
  }

  function requestRender(){
    if (!raf) raf = requestAnimationFrame(render);
  }

  function snapToNearest(){
    if (reduce.matches || compact.matches || snapping || pointerActive || total <= 1) return;
    const rect = section.getBoundingClientRect();
    const fullyTraversing = rect.top < -innerHeight * .12 && rect.bottom > innerHeight * 1.12;
    if (!fullyTraversing) return;

    const travel = Math.max(1, section.offsetHeight - innerHeight);
    const pos = progressPosition();
    const targetIndex = Math.round(pos);
    const distance = Math.abs(pos - targetIndex);
    if (distance < .045 || distance > .34) return;

    const sectionTop = scrollY + rect.top;
    const targetY = sectionTop + (targetIndex / (total - 1)) * travel;
    snapping = true;
    window.scrollTo({top:targetY,behavior:'smooth'});
    window.setTimeout(() => { snapping = false; }, 520);
  }

  function scheduleSnap(){
    clearTimeout(snapTimer);
    snapTimer = window.setTimeout(snapToNearest,220);
  }

  function resetTransforms(){
    track.style.transform = '';
    inners.forEach((inner) => {
      inner.style.transform = '';
      inner.querySelector('img')?.style.removeProperty('transform');
    });
    leftTrack?.style.removeProperty('transform');
    rightTrack?.style.removeProperty('transform');
    section.style.setProperty('--gallery-progress','0');
  }

  function applyMode(){
    clearTimeout(snapTimer);
    snapping = false;
    section.classList.toggle('is-static', reduce.matches);
    section.classList.toggle('is-compact', !reduce.matches && compact.matches);
    if (reduce.matches || compact.matches) resetTransforms();
    else requestRender();
  }

  window.addEventListener('scroll', () => {
    requestRender();
    scheduleSnap();
  }, {passive:true});
  window.addEventListener('resize', requestRender, {passive:true});
  window.addEventListener('pointerdown', () => { pointerActive = true; clearTimeout(snapTimer); }, {passive:true});
  window.addEventListener('pointerup', () => { pointerActive = false; }, {passive:true});
  window.addEventListener('pointercancel', () => { pointerActive = false; }, {passive:true});
  reduce.addEventListener?.('change', applyMode);
  compact.addEventListener?.('change', applyMode);

  setActive(0);
  applyMode();
  requestAnimationFrame(() => section.classList.add('is-gallery-ready'));
})();
