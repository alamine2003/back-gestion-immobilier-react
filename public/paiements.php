<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/PaiementController.php';
require_once '../models/Location.php';
$locationModel = new Location();
$paiementController = new PaiementController();
$message = '';
$location_id = isset($_GET['location_id']) ? intval($_GET['location_id']) : 0;
if (!$location_id) {
    echo 'Location non spécifiée.';
    exit();
}
$location = $locationModel->getById($location_id);
$paiements = $paiementController->getAllByLocation($location_id);
// Suppression
if (isset($_GET['delete'])) {
    $paiementController->delete($_GET['delete']);
    $message = 'Paiement supprimé !';
    $paiements = $paiementController->getAllByLocation($location_id);
}
// Ajout
if (isset($_POST['add'])) {
    $data = [
        'location_id' => $location_id,
        'mois' => $_POST['mois'],
        'annee' => $_POST['annee'],
        'montant' => $_POST['montant'],
        'date_paiement' => $_POST['date_paiement'],
        'quittance_pdf' => '' // Généré après
    ];
    $paiementController->create($data);
    $message = 'Paiement enregistré !';
    $paiements = $paiementController->getAllByLocation($location_id);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Paiements de la location</title>
</head>
<body>
    <h2>Paiements pour la location #<?= htmlspecialchars($location_id) ?></h2>
    <p>Locataire : <?= htmlspecialchars($location['locataire_id']) ?> | Appartement : <?= htmlspecialchars($location['appartement_id']) ?></p>
    <?php if ($message) echo '<p style="color:green;">'.$message.'</p>'; ?>
    <h3>Enregistrer un paiement</h3>
    <form method="post">
        <input type="hidden" name="add" value="1">
        <label>Mois :</label>
        <select name="mois" required>
            <?php for ($m=1; $m<=12; $m++): ?>
                <option value="<?= $m ?>"><?= $m ?></option>
            <?php endfor; ?>
        </select>
        <label>Année :</label>
        <input type="number" name="annee" value="<?= date('Y') ?>" required>
        <label>Montant :</label>
        <input type="number" name="montant" required>
        <label>Date de paiement :</label>
        <input type="date" name="date_paiement" value="<?= date('Y-m-d') ?>" required>
        <button type="submit">Enregistrer</button>
    </form>
    <h3>Historique des paiements</h3>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Mois</th><th>Année</th><th>Montant</th><th>Date paiement</th><th>Quittance</th><th>Actions</th></tr>
        <?php foreach ($paiements as $p) : ?>
            <tr>
                <td><?= htmlspecialchars($p['id']) ?></td>
                <td><?= htmlspecialchars($p['mois']) ?></td>
                <td><?= htmlspecialchars($p['annee']) ?></td>
                <td><?= htmlspecialchars($p['montant']) ?> F</td>
                <td><?= htmlspecialchars($p['date_paiement']) ?></td>
                <td>
                    <?php if ($p['quittance_pdf']): ?>
                        <a href="<?= htmlspecialchars($p['quittance_pdf']) ?>" target="_blank">Voir PDF</a>
                    <?php else: ?>
                        <em>Non générée</em>
                    <?php endif; ?>
                </td>
                <td>
                    <a href="paiements.php?location_id=<?= $location_id ?>&delete=<?= $p['id'] ?>" onclick="return confirm('Supprimer ce paiement ?')">Supprimer</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
    <br>
    <a href="locations.php">Retour aux locations</a>
</body>
</html> 