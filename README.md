# Gestion des activités immobilières

## Installation

1. Cloner ce dépôt
2. Installer les dépendances PHP :
   ```
   composer install
   ```
3. Importer le fichier `senkeur_db.sql` dans phpMyAdmin/MySQL
4. Lancer le serveur local :
   - Windows : double-cliquer sur `start-server.bat`
   - Linux/Mac : `sh start-server.sh`
5. Aller sur [http://localhost:8000](http://localhost:8000)

## Tests automatisés

1. Installer les dépendances de dev :
   ```
   composer install
   ```
2. Lancer les tests :
   ```
   vendor/bin/phpunit --testdox
   ```

## Structure du projet
- `public/` : fichiers accessibles via le navigateur
- `models/` : classes métier (PDO)
- `controllers/` : logique métier
- `tests/` : tests unitaires PHPUnit 