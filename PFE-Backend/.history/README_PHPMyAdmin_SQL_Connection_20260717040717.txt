## Passer de SQLite vers phpMyAdmin (MySQL)

### 1) Créer la base dans phpMyAdmin
- Ouvrir **http://localhost/phpmyadmin**
- Créer une base (ex: `piqueou`)

### 2) Paramétrer Laravel (fichier `.env`)
Dans `.env`, mettre (adapter):
- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=piqueou-portal`
- `DB_USERNAME=root` (ou ton user)
- `DB_PASSWORD=` (mot de passe si besoin)

> Remarque: sur Windows, Laravel peut exiger que le driver PHP `pdo_mysql` soit activé.

### 3) Lancer les migrations
Dans le terminal:
- `php artisan migrate`

### 4) Installer/activer le driver MySQL (si nécessaire)
- Vérifier que PHP a `pdo_mysql` d’activé.
- Si besoin (XAMPP/WAMP), activer dans php.ini / installer le module.

### 5) Tester
- Recharger ton app: **http://127.0.0.1:8001**
- Vérifier que les utilisateurs / tables apparaissent dans phpMyAdmin.

