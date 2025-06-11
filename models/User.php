<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table = 'users';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getByEmail($email) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (nom, prenom, email, mot_de_passe, rôle, agence_id) VALUES (:nom, :prenom, :email, :mot_de_passe, :role, :agence_id)');
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':prenom', $data['prenom']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':mot_de_passe', $data['mot_de_passe']);
        $stmt->bindParam(':role', $data['rôle']);
        $stmt->bindParam(':agence_id', $data['agence_id']);
        return $stmt->execute();
    }
} 