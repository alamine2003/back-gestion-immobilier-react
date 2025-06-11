<?php
$password = 'admin123'; // Remplacez par le mot de passe souhaité
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Hash du mot de passe: " . $hash;
?> 