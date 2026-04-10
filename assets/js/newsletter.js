/**
 * newsletter.js — InfoLettre / Newsletter page
 * Loads from assets/js/newsLetter.json and renders cards with filter + stats.
 * Language-aware: re-renders when #lang select changes.
 */
(function () {
  'use strict';

  /* ── Icon & gradient map per document type ── */
  var TYPE_ICONS = {
    'Rule':                  'bi-file-earmark-ruled',
    'Proposed Rule':         'bi-file-earmark-text',
    'Notice':                'bi-bell',
    'Presidential Document': 'bi-building',
  };
  var TYPE_CSS = {
    'Rule':                  'type-rule',
    'Proposed Rule':         'type-proposed-rule',
    'Notice':                'type-notice',
    'Presidential Document': 'type-presidential',
  };

  /* ── Bilingual labels (independent of i18n JSON) ── */
  var LABELS = {
    fr: {
      'Rule': 'Règle',
      'Proposed Rule': 'Règle proposée',
      'Notice': 'Avis',
      'Presidential Document': 'Document présidentiel',
      'All': 'Tous',
      'read_more': 'Lire le document',
      'source': 'Federal Register',
      'total': 'Publications',
      'types': 'Types',
      'agencies': 'Agences',
      'no_results': 'Aucun résultat pour ce filtre.',
      'loading': 'Chargement des actualités…',
      'error': 'Erreur lors du chargement des actualités.',
    },
    en: {
      'Rule': 'Rule',
      'Proposed Rule': 'Proposed Rule',
      'Notice': 'Notice',
      'Presidential Document': 'Presidential Document',
      'All': 'All',
      'read_more': 'Read document',
      'source': 'Federal Register',
      'total': 'Publications',
      'types': 'Types',
      'agencies': 'Agencies',
      'no_results': 'No results for this filter.',
      'loading': 'Loading news…',
      'error': 'Error loading newsletter.',
    },
  };

  /* ── Helpers ── */
  function getLang() {
    var stored = localStorage.getItem('lang');
    return stored === 'en' ? 'en' : 'fr';
  }

  function t(key) {
    var l = getLang();
    return (LABELS[l] && LABELS[l][key]) || LABELS.fr[key] || key;
  }

  function truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '\u2026' : str;
  }

  function agencyName(doc) {
    return (doc.agencies && doc.agencies.length)
      ? doc.agencies[0].name
      : t('source');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    var lang = getLang();
    return d.toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  /* ── Card renderer ── */
  function renderCard(doc) {
    var typeClass = TYPE_CSS[doc.type]   || 'type-other';
    var typeIcon  = TYPE_ICONS[doc.type] || 'bi-file-earmark';
    var typeLabel = t(doc.type) || doc.type || '';
    var agency    = truncate(agencyName(doc), 45);
    var title     = truncate(doc.title, 110);
    var abstract  = truncate(doc.abstract, 200);
    var url       = doc.html_url || '#';
    var docNum    = doc.document_number || '';
    var date      = formatDate(doc.publication_date);

    return (
      '<div class="col-lg-4 col-md-6">' +
        '<article class="showcase-card h-100">' +
          '<div class="card-image">' +
            '<div class="doc-visual ' + typeClass + '">' +
              '<i class="bi ' + typeIcon + '"></i>' +
              (docNum ? '<span class="doc-number">' + docNum + '</span>' : '') +
            '</div>' +
            '<span class="card-badge">' + typeLabel + '</span>' +
          '</div>' +
          '<div class="card-body d-flex flex-column">' +
            '<div class="card-meta">' +
              '<span class="meta-client"><i class="bi bi-building"></i> ' + agency + '</span>' +
              '<span class="meta-date">' + date + '</span>' +
            '</div>' +
            '<h3 class="card-title">' + title + '</h3>' +
            (abstract ? '<p class="card-text">' + abstract + '</p>' : '') +
            '<div class="card-tags mt-auto">' +
              '<span class="tag">' + t('source') + '</span>' +
              (typeLabel ? '<span class="tag">' + typeLabel + '</span>' : '') +
            '</div>' +
            '<a href="' + url + '" target="_blank" rel="noopener" class="card-read-more">' +
              t('read_more') + ' <i class="bi bi-arrow-right"></i>' +
            '</a>' +
          '</div>' +
        '</article>' +
      '</div>'
    );
  }

  /* ── State ── */
  var allResults = [];
  var activeType = '';

  /* ── Render functions ── */
  function renderStats() {
    var el = document.getElementById('newsletter-stats');
    if (!el) return;
    var types = {}, agencies = {};
    allResults.forEach(function (r) {
      if (r.type) types[r.type] = 1;
      agencies[agencyName(r)] = 1;
    });
    el.innerHTML =
      '<div class="stat"><strong>' + allResults.length + '</strong><span>' + t('total') + '</span></div>' +
      '<div class="stat"><strong>' + Object.keys(types).length + '</strong><span>' + t('types') + '</span></div>' +
      '<div class="stat"><strong>' + Object.keys(agencies).length + '</strong><span>' + t('agencies') + '</span></div>';
  }

  function renderFilters() {
    var bar = document.getElementById('newsletter-filters');
    if (!bar) return;
    var types = [];
    allResults.forEach(function (r) {
      if (r.type && types.indexOf(r.type) === -1) types.push(r.type);
    });
    bar.innerHTML =
      '<button class="' + (activeType === '' ? 'active' : '') + '" data-filter="">' + t('All') + '</button>' +
      types.map(function (tp) {
        return '<button class="' + (activeType === tp ? 'active' : '') + '" data-filter="' + tp + '">' +
          (t(tp) || tp) + '</button>';
      }).join('');

    bar.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeType = btn.getAttribute('data-filter');
        renderFilters();
        renderCards();
      });
    });
  }

  function renderCards() {
    var container = document.getElementById('newsletter-cards');
    if (!container) return;
    var filtered = activeType
      ? allResults.filter(function (r) { return r.type === activeType; })
      : allResults;

    if (!filtered.length) {
      container.innerHTML =
        '<div class="newsletter-state col-12">' +
          '<i class="bi bi-inbox"></i>' +
          '<p>' + t('no_results') + '</p>' +
        '</div>';
      return;
    }
    container.innerHTML = filtered.map(renderCard).join('');
    if (window.AOS) AOS.refresh();
  }

  function renderAll() {
    renderStats();
    renderFilters();
    renderCards();
  }

  /* ── Bootstrap ── */
  function init() {
    var cardsEl = document.getElementById('newsletter-cards');
    if (!cardsEl) return; // not on newsletter page

    fetch('assets/js/newsLetter.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        allResults = data.results || [];
        renderAll();
      })
      .catch(function () {
        if (cardsEl) {
          cardsEl.innerHTML =
            '<div class="newsletter-state col-12">' +
              '<i class="bi bi-exclamation-circle"></i>' +
              '<p>' + t('error') + '</p>' +
            '</div>';
        }
      });

    /* Re-render when language is switched via the select */
    var langSelect = document.getElementById('lang');
    if (langSelect) {
      langSelect.addEventListener('change', function () {
        setTimeout(renderAll, 80); /* slight delay so language.js updates localStorage first */
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
