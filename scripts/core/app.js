document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('jtac-root');
  if (!root) return;

  document.querySelectorAll('.bottom-nav__item').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bottom-nav__item').forEach((b) => {
        b.classList.toggle('bottom-nav__item--active', b === btn);
      });
    });
  });
});

