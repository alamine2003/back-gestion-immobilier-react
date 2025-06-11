<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../controllers/LocataireController.php';
$controller = new LocataireController();
$message = '';
// Suppression
if (isset($_GET['delete'])) {
    $controller->delete($_GET['delete']);
    $message = 'Locataire supprimé !';
}
// Modification
if (isset($_POST['edit_id'])) {
    $data = [
        'nom' => $_POST['nom'],
        'prenom' => $_POST['prenom'],
        'telephone' => $_POST['telephone'],
        'email' => $_POST['email'],
        'piece_identite' => $_POST['piece_identite']
    ];
    $controller->update($_POST['edit_id'], $data);
    $message = 'Locataire modifié !';
}
// Ajout
if (isset($_POST['add'])) {
    $data = [
        'nom' => $_POST['nom'],
        'prenom' => $_POST['prenom'],
        'telephone' => $_POST['telephone'],
        'email' => $_POST['email'],
        'piece_identite' => $_POST['piece_identite']
    ];
    $controller->create($data);
    $message = 'Locataire ajouté !';
}
$locataires = $controller->index();
$edit_locataire = null;
if (isset($_GET['edit'])) {
    $edit_locataire = $controller->show($_GET['edit']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des locataires</title>
</head>
<body>
    <h2>Locataires</h2>
    <?php if ($message) echo '<p style="color:green;">'.$message.'</p>'; ?>
    <?php if ($edit_locataire): ?>
        <h3>Modifier le locataire</h3>
        <form method="post">
            <input type="hidden" name="edit_id" value="<?= htmlspecialchars($edit_locataire['id']) ?>">
            <input type="text" name="nom" value="<?= htmlspecialchars($edit_locataire['nom']) ?>" required>
            <input type="text" name="prenom" value="<?= htmlspecialchars($edit_locataire['prenom']) ?>" required>
            <input type="text" name="telephone" value="<?= htmlspecialchars($edit_locataire['telephone']) ?>" required>
            <input type="email" name="email" value="<?= htmlspecialchars($edit_locataire['email']) ?>" required>
            <input type="text" name="piece_identite" value="<?= htmlspecialchars($edit_locataire['piece_identite']) ?>" required>
            <button type="submit">Enregistrer</button>
            <a href="locataires.php">Annuler</a>
        </form>
    <?php else: ?>
        <h3>Ajouter un locataire</h3>
        <form method="post">
            <input type="hidden" name="add" value="1">
            <input type="text" name="nom" placeholder="Nom" required>
            <input type="text" name="prenom" placeholder="Prénom" required>
            <input type="text" name="telephone" placeholder="Téléphone" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="piece_identite" placeholder="Pièce d'identité" required>
            <button type="submit">Ajouter</button>
        </form>
    <?php endif; ?>
    <table border="1" cellpadding="5">
        <tr><th>ID</th><th>Nom</th><th>Prénom</th><th>Téléphone</th><th>Email</th><th>Pièce d'identité</th><th>Actions</th></tr>
        <?php foreach ($locataires as $l) : ?>
            <tr>
                <td><?= htmlspecialchars($l['id']) ?></td>
                <td><?= htmlspecialchars($l['nom']) ?></td>
                <td><?= htmlspecialchars($l['prenom']) ?></td>
                <td><?= htmlspecialchars($l['telephone']) ?></td>
                <td><?= htmlspecialchars($l['email']) ?></td>
                <td><?= htmlspecialchars($l['piece_identite']) ?></td>
                <td>
                    <a href="locataires.php?edit=<?= $l['id'] ?>">Modifier</a> |
                    <a href="locataires.php?delete=<?= $l['id'] ?>" onclick="return confirm('Supprimer ce locataire ?')">Supprimer</a> |
                    <a href="paiements_locataire.php?locataire_id=<?= $l['id'] ?>">Historique paiements</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
    <br>
    <a href="dashboard.php">Retour au dashboard</a>
</body>
</html> 