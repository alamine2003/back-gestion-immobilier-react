<?php
require_once '../models/Location.php';

class LocationController {
    public function index() {
        $location = new Location();
        return $location->getAll();
    }
    public function create($data) {
        $location = new Location();
        // Empêcher la création d'une location active si une location active existe déjà pour cet appartement
        if ($data['actif'] && $location->hasActiveLocation($data['appartement_id'])) {
            return 'Cet appartement a déjà une location active.';
        }
        return $location->create($data);
    }
    public function update($id, $data) {
        $location = new Location();
        // Empêcher la mise à jour en location active si une location active existe déjà pour cet appartement (hors celle-ci)
        if ($data['actif']) {
            $sql = 'SELECT COUNT(*) FROM locations WHERE appartement_id = :appartement_id AND actif = 1 AND id != :id';
            $stmt = $location->conn->prepare($sql);
            $stmt->bindParam(':appartement_id', $data['appartement_id']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->fetchColumn() > 0) {
                return 'Cet appartement a déjà une location active.';
            }
        }
        return $location->update($id, $data);
    }
    public function delete($id) {
        $location = new Location();
        return $location->delete($id);
    }
    public function show($id) {
        $location = new Location();
        return $location->getById($id);
    }
} 