<?php
// Démarrer la session pour vérifier l'authentification
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Inclure la configuration de la base de données
require_once '../config/database.php';

// Récupérer les statistiques
$db = new Database();
$conn = $db->getConnection();

// Nombre total de bâtiments
$stmt = $conn->query('SELECT COUNT(*) FROM batiments');
$total_batiments = $stmt->fetchColumn();

// Nombre d'appartements occupés
$stmt = $conn->query('SELECT COUNT(*) FROM appartements a JOIN locations l ON a.id = l.appartement_id WHERE l.actif = 1');
$appartements_occupes = $stmt->fetchColumn();

// Nombre d'appartements libres
$stmt = $conn->query('SELECT COUNT(*) FROM appartements a LEFT JOIN locations l ON a.id = l.appartement_id WHERE l.id IS NULL OR l.actif = 0');
$appartements_libres = $stmt->fetchColumn();

// Paiements en attente (locations actives sans paiement pour le mois courant)
$mois_courant = date('m');
$annee_courante = date('Y');
$sql = 'SELECT COUNT(*) FROM locations l 
        LEFT JOIN paiements p ON l.id = p.location_id 
        AND p.mois = :mois AND p.annee = :annee 
        WHERE l.actif = 1 AND p.id IS NULL';
$stmt = $conn->prepare($sql);
$stmt->bindParam(':mois', $mois_courant);
$stmt->bindParam(':annee', $annee_courante);
$stmt->execute();
$paiements_en_attente = $stmt->fetchColumn();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de bord</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container my-4">
        <h2 class="mb-4">Tableau de bord</h2>
        <p><strong>Rôle :</strong> <?php echo htmlspecialchars($_SESSION['user_role']); ?></p>
        <div class="row">
            <div class="col-md-3">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Bâtiments</h5>
                        <p class="card-text"><?php echo $total_batiments; ?></p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-success mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Appartements occupés</h5>
                        <p class="card-text"><?php echo $appartements_occupes; ?></p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-info mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Appartements libres</h5>
                        <p class="card-text"><?php echo $appartements_libres; ?></p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-danger mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Paiements en attente</h5>
                        <p class="card-text"><?php echo $paiements_en_attente; ?></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <a href="batiments.php" class="btn btn-primary">Gérer les bâtiments</a>
            <a href="locataires.php" class="btn btn-primary">Gérer les locataires</a>
            <a href="locations.php" class="btn btn-primary">Gérer les locations</a>
            <?php if ($_SESSION['user_role'] === 'admin'): ?>
                <a href="users.php" class="btn btn-primary">Gérer les utilisateurs</a>
                <a href="agences.php" class="btn btn-primary">Gérer les agences</a>
            <?php endif; ?>
            <a href="logout.php" class="btn btn-secondary">Déconnexion</a>
        </div>
    </div>
</body>
</html>