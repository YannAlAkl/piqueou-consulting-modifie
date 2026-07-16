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
                ${item.type ?? 'Document'}
            </div>

            <div class="news-icon">�</div>

            <h4>${item.document_number ?? 'N/A'}</h4>

        </div>

        <div class="news-card-body">

            <div class="news-meta">
                <span>${item.agencies?.[0]?.name ?? ''}</span>
                <span>${item.publication_date ?? ''}</span>
            </div>

            <h3>${item.title ?? 'Sans titre'}</h3>

            <p>${item.abstract ?? ''}</p>

            <div class="news-tag">
                <a href="${item.html_url ?? '#'}" target="_blank">Lire plus</a>
            </div>

        </div>

    </div>
`).join('');
}
async function loadData() {
    try {
        const response = await fetch('assets/js/newsLetter.json');
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