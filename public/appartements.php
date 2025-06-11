<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/AppartementController.php';
require_once '../controllers/BatimentController.php';
$batiment_id = isset($_GET['batiment_id']) ? intval($_GET['batiment_id']) : 0;
if (!$batiment_id) {
    echo 'Bâtiment non spécifié.';
    exit();
}
$batimentCtrl = new BatimentController();
$batiment = $batimentCtrl->show($batiment_id);
$controller = new AppartementController();
$message = '';
// Suppression
if (isset($_GET['delete'])) {
    $controller->delete($_GET['delete']);
    $message = 'Appartement supprimé !';
}
// Modification
if (isset($_POST['edit_id'])) {
    $data = [
        'numero' => $_POST['numero'],
        'superficie' => $_POST['superficie'],
        'loyer_mensuel' => $_POST['loyer_mensuel'],
        'etat' => $_POST['etat']
    ];
    $controller->update($_POST['edit_id'], $data);
    $message = 'Appartement modifié !';
}
// Ajout
if (isset($_POST['add'])) {
    $data = [
        'batiment_id' => $batiment_id,
        'numero' => $_POST['numero'],
        'superficie' => $_POST['superficie'],
        'loyer_mensuel' => $_POST['loyer_mensuel'],
        'etat' => $_POST['etat']
    ];
    $controller->create($data);
    $message = 'Appartement ajouté !';
}
$appartements = $controller->index($batiment_id);
$edit_appartement = null;
if (isset($_GET['edit'])) {
    $edit_appartement = $controller->show($_GET['edit']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Appartements du bâtiment</title>
</head>
<body>
    <h2>Appartements du bâtiment : <?= htmlspecialchars($batiment['nom']) ?></h2>
    <?php if ($message) echo '<p style="color:green;">'.$message.'</p>'; ?>
    <?php if ($edit_appartement): ?>
        <h3>Modifier l'appartement</h3>
        <form method="post">
            <input type="hidden" name="edit_id" value="<?= htmlspecialchars($edit_appartement['id']) ?>">
            <input type="text" name="numero" value="<?= htmlspecialchars($edit_appartement['numero']) ?>" required>
            <input type="number" name="superficie" value="<?= htmlspecialchars($edit_appartement['superficie']) ?>" required>
            <input type="number" name="loyer_mensuel" value="<?= htmlspecialchars($edit_appartement['loyer_mensuel']) ?>" required>
            <input type="text" name="etat" value="<?= htmlspecialchars($edit_appartement['etat']) ?>" required>
            <button type="submit">Enregistrer</button>
            <a href="appartements.php?batiment_id=<?= $batiment_id ?>">Annuler</a>
        </form>
    <?php else: ?>
        <h3>Ajouter un appartement</h3>
        <form method="post">
            <input type="hidden" name="add" value="1">
            <input type="text" name="numero" placeholder="Numéro" required>
            <input type="number" name="superficie" placeholder="Superficie (m²)" required>
            <input type="number" name="loyer_mensuel" placeholder="Loyer mensuel" required>
            <input type="text" name="etat" placeholder="État (libre, occupé, etc.)" required>
            <button type="submit">Ajouter</button>
        </form>
    <?php endif; ?>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Numéro</th><th>Superficie</th><th>Loyer</th><th>État</th><th>Actions</th></tr>
        <?php foreach ($appartements as $a) : ?>
            <tr>
                <td><?= htmlspecialchars($a['id']) ?></td>
                <td><?= htmlspecialchars($a['numero']) ?></td>
                <td><?= htmlspecialchars($a['superficie']) ?> m²</td>
                <td><?= htmlspecialchars($a['loyer_mensuel']) ?> F</td>
                <td><?= htmlspecialchars($a['etat']) ?></td>
                <td>
                    <a href="appartements.php?batiment_id=<?= $batiment_id ?>&edit=<?= $a['id'] ?>">Modifier</a> |
                    <a href="appartements.php?batiment_id=<?= $batiment_id ?>&delete=<?= $a['id'] ?>" onclick="return confirm('Supprimer cet appartement ?')">Supprimer</a> |
                    <a href="paiements_appartement.php?appartement_id=<?= $a['id'] ?>">Historique paiements</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
    <br>
    <a href="batiments.php">Retour aux bâtiments</a>
</body>
</html> 