const DEFAULT_LANG = 'fr';
const SUPPORTED = ['fr', 'en'];

async function loadTranslations(lang) {
  // Chemin relatif pour fonctionner en local ET en production
  const res = await fetch(`locales/${lang}.json`);
  return res.json();
}

function applyTranslations(translations) {
  // Texte / innerHTML
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] !== undefined) {
      el.innerHTML = translations[key];
    }
  });


  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const pairs = el.getAttribute('data-i18n-attr').split(',');
    pairs.forEach(pair => {
      const [attr, key] = pair.trim().split(':');
      if (translations[key] !== undefined) {
        el.setAttribute(attr, translations[key]);
      }
    });
  });
}

function getLang() {
  const stored = localStorage.getItem('piqueou-lang');
  if (stored && SUPPORTED.includes(stored)) return stored;
  const browser = navigator.language.slice(0, 2);
  return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
}

async function setLang(lang) {
  localStorage.setItem('piqueou-lang', lang);
  document.documentElement.lang = lang;
  const translations = await loadTranslations(lang);
  applyTranslations(translations);
  // Met à jour l'état actif du switcher
  document.querySelectorAll('.lang-switcher [data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const lang = getLang();
  await setLang(lang);

  document.querySelectorAll('.lang-switcher [data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
  });
});
