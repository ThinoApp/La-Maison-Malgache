/* Checkout motion polish: state-driven, restrained, trust-first. */
(() => {
  const body = document.body;
  if (!body?.hasAttribute('data-checkout-page')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMode = window.matchMedia('(min-width:1001px)');
  const summary = document.querySelector('.checkout-summary');
  const summaryInner = document.querySelector('.checkout-summary__inner');
  const form = document.querySelector('#checkout-form');
  const steps = [...document.querySelectorAll('[data-checkout-step]')];
  let currentStep = 1;
  let lastTotal = document.querySelector('[data-summary-total]')?.textContent || '';
  let scrollRaf = 0;

  function getActiveStep(){
    const active = document.querySelector('[data-checkout-step]:not([hidden])');
    return Number(active?.dataset.checkoutStep || 1);
  }

  function setProgress(step){
    const p = Math.max(0, Math.min(1, (step - 1) / 3));
    document.documentElement.style.setProperty('--checkout-progress', String(p));
  }

  function refreshItemDelays(){
    document.querySelectorAll('.checkout-summary-item').forEach((item, index) => {
      item.style.setProperty('--checkout-item-delay', reduceMotion.matches ? '0ms' : `${110 + index * 70}ms`);
    });
  }

  function animateStep(next){
    if (next === currentStep) return;
    body.dataset.checkoutDirection = next === 4 ? 'confirm' : next > currentStep ? 'forward' : 'back';
    currentStep = next;
    setProgress(next);
    if (reduceMotion.matches) return;
    requestAnimationFrame(() => {
      const active = document.querySelector('[data-checkout-step]:not([hidden])');
      active?.classList.remove('is-active');
      void active?.offsetWidth;
      active?.classList.add('is-active');
    });
  }

  if ('MutationObserver' in window && steps.length) {
    const stepObserver = new MutationObserver(() => animateStep(getActiveStep()));
    steps.forEach((step) => stepObserver.observe(step,{attributes:true,attributeFilter:['hidden']}));
  }

  function pulseTotal(){
    if (reduceMotion.matches) return;
    summary?.classList.remove('is-total-changing');
    void summary?.offsetWidth;
    summary?.classList.add('is-total-changing');
    window.setTimeout(() => summary?.classList.remove('is-total-changing'), 500);
  }

  if (form) {
    form.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.name !== 'shipping') return;
      pulseTotal();
    });
  }

  const totalObserverTarget = document.querySelector('[data-summary-total]');
  if (totalObserverTarget && 'MutationObserver' in window) {
    new MutationObserver(() => {
      const next = totalObserverTarget.textContent || '';
      if (next === lastTotal) return;
      lastTotal = next;
      pulseTotal();
    }).observe(totalObserverTarget,{childList:true,subtree:true,characterData:true});
  }

  const summaryItemsTarget = document.querySelector('[data-summary-items]');
  if (summaryItemsTarget && 'MutationObserver' in window) {
    new MutationObserver(refreshItemDelays).observe(summaryItemsTarget,{childList:true,subtree:true});
  }

  function renderScroll(){
    scrollRaf = 0;
    if (reduceMotion.matches || !desktopMode.matches || !summaryInner) {
      document.documentElement.style.setProperty('--checkout-summary-shift','0px');
      document.documentElement.style.setProperty('--checkout-summary-scale','1');
      return;
    }
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / max));
    document.documentElement.style.setProperty('--checkout-summary-shift', `${(p * -10).toFixed(2)}px`);
    document.documentElement.style.setProperty('--checkout-summary-scale', String(1 - p * .006));
  }

  function requestScrollRender(){
    if (!scrollRaf) scrollRaf = requestAnimationFrame(renderScroll);
  }

  function syncPreferences(){
    refreshItemDelays();
    if (reduceMotion.matches) summary?.classList.remove('is-total-changing');
    requestScrollRender();
  }

  window.addEventListener('scroll', requestScrollRender, {passive:true});
  window.addEventListener('resize', requestScrollRender, {passive:true});
  reduceMotion.addEventListener?.('change', syncPreferences);
  desktopMode.addEventListener?.('change', syncPreferences);

  currentStep = getActiveStep();
  setProgress(currentStep);
  refreshItemDelays();
  renderScroll();
  requestAnimationFrame(() => body.classList.add('checkout-polish-ready'));
})();
