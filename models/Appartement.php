<?php
require_once __DIR__ . '/../config/database.php';

class Appartement {
    private $conn;
    private $table = 'appartements';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getAllByBatiment($batiment_id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE batiment_id = :batiment_id');
        $stmt->bindParam(':batiment_id', $batiment_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (batiment_id, numero, superficie, loyer_mensuel, etat) VALUES (:batiment_id, :numero, :superficie, :loyer_mensuel, :etat)');
        $stmt->bindParam(':batiment_id', $data['batiment_id']);
        $stmt->bindParam(':numero', $data['numero']);
        $stmt->bindParam(':superficie', $data['superficie']);
        $stmt->bindParam(':loyer_mensuel', $data['loyer_mensuel']);
        $stmt->bindParam(':etat', $data['etat']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $stmt = $this->conn->prepare('UPDATE ' . $this->table . ' SET numero = :numero, superficie = :superficie, loyer_mensuel = :loyer_mensuel, etat = :etat WHERE id = :id');
        $stmt->bindParam(':numero', $data['numero']);
        $stmt->bindParam(':superficie', $data['superficie']);
        $stmt->bindParam(':loyer_mensuel', $data['loyer_mensuel']);
        $stmt->bindParam(':etat', $data['etat']);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getAll() {
        $stmt = $this->conn->query('SELECT * FROM ' . $this->table);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
} 