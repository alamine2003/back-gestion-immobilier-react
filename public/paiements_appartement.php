<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/PaiementController.php';
require_once '../models/Appartement.php';
$paiementController = new PaiementController();
$appartementModel = new Appartement();
$appartement_id = isset($_GET['appartement_id']) ? intval($_GET['appartement_id']) : 0;
if (!$appartement_id) {
    echo 'Appartement non spécifié.';
    exit();
}
$appartement = $appartementModel->getById($appartement_id);
$paiements = $paiementController->getAllByAppartement($appartement_id);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Paiements de l'appartement</title>
</head>
<body>
    <h2>Paiements pour l'appartement : <?= htmlspecialchars($appartement['numero']) ?></h2>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Mois</th><th>Année</th><th>Montant</th><th>Date paiement</th><th>Locataire</th><th>Quittance</th></tr>
        <?php foreach ($paiements as $p) : ?>
            <tr>
                <td><?= htmlspecialchars($p['id']) ?></td>
                <td><?= htmlspecialchars($p['mois']) ?></td>
                <td><?= htmlspecialchars($p['annee']) ?></td>
                <td><?= htmlspecialchars($p['montant']) ?> F</td>
                <td><?= htmlspecialchars($p['date_paiement']) ?></td>
                <td><?= htmlspecialchars($p['locataire_nom'].' '.$p['locataire_prenom']) ?></td>
                <td>
                    <?php if ($p['quittance_pdf']): ?>
                        <a href="<?= htmlspecialchars($p['quittance_pdf']) ?>" target="_blank">Voir PDF</a>
                    <?php else: ?>
                        <em>Non générée</em>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
    <br>
    <a href="batiments.php">Retour aux bâtiments</a>
</body>
</html> 