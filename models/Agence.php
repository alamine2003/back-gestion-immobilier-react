<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Classe Agence : Gère les opérations CRUD sur la table agences.
 */
class Agence {
    private $conn;
    private $table = 'agences';

    /**
     * Constructeur : Initialise la connexion à la base de données.
     */
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    /**
     * Récupère toutes les agences.
     * @return array Liste des agences
     */
    public function getAll() {
        $stmt = $this->conn->query('SELECT * FROM ' . $this->table);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupère une agence par son ID.
     * @param int $id ID de l'agence
     * @return array|null Données de l'agence ou null si non trouvée
     */
    public function getById($id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Crée une nouvelle agence.
     * @param array $data Données de l'agence (nom, adresse, email, telephone)
     * @return bool Succès de l'opération
     */
    public function create($data) {
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (nom, adresse, email, telephone) VALUES (:nom, :adresse, :email, :telephone)');
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':adresse', $data['adresse']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telephone', $data['telephone']);
        return $stmt->execute();
    }

    /**
     * Met à jour une agence existante.
     * @param int $id ID de l'agence
     * @param array $data Données à mettre à jour
     * @return bool Succès de l'opération
     */
    public function update($id, $data) {
        $stmt = $this->conn->prepare('UPDATE ' . $this->table . ' SET nom = :nom, adresse = :adresse, email = :email, telephone = :telephone WHERE id = :id');
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':adresse', $data['adresse']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telephone', $data['telephone']);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Supprime une agence.
     * @param int $id ID de l'agence
     * @return bool Succès de l'opération
     */
    public function delete($id) {
        $stmt = $this->conn->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}