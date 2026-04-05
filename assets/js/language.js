// const DEFAULT_LANG = 'fr';
// const SUPPORTED = ['fr', 'en'];

// async function loadTranslations(lang) {
//   // Chemin relatif pour fonctionner en local ET en production
//   const res = await fetch(`locales/${lang}.json`);
//   return res.json();
// }

// function applyTranslations(translations) {
//   // Texte / innerHTML
//   document.querySelectorAll('[data-i18n]').forEach(el => {
//     const key = el.getAttribute('data-i18n');
//     if (translations[key] !== undefined) {
//       el.innerHTML = translations[key];
//     }
//   });


//   document.querySelectorAll('[data-i18n-attr]').forEach(el => {
//     const pairs = el.getAttribute('data-i18n-attr').split(',');
//     pairs.forEach(pair => {
//       const [attr, key] = pair.trim().split(':');
//       if (translations[key] !== undefined) {
//         el.setAttribute(attr, translations[key]);
//       }
//     });
//   });
// }

// function getLang() {
//   const stored = localStorage.getItem('piqueou-lang');
//   if (stored && SUPPORTED.includes(stored)) return stored;
//   const browser = navigator.language.slice(0, 2);
//   return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
// }

// async function setLang(lang) {
//   localStorage.setItem('piqueou-lang', lang);
//   document.documentElement.lang = lang;
//   const translations = await loadTranslations(lang);
//   applyTranslations(translations);
//   // Met à jour l'état actif du switcher
//   document.querySelectorAll('.lang-switcher [data-lang]').forEach(btn => {
//     btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
//   });
// }

// document.addEventListener('DOMContentLoaded', async () => {
//   const lang = getLang();
//   await setLang(lang);

//   document.querySelectorAll('.lang-switcher [data-lang]').forEach(btn => {
//     btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
//   });
// });



// 1. Chargement des traductions
let translations = {};
 
async function loadTranslations() {
  translations = {
    fr: await fetch('./locales/fr.json').then(r => r.json()),
    en: await fetch('./locales/en.json').then(r => r.json())
  };
}
 
// 2. Déterminer la langue (localStorage ou défaut)
let lang = localStorage.getItem('lang') || 'fr';
 
// 3. Fonction qui injecte les textes sans recharger la page
const translate = () => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = translations[lang][el.dataset.i18n] || el.innerHTML;
  });
};
 
// 4. Fonction pour switcher (à appeler sur ton bouton)
window.switchLang = () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('lang', lang);
  translate();
};
 
// 5. Lancer au chargement — await obligatoire
document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations();
  translate();

  const select = document.getElementById("lang")
  if(select){
    select.value = lang
    select.addEventListener("change",()=>{
      lang = select.value;
      localStorage.setItem('lang', lang);
      translate();
      
    });

  }
});