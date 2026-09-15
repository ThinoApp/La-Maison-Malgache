/* Checkout motion polish: state-driven, restrained, trust-first. */
(() => {
  const body = document.body;
  if (!body?.hasAttribute('data-checkout-page')) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width:1001px)').matches;
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
      item.style.setProperty('--checkout-item-delay', `${110 + index * 70}ms`);
    });
  }

  function animateStep(next){
    if (next === currentStep) return;
    body.dataset.checkoutDirection = next === 4 ? 'confirm' : next > currentStep ? 'forward' : 'back';
    currentStep = next;
    setProgress(next);
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

  if (form) {
    form.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.name !== 'shipping') return;
      summary?.classList.remove('is-total-changing');
      void summary?.offsetWidth;
      summary?.classList.add('is-total-changing');
      window.setTimeout(() => summary?.classList.remove('is-total-changing'), 500);
    });
  }

  const totalObserverTarget = document.querySelector('[data-summary-total]');
  if (totalObserverTarget && 'MutationObserver' in window) {
    new MutationObserver(() => {
      const next = totalObserverTarget.textContent || '';
      if (next === lastTotal) return;
      lastTotal = next;
      summary?.classList.remove('is-total-changing');
      void summary?.offsetWidth;
      summary?.classList.add('is-total-changing');
      window.setTimeout(() => summary?.classList.remove('is-total-changing'), 500);
    }).observe(totalObserverTarget,{childList:true,subtree:true,characterData:true});
  }

  const summaryItemsTarget = document.querySelector('[data-summary-items]');
  if (summaryItemsTarget && 'MutationObserver' in window) {
    new MutationObserver(refreshItemDelays).observe(summaryItemsTarget,{childList:true,subtree:true});
  }

  function renderScroll(){
    scrollRaf = 0;
    if (reduce || !desktop || !summaryInner) return;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / max));
    document.documentElement.style.setProperty('--checkout-summary-shift', `${(p * -10).toFixed(2)}px`);
    document.documentElement.style.setProperty('--checkout-summary-scale', String(1 - p * .006));
  }

  window.addEventListener('scroll', () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(renderScroll);
  }, {passive:true});
  window.addEventListener('resize', () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(renderScroll);
  }, {passive:true});

  currentStep = getActiveStep();
  setProgress(currentStep);
  refreshItemDelays();
  renderScroll();
  requestAnimationFrame(() => body.classList.add('checkout-polish-ready'));
})();
