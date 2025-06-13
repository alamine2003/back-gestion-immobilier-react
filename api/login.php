<?php
session_start();
require_once '../controllers/AuthController.php';

$auth = new AuthController();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = $auth->login($_POST['email'], $_POST['password']);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
</head>
<body>
    <h2>Connexion</h2>
    <?php if ($message) echo '<p style="color:red;">'.$message.'</p>'; ?>
    <form method="post">
        <label>Email :</label><br>
        <input type="email" name="email" required><br>
        <label>Mot de passe :</label><br>
        <input type="password" name="password" required><br><br>
        <button type="submit">Se connecter</button>
    </form>
</body>
</html> 