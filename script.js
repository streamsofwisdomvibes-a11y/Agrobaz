const menuToggle = document.querySelector('.menu-toggle');
const topbar = document.querySelector('.topbar');
const themeToggle = document.querySelector('.theme-toggle');

if (menuToggle && topbar) {
  menuToggle.addEventListener('click', () => {
    topbar.classList.toggle('open');
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    topbar?.classList.remove('open');
  });
});

const savedTheme = localStorage.getItem('agrobaz-theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
if (themeToggle) {
  themeToggle.textContent = savedTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('agrobaz-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
