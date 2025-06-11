<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/LocationController.php';
require_once '../models/Appartement.php';
require_once '../models/Locataire.php';
$controller = new LocationController();
$appartementModel = new Appartement();
$locataireModel = new Locataire();
$message = '';
// Suppression
if (isset($_GET['delete'])) {
    $controller->delete($_GET['delete']);
    $message = 'Location supprimée !';
}
// Modification
if (isset($_POST['edit_id'])) {
    $data = [
        'appartement_id' => $_POST['appartement_id'],
        'locataire_id' => $_POST['locataire_id'],
        'date_debut' => $_POST['date_debut'],
        'duree' => $_POST['duree'],
        'montant' => $_POST['montant'],
        'conditions' => $_POST['conditions'],
        'actif' => isset($_POST['actif']) ? 1 : 0
    ];
    $result = $controller->update($_POST['edit_id'], $data);
    if ($result === true) {
        $message = 'Location modifiée !';
    } elseif (is_string($result)) {
        $message = '<span style="color:red;">'.$result.'</span>';
    }
}
// Ajout
if (isset($_POST['add'])) {
    $data = [
        'appartement_id' => $_POST['appartement_id'],
        'locataire_id' => $_POST['locataire_id'],
        'date_debut' => $_POST['date_debut'],
        'duree' => $_POST['duree'],
        'montant' => $_POST['montant'],
        'conditions' => $_POST['conditions'],
        'actif' => isset($_POST['actif']) ? 1 : 0
    ];
    $result = $controller->create($data);
    if ($result === true) {
        $message = 'Location ajoutée !';
    } elseif (is_string($result)) {
        $message = '<span style="color:red;">'.$result.'</span>';
    }
}
$locations = $controller->index();
$appartements = $appartementModel->getAll();
$locataires = $locataireModel->getAll();
$edit_location = null;
if (isset($_GET['edit'])) {
    $edit_location = $controller->show($_GET['edit']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des locations</title>
</head>
<body>
    <h2>Locations (attribution d'un appartement à un locataire)</h2>
    <?php if ($message) echo '<p>'.$message.'</p>'; ?>
    <?php if ($edit_location): ?>
        <h3>Modifier la location</h3>
        <form method="post">
            <input type="hidden" name="edit_id" value="<?= htmlspecialchars($edit_location['id']) ?>">
            <label>Appartement :</label>
            <select name="appartement_id" required>
                <?php foreach ($appartements as $a): ?>
                    <option value="<?= $a['id'] ?>" <?= $edit_location['appartement_id'] == $a['id'] ? 'selected' : '' ?>><?= htmlspecialchars($a['numero']) ?></option>
                <?php endforeach; ?>
            </select>
            <label>Locataire :</label>
            <select name="locataire_id" required>
                <?php foreach ($locataires as $l): ?>
                    <option value="<?= $l['id'] ?>" <?= $edit_location['locataire_id'] == $l['id'] ? 'selected' : '' ?>><?= htmlspecialchars($l['nom'].' '.$l['prenom']) ?></option>
                <?php endforeach; ?>
            </select>
            <input type="date" name="date_debut" value="<?= htmlspecialchars($edit_location['date_debut']) ?>" required>
            <input type="number" name="duree" value="<?= htmlspecialchars($edit_location['duree']) ?>" placeholder="Durée (mois)" required>
            <input type="number" name="montant" value="<?= htmlspecialchars($edit_location['montant']) ?>" placeholder="Montant" required>
            <input type="text" name="conditions" value="<?= htmlspecialchars($edit_location['conditions']) ?>" placeholder="Conditions">
            <label><input type="checkbox" name="actif" value="1" <?= $edit_location['actif'] ? 'checked' : '' ?>> Actif</label>
            <button type="submit">Enregistrer</button>
            <a href="locations.php">Annuler</a>
        </form>
    <?php else: ?>
        <h3>Nouvelle location</h3>
        <form method="post">
            <input type="hidden" name="add" value="1">
            <label>Appartement :</label>
            <select name="appartement_id" required>
                <?php foreach ($appartements as $a): ?>
                    <option value="<?= $a['id'] ?>"><?= htmlspecialchars($a['numero']) ?></option>
                <?php endforeach; ?>
            </select>
            <label>Locataire :</label>
            <select name="locataire_id" required>
                <?php foreach ($locataires as $l): ?>
                    <option value="<?= $l['id'] ?>"><?= htmlspecialchars($l['nom'].' '.$l['prenom']) ?></option>
                <?php endforeach; ?>
            </select>
            <input type="date" name="date_debut" required>
            <input type="number" name="duree" placeholder="Durée (mois)" required>
            <input type="number" name="montant" placeholder="Montant" required>
            <input type="text" name="conditions" placeholder="Conditions">
            <label><input type="checkbox" name="actif" value="1" checked> Actif</label>
            <button type="submit">Attribuer</button>
        </form>
    <?php endif; ?>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Appartement</th><th>Bâtiment</th><th>Locataire</th><th>Date début</th><th>Durée</th><th>Montant</th><th>Actif</th><th>Actions</th></tr>
        <?php foreach ($locations as $loc) : ?>
            <tr>
                <td><?= htmlspecialchars($loc['id']) ?></td>
                <td><?= htmlspecialchars($loc['appartement_numero']) ?></td>
                <td><?= htmlspecialchars($loc['batiment_nom']) ?></td>
                <td><?= htmlspecialchars($loc['locataire_nom'].' '.$loc['locataire_prenom']) ?></td>
                <td><?= htmlspecialchars($loc['date_debut']) ?></td>
                <td><?= htmlspecialchars($loc['duree']) ?> mois</td>
                <td><?= htmlspecialchars($loc['montant']) ?> F</td>
                <td><?= $loc['actif'] ? 'Oui' : 'Non' ?></td>
                <td>
                    <a href="locations.php?edit=<?= $loc['id'] ?>">Modifier</a> |
                    <a href="locations.php?delete=<?= $loc['id'] ?>" onclick="return confirm('Supprimer cette location ?')">Supprimer</a> |
                    <a href="paiements_locataire.php?locataire_id=<?= $loc['locataire_id'] ?>">Paiements locataire</a> |
                    <a href="paiements_appartement.php?appartement_id=<?= $loc['appartement_id'] ?>">Paiements appartement</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
    <br>
    <a href="dashboard.php">Retour au dashboard</a>
</body>
</html> 