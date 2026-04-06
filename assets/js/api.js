function displayData(results) {
    const conteneur = document.getElementById('newsletter-cards');
    if (!conteneur) return;

    if (!Array.isArray(results) || results.length === 0) {
        conteneur.innerHTML = "<p>Aucun résultat à afficher.</p>";
        return;
    }

    conteneur.innerHTML = results.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="news-card">
                <h3>${item.title ?? 'Sans titre'}</h3>
                <p><strong>${item.type ?? ''}</strong> — ${item.publication_date ?? ''}</p>
                <p>${item.agencies?.[0]?.name ?? ''}</p>
                <a href="${item.html_url}" target="_blank" rel="noopener noreferrer">Consulter</a>
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