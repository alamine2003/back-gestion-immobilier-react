<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/BatimentController.php';
$controller = new BatimentController();
$message = '';
// Suppression
if (isset($_GET['delete'])) {
    $controller->delete($_GET['delete']);
    $message = 'Bâtiment supprimé !';
}
// Modification
if (isset($_POST['edit_id'])) {
    $data = [
        'nom' => $_POST['nom'],
        'adresse' => $_POST['adresse'],
        'nb_appartements' => $_POST['nb_appartements'],
        'proprietaire' => $_POST['proprietaire'],
        'agence_id' => 1
    ];
    $controller->update($_POST['edit_id'], $data);
    $message = 'Bâtiment modifié !';
}
// Ajout
if (isset($_POST['add'])) {
    $data = [
        'nom' => $_POST['nom'],
        'adresse' => $_POST['adresse'],
        'nb_appartements' => $_POST['nb_appartements'],
        'proprietaire' => $_POST['proprietaire'],
        'agence_id' => 1
    ];
    $controller->create($data);
    $message = 'Bâtiment ajouté !';
}
$batiments = $controller->index();
$edit_batiment = null;
if (isset($_GET['edit'])) {
    $edit_batiment = $controller->show($_GET['edit']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des bâtiments</title>
</head>
<body>
    <h2>Bâtiments</h2>
    <?php if ($message) echo '<p style="color:green;">'.$message.'</p>'; ?>
    <?php if ($edit_batiment): ?>
        <h3>Modifier le bâtiment</h3>
        <form method="post">
            <input type="hidden" name="edit_id" value="<?= htmlspecialchars($edit_batiment['id']) ?>">
            <input type="text" name="nom" value="<?= htmlspecialchars($edit_batiment['nom']) ?>" required>
            <input type="text" name="adresse" value="<?= htmlspecialchars($edit_batiment['adresse']) ?>" required>
            <input type="number" name="nb_appartements" value="<?= htmlspecialchars($edit_batiment['nb_appartements']) ?>" required>
            <input type="text" name="proprietaire" value="<?= htmlspecialchars($edit_batiment['proprietaire']) ?>" required>
            <button type="submit">Enregistrer</button>
            <a href="batiments.php">Annuler</a>
        </form>
    <?php else: ?>
        <h3>Ajouter un bâtiment</h3>
        <form method="post">
            <input type="hidden" name="add" value="1">
            <input type="text" name="nom" placeholder="Nom" required>
            <input type="text" name="adresse" placeholder="Adresse" required>
            <input type="number" name="nb_appartements" placeholder="Nombre d'appartements" required>
            <input type="text" name="proprietaire" placeholder="Propriétaire" required>
            <button type="submit">Ajouter</button>
        </form>
    <?php endif; ?>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Nom</th><th>Adresse</th><th>Nb Appartements</th><th>Propriétaire</th><th>Actions</th></tr>
        <?php foreach ($batiments as $b) : ?>
            <tr>
                <td><?= htmlspecialchars($b['id']) ?></td>
                <td><?= htmlspecialchars($b['nom']) ?></td>
                <td><?= htmlspecialchars($b['adresse']) ?></td>
                <td><?= htmlspecialchars($b['nb_appartements']) ?></td>
                <td><?= htmlspecialchars($b['proprietaire']) ?></td>
                <td>
                    <a href="batiments.php?edit=<?= $b['id'] ?>">Modifier</a> |
                    <a href="batiments.php?delete=<?= $b['id'] ?>" onclick="return confirm('Supprimer ce bâtiment ?')">Supprimer</a> |
                    <a href="appartements.php?batiment_id=<?= $b['id'] ?>">Appartements</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
    <br>
    <a href="dashboard.php">Retour au dashboard</a>
</body>
</html> 