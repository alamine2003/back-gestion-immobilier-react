<?php
require_once __DIR__ . '/../config/database.php';

class Location {
    private $conn;
    private $table = 'locations';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getAll() {
        $sql = 'SELECT l.*, a.numero as appartement_numero, b.nom as batiment_nom, lo.nom as locataire_nom, lo.prenom as locataire_prenom
                FROM ' . $this->table . ' l
                JOIN appartements a ON l.appartement_id = a.id
                JOIN batiments b ON a.batiment_id = b.id
                JOIN locataires lo ON l.locataire_id = lo.id';
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (appartement_id, locataire_id, date_debut, duree, montant, conditions, actif) VALUES (:appartement_id, :locataire_id, :date_debut, :duree, :montant, :conditions, :actif)');
        $stmt->bindParam(':appartement_id', $data['appartement_id']);
        $stmt->bindParam(':locataire_id', $data['locataire_id']);
        $stmt->bindParam(':date_debut', $data['date_debut']);
        $stmt->bindParam(':duree', $data['duree']);
        $stmt->bindParam(':montant', $data['montant']);
        $stmt->bindParam(':conditions', $data['conditions']);
        $stmt->bindParam(':actif', $data['actif']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $stmt = $this->conn->prepare('UPDATE ' . $this->table . ' SET appartement_id = :appartement_id, locataire_id = :locataire_id, date_debut = :date_debut, duree = :duree, montant = :montant, conditions = :conditions, actif = :actif WHERE id = :id');
        $stmt->bindParam(':appartement_id', $data['appartement_id']);
        $stmt->bindParam(':locataire_id', $data['locataire_id']);
        $stmt->bindParam(':date_debut', $data['date_debut']);
        $stmt->bindParam(':duree', $data['duree']);
        $stmt->bindParam(':montant', $data['montant']);
        $stmt->bindParam(':conditions', $data['conditions']);
        $stmt->bindParam(':actif', $data['actif']);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function hasActiveLocation($appartement_id) {
        $stmt = $this->conn->prepare('SELECT COUNT(*) FROM ' . $this->table . ' WHERE appartement_id = :appartement_id AND actif = 1');
        $stmt->bindParam(':appartement_id', $appartement_id);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }
} 