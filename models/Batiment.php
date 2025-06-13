<?php
require_once __DIR__ . '/../config/database.php';

class Batiment {
    private $conn;
    private $table = 'batiments';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getAll() {
        $stmt = $this->conn->query('SELECT * FROM ' . $this->table);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data, $imageName) {
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (nom, adresse, nb_appartements, proprietaire, agence_id, image) VALUES (:nom, :adresse, :nb_appartements, :proprietaire, :agence_id, :image)');
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':adresse', $data['adresse']);
        $stmt->bindParam(':nb_appartements', $data['nb_appartements']);
        $stmt->bindParam(':proprietaire', $data['proprietaire']);
        $stmt->bindParam(':agence_id', $data['agence_id']);
        $stmt->bindParam(':image', $imageName);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $sql = 'UPDATE ' . $this->table . ' SET nom = :nom, adresse = :adresse, nb_appartements = :nb_appartements, proprietaire = :proprietaire';
        if (isset($data['image'])) {
            $sql .= ', image = :image';
        }
        $sql .= ' WHERE id = :id';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nom', $data['nom']);
        $stmt->bindParam(':adresse', $data['adresse']);
        $stmt->bindParam(':nb_appartements', $data['nb_appartements']);
        $stmt->bindParam(':proprietaire', $data['proprietaire']);
        if (isset($data['image'])) {
            $stmt->bindParam(':image', $data['image']);
        }
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
