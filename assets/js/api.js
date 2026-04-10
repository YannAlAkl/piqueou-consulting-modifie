 function displayData(results) {
    const conteneur = document.getElementById('newsletter-cards');
    if (!conteneur) return;

    if (!Array.isArray(results) || results.length === 0) {
        conteneur.innerHTML = "<p>Aucun résultat à afficher.</p>";
        return;
    }

    conteneur.innerHTML = results.map(item => `
    <div class="news-card">

        <div class="news-card-header">

            <div class="news-badge">
                ${item.cve ?? 'CVE-XXXX'}
            </div>

            <div class="news-icon">🛡️</div>

            <h4>${item.cve ?? ''}</h4>

        </div>

        <div class="news-card-body">

            <div class="news-meta">
                <span>${item.agencies?.[0]?.name ?? ''}</span>
                <span>${item.publication_date ?? ''}</span>
            </div>

            <h3>${item.title ?? 'Sans titre'}</h3>

            <p>${item.description ?? ''}</p>

            <div class="news-tag">
                ${item.cwe ?? 'CWE'}
            </div>

        </div>

    </div>
`).join('');
}
async function loadData() {
    try {
        const response = await fetch('https://www.federalregister.gov/api/v1/documents.json?conditions[term]=Cybersecurity%20Maturity%20Model%20Certification&order=newest');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        displayData(data.results);
    } catch (err) {
        console.error("Erreur chargement:", err);
        const conteneur = document.getElementById('newsletter-cards');
        if (conteneur) conteneur.innerHTML = "<p>Erreur de chargement des données.</p>";
    }
}

loadData();