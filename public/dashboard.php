<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
</head>
<body>
    <h2>Bienvenue sur le tableau de bord</h2>
    <p>Rôle : <?php echo htmlspecialchars($_SESSION['user_role']); ?></p>
    <a href="logout.php">Déconnexion</a>
</body>
</html> 