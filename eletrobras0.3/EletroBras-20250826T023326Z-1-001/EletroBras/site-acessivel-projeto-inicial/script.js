// Alternância de tema claro/escuro
document.addEventListener('DOMContentLoaded', function () {
  const html = document.documentElement;
  const btn = document.getElementById('toggle-theme');
  const icon = document.getElementById('theme-icon');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  if (btn) {
    btn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Mantém o ícone correto ao recarregar
  setTheme(html.getAttribute('data-theme') || 'light');
});