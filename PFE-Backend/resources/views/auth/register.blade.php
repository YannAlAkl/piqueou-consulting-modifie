<body>

    <div class="form-container">
        <div class="form-header">
            <h2>Créer un compte professionnel</h2>
        </div>

        <form action="/register" method="POST">
            @csrf
            <div class="form-grid">

                <!-- first_name (NOT NULL) -->
                <div class="form-group">
                    <label for="first_name">Prénom *</label>
                    <input type="text" id="first_name" name="first_name" required maxlength="255">
                </div>

                <!-- last_name (NULL) -->
                <div class="form-group">
                    <label for="last_name">Nom</label>
                    <input type="text" id="last_name" name="last_name" maxlength="255">
                </div>

                <!-- email (NOT NULL) -->
                <div class="form-group full-width">
                    <label for="email">Adresse e-mail *</label>
                    <input type="email" id="email" name="email" required maxlength="255">
                </div>

                <!-- password (NOT NULL) -->
                <div class="form-group full-width">
                    <label for="password">Mot de passe *</label>
                    <input type="password" id="password" name="password" required maxlength="255">
                </div>

                <div class="form-group full-width">
                    <label for="password_confirmation">Confirmer le mot de passe *</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" required
                        maxlength="255">
                </div>

                <!-- company_name (NULL) -->
                <div class="form-group">
                    <label for="company_name">Nom de l'entreprise</label>
                    <input type="text" id="company_name" name="company_name" maxlength="255">
                </div>

                <!-- phone (NULL) -->
                <div class="form-group">
                    <label for="phone">Téléphone</label>
                    <input type="tel" id="phone" name="phone" maxlength="30">
                </div>

                <!-- wants_newsletter (tinyint - default 0) -->
                <div class="form-group full-width checkbox-group">
                    <input type="hidden" name="wants_newsletter" value="0">
                    <input type="checkbox" id="wants_newsletter" name="wants_newsletter" value="1">
                    <label for="wants_newsletter">S'abonner à la newsletter</label>
                </div>

                <!-- newsletter_category (NULL) -->
                <div class="form-group full-width">
                    <label for="newsletter_category">Catégorie de newsletter</label>
                    <select id="newsletter_category" name="newsletter_category">
                        <option value="" selected>-- Choisir une catégorie --</option>
                        <option value="tech">Actualités Tech</option>
                        <option value="business">Business & Stratégie</option>
                        <option value="offers">Offres promotionnelles</option>
                    </select>
                </div>

                <!-- Bouton de soumission -->
                <div class="form-group full-width">
                    <button type="submit" class="submit-btn">S'inscrire</button>
                </div>
        </form>
    </div>

</body>

</html>