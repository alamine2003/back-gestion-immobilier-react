<?php
// Démarrer la session
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Inclure les dépendances
require_once '../controllers/AppartementController.php';
require_once '../controllers/BatimentController.php';
$controller = new AppartementController();
$batimentController = new BatimentController();
$message = '';

// Vérifier l'ID du bâtiment
if (!isset($_GET['batiment_id'])) {
    header('Location: batiments.php');
    exit();
}
$batiment_id = $_GET['batiment_id'];
$batiment = $batimentController->show($batiment_id);
if (!$batiment) {
    header('Location: batiments.php');
    exit();
}

// Gestion des actions
if (isset($_GET['delete'])) {
    $result = $controller->delete($_GET['delete']);
    $message = $result ? 'Appartement supprimé !' : 'Erreur lors de la suppression.';
}

if (isset($_POST['edit_id'])) {
    $data = [
        'numero' => $_POST['numero'],
        'superficie' => $_POST['superficie'],
        'loyer_mensuel' => $_POST['loyer_mensuel'],
        'etat' => $_POST['etat'],
        'batiment_id' => $batiment_id
    ];
    $result = $controller->update($_POST['edit_id'], $data);
    $message = is_string($result) ? $result : 'Appartement modifié !';
}

if (isset($_POST['add'])) {
    $data = [
        'numero' => $_POST['numero'],
        'superficie' => $_POST['superficie'],
        'loyer_mensuel' => $_POST['loyer_mensuel'],
        'etat' => $_POST['etat'],
        'batiment_id' => $batiment_id
    ];
    $result = $controller->create($data);
    $message = is_string($result) ? $result : 'Appartement ajouté !';
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appartements - <?php echo htmlspecialchars($batiment['nom']); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container my-4">
        <h2 class="mb-4">Appartements du bâtiment : <?php echo htmlspecialchars($batiment['nom']); ?></h2>
        <?php if ($message): ?>
            <div class="alert alert-<?php echo is_string($result) ? 'danger' : 'success'; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        <?php if ($edit_appartement): ?>
            <h3>Modifier l'appartement</h3>
            <form method="post" class="mb-4">
                <input type="hidden" name="edit_id" value="<?php echo htmlspecialchars($edit_appartement['id']); ?>">
                <div class="mb-3">
                    <label class="form-label">Numéro :</label>
                    <input type="text" name="numero" class="form-control" value="<?php echo htmlspecialchars($edit_appartement['numero']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Superficie (m²) :</label>
                    <input type="number" step="0.01" name="superficie" class="form-control" value="<?php echo htmlspecialchars($edit_appartement['superficie']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Loyer mensuel (F) :</label>
                    <input type="number" step="0.01" name="loyer_mensuel" class="form-control" value="<?php echo htmlspecialchars($edit_appartement['loyer_mensuel']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">État :</label>
                    <input type="text" name="etat" class="form-control" value="<?php echo htmlspecialchars($edit_appartement['etat']); ?>" required>
                </div>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <a href="appartements.php?batiment_id=<?php echo $batiment_id; ?>" class="btn btn-secondary">Annuler</a>
            </form>
        <?php else: ?>
            <h3>Ajouter un appartement</h3>
            <form method="post" class="mb-4">
                <input type="hidden" name="add" value="1">
                <div class="mb-3">
                    <label class="form-label">Numéro :</label>
                    <input type="text" name="numero" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Superficie (m²) :</label>
                    <input type="number" step="0.01" name="superficie" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Loyer mensuel (F) :</label>
                    <input type="number" step="0.01" name="loyer_mensuel" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">État :</label>
                    <input type="text" name="etat" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Ajouter</button>
            </form>
        <?php endif; ?>
        <h3>Liste des appartements</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Numéro</th>
                    <th>Superficie</th>
                    <th>Loyer</th>
                    <th>État</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($appartements as $a): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($a['id']); ?></td>
                        <td><?php echo htmlspecialchars($a['numero']); ?></td>
                        <td><?php echo htmlspecialchars($a['superficie']); ?> m²</td>
                        <td><?php echo htmlspecialchars($a['loyer_mensuel']); ?> F</td>
                        <td><?php echo htmlspecialchars($a['etat']); ?></td>
                        <td>
                            <a href="appartements.php?batiment_id=<?php echo $batiment_id; ?>&edit=<?php echo $a['id']; ?>" class="btn btn-sm btn-warning">Modifier</a>
                            <a href="appartements.php?batiment_id=<?php echo $batiment_id; ?>&delete=<?php echo $a['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Supprimer cet appartement ?')">Supprimer</a>
                            <a href="paiements_appartement.php?appartement_id=<?php echo $a['id']; ?>" class="btn btn-sm btn-info">Historique paiements</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <a href="batiments.php" class="btn btn-secondary">Retour aux bâtiments</a>
    </div>
</body>
</html>