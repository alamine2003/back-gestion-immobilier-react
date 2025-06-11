<?php
require_once '../config/database.php';

class AuthController {
    public function login($email, $password) {
        $db = new Database();
        $conn = $db->getConnection();
        $stmt = $conn->prepare('SELECT * FROM utilisateur WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($password, $user['mot_de_passe'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['rôle'];
            header('Location: dashboard.php');
            exit();
        } else {
            return 'Identifiants invalides';
        }
    }
    public function logout() {
        session_destroy();
        header('Location: login.php');
        exit();
    }
} 