<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Classe User : Gère les opérations CRUD sur la table users pour l'authentification et la gestion des utilisateurs.
 */
class User {
    private $conn;
    private $table = 'users';

    /**
     * Constructeur : Initialise la connexion à la base de données.
     */
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Récupère un utilisateur par son email pour l'authentification.
     * @param string $email Email de l'utilisateur
     * @return array|null Données de l'utilisateur ou null si non trouvé
     */
    public function getByEmail($email) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Récupère tous les utilisateurs avec le nom de leur agence.
     * @return array Liste des utilisateurs
     */
    public function getAll() {
        $stmt = $this->conn->query('SELECT u.*, a.nom AS agence_nom FROM ' . $this->table . ' u LEFT JOIN agences a ON u.agence_id = a.id');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param int $id ID de l'utilisateur
     * @return array|null Données de l'utilisateur ou null si non trouvé
     */
    public function getById($id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Crée un nouvel utilisateur.
     * @param array $data Données de l'utilisateur (nom, prenom, email, mot_de_passe, role, agence_id)
     * @return bool Succès de l'opération
     */
    public function create($data) {
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (nom, prenom, email, mot_de_passe, role, agence_id) VALUES (:nom, :prenom, :email, :mot_de_passe, :role, :agence_id)');
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':prenom', $data['prenom']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':mot_de_passe', $data['mot_de_passe']);
        $stmt->bindParam(':role', $data['role']);
        $stmt->bindParam(':agence_id', $data['agence_id']);
        return $stmt->execute();
    }

    /**
     * Met à jour un utilisateur existant.
     * @param int $id ID de l'utilisateur
     * @param array $data Données à mettre à jour
     * @return bool Succès de l'opération
     */
    public function update($id, $data) {
        $sql = 'UPDATE ' . $this->table . ' SET nom = :nom, prenom = :prenom, email = :email';
        if (isset($data['mot_de_passe'])) {
            $sql .= ', mot_de_passe = :mot_de_passe';
        }
        $sql .= ', role = :role, agence_id = :agence_id WHERE id = :id';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':prenom', $data['prenom']);
        $stmt->bindParam(':email', $data['email']);
        if (isset($data['mot_de_passe'])) {
            $stmt->bindParam(':mot_de_passe', $data['mot_de_passe']);
        }
        $stmt->bindParam(':role', $data['role']);
        $stmt->bindParam(':agence_id', $data['agence_id']);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Supprime un utilisateur.
     * @param int $id ID de l'utilisateur
     * @return bool Succès de l'opération
     */
    public function delete($id) {
        $stmt = $this->conn->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}