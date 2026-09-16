/* Shared accessibility helpers for Boutique, PDPs and Checkout. */
(() => {
  const body = document.body;
  const main = document.querySelector('main');
  if (!body || !main) return;

  if (!main.id) main.id = 'main-content';
  main.setAttribute('tabindex','-1');

  if (!document.querySelector('.lmm-skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'lmm-skip-link';
    skip.href = `#${main.id}`;
    skip.textContent = 'Aller au contenu';
    body.prepend(skip);
    skip.addEventListener('click', () => {
      requestAnimationFrame(() => main.focus({preventScroll:true}));
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const dialog = document.querySelector('#global-cart');
    if (dialog instanceof HTMLDialogElement && dialog.open && window.LMM_CART) {
      window.LMM_CART.close();
    }
  });
})();
