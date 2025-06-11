<?php
require_once '../models/Appartement.php';

class AppartementController {
    public function index($batiment_id) {
        $appartement = new Appartement();
        return $appartement->getAllByBatiment($batiment_id);
    }
    public function create($data) {
        $appartement = new Appartement();
        return $appartement->create($data);
    }
    public function update($id, $data) {
        $appartement = new Appartement();
        return $appartement->update($id, $data);
    }
    public function delete($id) {
        $appartement = new Appartement();
        return $appartement->delete($id);
    }
    public function show($id) {
        $appartement = new Appartement();
        return $appartement->getById($id);
    }
} 