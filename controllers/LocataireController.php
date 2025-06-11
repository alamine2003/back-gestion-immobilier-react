<?php
require_once '../models/Locataire.php';

class LocataireController {
    public function index() {
        $locataire = new Locataire();
        return $locataire->getAll();
    }
    public function create($data) {
        $locataire = new Locataire();
        return $locataire->create($data);
    }
    public function update($id, $data) {
        $locataire = new Locataire();
        return $locataire->update($id, $data);
    }
    public function delete($id) {
        $locataire = new Locataire();
        return $locataire->delete($id);
    }
    public function show($id) {
        $locataire = new Locataire();
        return $locataire->getById($id);
    }
} 