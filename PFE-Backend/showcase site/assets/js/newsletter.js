const NEWSLETTER_CONFIG = {
  cacheTTL: 60 * 60 * 1000, 
  cacheKey: 'piqueou_news_v1',
  maxCards: 24,

  feeds: [
    { url: 'https://feeds.feedburner.com/TheHackersNews',   label: 'The Hacker News',  color: '#185FA5', bg: '#E6F1FB' },
    { url: 'https://www.cisa.gov/news.xml',                 label: 'CISA',             color: '#3B6D11', bg: '#EAF3DE' },
    { url: 'https://www.bleepingcomputer.com/feed/',        label: 'BleepingComputer', color: '#993C1D', bg: '#FAECE7' },
    { url: 'https://www.darkreading.com/rss.xml',           label: 'Dark Reading',     color: '#534AB7', bg: '#EEEDFE' },
    { url: 'https://krebsonsecurity.com/feed/',             label: 'Krebs on Security',color: '#854F0B', bg: '#FAEEDA' },
    { url: 'https://feeds.feedburner.com/Securityweek',     label: 'SecurityWeek',     color: '#0F6E56', bg: '#E1F5EE' },
  ],

  
  keywords: [
    'compliance','gdpr','iso 27001','nist','sox','hipaa','pci dss','audit',
    'governance','risk management','regulation','framework','ciso','policy',
    'vulnerability','cve','patch','zero-day','exploit','ransomware','breach',
    'malware','phishing','attack','incident','threat','cybersecurity','data protection',
    'security operations','soc','pen test','third-party risk','supply chain',
  ],

  filterTopics: {
    all:           [],
    ransomware:    ['ransomware','ransom','extortion','double extortion'],
    compliance:    ['compliance','gdpr','iso 27001','nist','sox','hipaa','pci','audit','regulation','framework'],
    vulnerability: ['vulnerability','cve','patch','zero-day','exploit','nvd'],
    breach:        ['breach','leak','exposed','stolen','data loss','exfiltration'],
  },
};



function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1).trimEnd() + '…' : str;
}

function timeSince(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (isNaN(diff) || diff < 0) return '';
  if (diff < 3600)  return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function isRelevant(item) {
  const text = (item.title + ' ' + item.summary).toLowerCase();
  return NEWSLETTER_CONFIG.keywords.some(k => text.includes(k));
}

function matchesTopic(item, topic) {
  if (topic === 'all') return true;
  const text = (item.title + ' ' + item.summary).toLowerCase();
  return (NEWSLETTER_CONFIG.filterTopics[topic] || []).some(k => text.includes(k));
}



async function fetchFeed(feed) {
  const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(feed.url);
  try {
    const res = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const { contents } = await res.json();
    return parseRSS(contents, feed);
  } catch (e) {
    console.warn('[newsletter] Feed failed:', feed.label, e.message);
    return [];
  }
}

function parseRSS(xml, feed) {
  if (!xml) return [];
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const items = doc.querySelectorAll('item, entry'); 
  const results = [];

  items.forEach(el => {
    const get = (tag) => el.querySelector(tag)?.textContent?.trim() || '';
    const title   = get('title');
    const link    = get('link') || el.querySelector('link')?.getAttribute('href') || '';
    const desc    = get('description') || get('summary') || get('content');
    const pubDate = get('pubDate') || get('published') || get('updated') || '';

    if (!title || !link) return;

    results.push({
      title,
      link,
      summary:   truncate(stripHtml(desc), 200),
      pubDate,
      source:    feed.label,
      sourceColor: feed.color,
      sourceBg:    feed.bg,
    });
  });

  return results;
}



function loadCache() {
  try {
    const raw = localStorage.getItem(NEWSLETTER_CONFIG.cacheKey);
    if (!raw) return null;
    const { ts, items } = JSON.parse(raw);
    if (Date.now() - ts > NEWSLETTER_CONFIG.cacheTTL) return null;
    return { items, ageMs: Date.now() - ts };
  } catch { return null; }
}

function saveCache(items) {
  try {
    localStorage.setItem(NEWSLETTER_CONFIG.cacheKey, JSON.stringify({ ts: Date.now(), items }));
  } catch (e) { console.warn('[newsletter] Cache write failed:', e); }
}



function renderCards(items, containerId, topic = 'all') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filtered = items.filter(i => matchesTopic(i, topic));

  if (!filtered.length) {
    container.innerHTML = `
      <div class="nl-empty">No articles found for this filter. Try "All topics".</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="nl-card-link">
      <article class="nl-card">
        <div class="nl-card-meta">
          <span class="nl-badge" style="background:${item.sourceBg};color:${item.sourceColor}">
            ${item.source}
          </span>
          <time class="nl-time">${timeSince(item.pubDate)}</time>
        </div>
        <h3 class="nl-title">${item.title}</h3>
        <p class="nl-summary">${item.summary}</p>
        <span class="nl-readmore" style="color:${item.sourceColor}">Read full article →</span>
      </article>
    </a>
  `).join('');
}



async function initNewsletter({ containerId, statusId, filterId }) {
  const container = document.getElementById(containerId);
  const status    = document.getElementById(statusId);
  const filterEl  = document.getElementById(filterId);

  let currentItems = [];
  let currentTopic = 'all';

  function setStatus(msg) {
    if (status) status.textContent = msg;
  }

  async function load(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = loadCache();
      if (cached) {
        currentItems = cached.items;
        const ageMin = Math.round(cached.ageMs / 60000);
        setStatus(`${currentItems.length} articles · cached ${ageMin}m ago`);
        renderCards(currentItems, containerId, currentTopic);
        return;
      }
    }

    container.innerHTML = '<div class="nl-loading">Fetching latest cybersecurity news…</div>';
    setStatus('');

    const results = await Promise.allSettled(
      NEWSLETTER_CONFIG.feeds.map(feed => fetchFeed(feed))
    );

    let items = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

    
    items = items.filter(isRelevant);

    
    const seen = new Set();
    items = items.filter(i => {
      const key = i.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    
    items = items.slice(0, NEWSLETTER_CONFIG.maxCards);

    currentItems = items;
    saveCache(items);
    setStatus(`${items.length} relevant articles · just updated`);
    renderCards(currentItems, containerId, currentTopic);
  }

  
  if (filterEl) {
    filterEl.addEventListener('change', e => {
      currentTopic = e.target.value;
      renderCards(currentItems, containerId, currentTopic);
    });
  }

  
  window.refreshNewsletter = () => load(true);

  
  load(false);
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('nl-container');
  if (el) {
    initNewsletter({
      containerId: 'nl-container',
      statusId:    'nl-status',
      filterId:    'nl-filter',
    });
  }
});
