<?php
// Démarrer la session et vérifier les autorisations
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

// Inclure les dépendances
require_once '../controllers/UserController.php';
require_once '../config/database.php';
$controller = new UserController();
$message = '';

// Récupérer les agences pour le formulaire
$db = new Database();
$conn = $db->getConnection();
$agences = $conn->query('SELECT id, nom FROM agences')->fetchAll(PDO::FETCH_ASSOC);

// Gestion des actions
if (isset($_GET['delete'])) {
    $result = $controller->delete($_GET['delete']);
    $message = $result ? 'Utilisateur supprimé !' : 'Erreur lors de la suppression.';
}

if (isset($_POST['edit_id'])) {
    $data = [
        'nom' => $_POST['nom'],
        'prenom' => $_POST['prenom'],
        'email' => $_POST['email'],
        'mot_de_passe' => $_POST['mot_de_passe'],
        'role' => $_POST['role'],
        'agence_id' => $_POST['agence_id'] ? $_POST['agence_id'] : null
    ];
    $result = $controller->update($_POST['edit_id'], $data);
    $message = is_string($result) ? $result : 'Utilisateur modifié !';
}

if (isset($_POST['add'])) {
    $data = [
        'nom' => $_POST['nom'],
        'prenom' => $_POST['prenom'],
        'email' => $_POST['email'],
        'mot_de_passe' => $_POST['mot_de_passe'],
        'role' => $_POST['role'],
        'agence_id' => $_POST['agence_id'] ? $_POST['agence_id'] : null
    ];
    $result = $controller->create($data);
    $message = is_string($result) ? $result : 'Utilisateur ajouté !';
}

$users = $controller->index();
$edit_user = null;
if (isset($_GET['edit'])) {
    $edit_user = $controller->show($_GET['edit']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des utilisateurs</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container my-4">
        <h2 class="mb-4">Gestion des utilisateurs</h2>
        <?php if ($message): ?>
            <div class="alert alert-<?php echo is_string($result) ? 'danger' : 'success'; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        <?php if ($edit_user): ?>
            <h3>Modifier l'utilisateur</h3>
            <form method="post" class="mb-4">
                <input type="hidden" name="edit_id" value="<?php echo htmlspecialchars($edit_user['id']); ?>">
                <div class="mb-3">
                    <label class="form-label">Nom :</label>
                    <input type="text" name="nom" class="form-control" value="<?php echo htmlspecialchars($edit_user['nom']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Prénom :</label>
                    <input type="text" name="prenom" class="form-control" value="<?php echo htmlspecialchars($edit_user['prenom']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email :</label>
                    <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($edit_user['email']); ?>" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mot de passe (laisser vide pour ne pas modifier) :</label>
                    <input type="password" name="mot_de_passe" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Rôle :</label>
                    <select name="role" class="form-select" required>
                        <option value="admin" <?php echo $edit_user['role'] === 'admin' ? 'selected' : ''; ?>>Administrateur</option>
                        <option value="agent" <?php echo $edit_user['role'] === 'agent' ? 'selected' : ''; ?>>Agent immobilier</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Agence :</label>
                    <select name="agence_id" class="form-select">
                        <option value="">Aucune</option>
                        <?php foreach ($agences as $agence): ?>
                            <option value="<?php echo $agence['id']; ?>" <?php echo $edit_user['agence_id'] == $agence['id'] ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($agence['nom']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <a href="users.php" class="btn btn-secondary">Annuler</a>
            </form>
        <?php else: ?>
            <h3>Ajouter un utilisateur</h3>
            <form method="post" class="mb-4">
                <input type="hidden" name="add" value="1">
                <div class="mb-3">
                    <label class="form-label">Nom :</label>
                    <input type="text" name="nom" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Prénom :</label>
                    <input type="text" name="prenom" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email :</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mot de passe :</label>
                    <input type="password" name="mot_de_passe" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Rôle :</label>
                    <select name="role" class="form-select" required>
                        <option value="admin">Administrateur</option>
                        <option value="agent">Agent immobilier</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Agence :</label>
                    <select name="agence_id" class="form-select">
                        <option value="">Aucune</option>
                        <?php foreach ($agences as $agence): ?>
                            <option value="<?php echo $agence['id']; ?>"><?php echo htmlspecialchars($agence['nom']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Ajouter</button>
            </form>
        <?php endif; ?>
        <h3>Liste des utilisateurs</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Agence</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $u): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($u['id']); ?></td>
                        <td><?php echo htmlspecialchars($u['nom']); ?></td>
                        <td><?php echo htmlspecialchars($u['prenom']); ?></td>
                        <td><?php echo htmlspecialchars($u['email']); ?></td>
                        <td><?php echo htmlspecialchars($u['role']); ?></td>
                        <td><?php echo htmlspecialchars($u['agence_nom'] ?? 'Aucune'); ?></td>
                        <td>
                            <a href="users.php?edit=<?php echo $u['id']; ?>" class="btn btn-sm btn-warning">Modifier</a>
                            <a href="users.php?delete=<?php echo $u['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Supprimer cet utilisateur ?')">Supprimer</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <a href="dashboard.php" class="btn btn-secondary">Retour au tableau de bord</a>
    </div>
</body>
</html>