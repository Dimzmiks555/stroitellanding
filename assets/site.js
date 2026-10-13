const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (toggle && navigation) {
  toggle.hidden = false;
  document.querySelector('.header').classList.add('menu-ready');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > innerHeight) { element.classList.add('is-pending'); observer.observe(element); }
  });
}
const photos = [...document.querySelectorAll('[data-gallery]')];
const dialog = document.querySelector('.lightbox');
if (dialog && typeof dialog.showModal === 'function' && photos.length) {
  let active = 0;
  const show = index => {
    active = (index + photos.length) % photos.length;
    const link = photos[active];
    const image = dialog.querySelector('.lightbox-image');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    dialog.querySelector('[data-gallery-caption]').textContent = link.dataset.caption;
    dialog.querySelector('[data-gallery-count]').textContent = `${String(active + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  };
  photos.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); show(index); dialog.showModal(); document.body.classList.add('modal-open');
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.gallery-prev').addEventListener('click', () => show(active - 1));
  dialog.querySelector('.gallery-next').addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
}
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
