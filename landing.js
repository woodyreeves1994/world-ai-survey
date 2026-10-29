(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('#motion-toggle');
  let reduced = preference.matches;
  let manual = false;
  const update = () => {
    document.documentElement.classList.toggle('reduce-motion', reduced);
    button.setAttribute('aria-pressed', String(reduced));
    button.setAttribute('aria-label', reduced ? 'Resume animations' : 'Pause animations');
    button.title = reduced ? 'Resume animations' : 'Pause animations';
  };
  button.addEventListener('click', () => { manual = true; reduced = !reduced; update(); });
  preference.addEventListener('change', event => { if (!manual) { reduced = event.matches; update(); } });
  update();
})();
