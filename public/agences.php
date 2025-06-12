<?php
// Démarrer la session et vérifier les autorisations
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

// Inclure les dépendances
require_once '../controllers/AgenceController.php';
$controller = new AgenceController();
$message = '';

// Gestion des actions
if (isset($_GET['delete'])) {
    $result = $controller->delete($_GET['delete']);
    $message = $result ? 'Agence supprimée !' : 'Erreur lors de la suppression.';
}

if (isset($_POST['edit_id'])) {
    $data = [
        'nom' => $_POST['nom'],
        'adresse' => $_POST['adresse'],
        'email' => $_POST['email'],
        'telephone' => $_POST['telephone']
    ];
    $result = $controller->update($_POST['edit_id'], $data);
    $message = is_string($result) ? $result : 'Agence modifiée !';
}

if (isset($_POST['add'])) {
    $data = [
        'nom' => $_POST['nom'],
        'adresse' => $_POST['adresse'],
        'email' => $_POST['email'],
        'telephone' => $_POST['telephone']
    ];
    $result = $controller->create($data);
    $message = is_string($result) ? $result : 'Agence ajoutée !';
}

$agences = $controller->index();
$edit_agence = null;
if (isset($_GET['edit'])) {
    $edit_agence = $controller->show($_GET['edit']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des agences</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container my-4">
        <h2 class="mb-4">Gestion des agences</h2>
        <?php if ($message): ?>
            <div class="alert alert-<?php echo is_string($result) ? 'danger' : 'success'; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        <?php if ($edit_agence): ?>
            <h3>Modifier l'agence</h3>
            <form method="post" class="mb-4">
                <input type="hidden" name="edit_id" value="<?php echo htmlspecialchars($edit_agence['id']); ?>">
                <div class="mb-3">
                    <label class="form-label">Nom :</label>
                    <input type="text" name="nom" class="form-control" value="<?php echo htmlspecialchars($edit_agence['nom']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Adresse :</label>
                    <input type="text" name="adresse" class="form-control" value="<?php echo htmlspecialchars($edit_agence['adresse']); ?>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Email :</label>
                    <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($edit_agence['email']); ?>">
                </div>
                <div class="mb-3">
                    <label class="form-label">Téléphone :</label>
                    <input type="text" name="telephone" class="form-control" value="<?php echo htmlspecialchars($edit_agence['telephone']); ?>">
                </div>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <a href="agences.php" class="btn btn-secondary">Annuler</a>
            </form>
        <?php else: ?>
            <h3>Ajouter une agence</h3>
            <form method="post" class="mb-4">
                <input type="hidden" name="add" value="1">
                <div class="mb-3">
                    <label class="form-label">Nom :</label>
                    <input type="text" name="nom" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Adresse :</label>
                    <input type="text" name="adresse" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Email :</label>
                    <input type="email" name="email" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Téléphone :</label>
                    <input type="text" name="telephone" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary">Ajouter</button>
            </form>
        <?php endif; ?>
        <h3>Liste des agences</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Adresse</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($agences as $a): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($a['id']); ?></td>
                        <td><?php echo htmlspecialchars($a['nom']); ?></td>
                        <td><?php echo htmlspecialchars($a['adresse'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($a['email'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($a['telephone'] ?? '-'); ?></td>
                        <td>
                            <a href="agences.php?edit=<?php echo $a['id']; ?>" class="btn btn-sm btn-warning">Modifier</a>
                            <a href="agences.php?delete=<?php echo $a['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Supprimer cette agence ?')">Supprimer</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <a href="dashboard.php" class="btn btn-secondary">Retour au tableau de bord</a>
    </div>
</body>
</html>