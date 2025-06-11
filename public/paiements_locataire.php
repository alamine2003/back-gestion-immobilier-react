<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/PaiementController.php';
require_once '../models/Locataire.php';
$paiementController = new PaiementController();
$locataireModel = new Locataire();
$locataire_id = isset($_GET['locataire_id']) ? intval($_GET['locataire_id']) : 0;
if (!$locataire_id) {
    echo 'Locataire non spécifié.';
    exit();
}
$locataire = $locataireModel->getById($locataire_id);
$paiements = $paiementController->getAllByLocataire($locataire_id);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Paiements du locataire</title>
</head>
<body>
    <h2>Paiements pour le locataire : <?= htmlspecialchars($locataire['nom'].' '.$locataire['prenom']) ?></h2>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Mois</th><th>Année</th><th>Montant</th><th>Date paiement</th><th>Appartement</th><th>Quittance</th></tr>
        <?php foreach ($paiements as $p) : ?>
            <tr>
                <td><?= htmlspecialchars($p['id']) ?></td>
                <td><?= htmlspecialchars($p['mois']) ?></td>
                <td><?= htmlspecialchars($p['annee']) ?></td>
                <td><?= htmlspecialchars($p['montant']) ?> F</td>
                <td><?= htmlspecialchars($p['date_paiement']) ?></td>
                <td><?= htmlspecialchars($p['appartement_numero']) ?></td>
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
    <a href="locataires.php">Retour aux locataires</a>
</body>
</html> 