<?php
require_once '../models/Batiment.php';

class BatimentController {
    public function index() {
        $batiment = new Batiment();
        return $batiment->getAll();
    }
    public function create($data) {
        $batiment = new Batiment();
        return $batiment->create($data);
    }
    public function update($id, $data) {
        $batiment = new Batiment();
        return $batiment->update($id, $data);
    }
    public function delete($id) {
        $batiment = new Batiment();
        return $batiment->delete($id);
    }
    public function show($id) {
        $batiment = new Batiment();
        return $batiment->getById($id);
    }
} 