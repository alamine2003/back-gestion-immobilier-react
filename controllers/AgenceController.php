<?php
require_once '../models/Agence.php';

class AgenceController {

    public function index() {
        $agence = new Agence();
        return $agence->getAll();
    }

    public function show($id) {
        $agence = new Agence();
        return $agence->getById($id);
    }

    private function validate($data) {
        $errors = [];

        if (empty($data['nom'])) {
            $errors[] = "Le nom est requis";
        }
        if (empty($data['adresse'])) {
            $errors[] = "L'adresse est requise";
        }
        if (empty($data['email'])) {
            $errors[] = "L'email est requis";
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "L'email n'est pas valide";
        }
        if (empty($data['telephone'])) {
            $errors[] = "Le téléphone est requis";
        } elseif (!preg_match('/^\d{7,15}$/', $data['telephone'])) {
            $errors[] = "Le téléphone doit contenir uniquement des chiffres (7 à 15 chiffres)";
        }

        return $errors;
    }

    public function create($data) {
        $errors = $this->validate($data);
        if (!empty($errors)) {
            return ['error' => implode(", ", $errors)];
        }

        $agence = new Agence();
        $success = $agence->create($data);

        if ($success) {
            return ['success' => 'Agence créée avec succès'];
        } else {
            return ['error' => 'Erreur lors de la création de l\'agence'];
        }
    }

    public function update($id, $data) {
        $errors = $this->validate($data);
        if (!empty($errors)) {
            return ['error' => implode(", ", $errors)];
        }

        $agence = new Agence();
        $success = $agence->update($id, $data);

        if ($success) {
            return ['success' => 'Agence mise à jour avec succès'];
        } else {
            return ['error' => 'Erreur lors de la mise à jour de l\'agence'];
        }
    }

    public function delete($id) {
        $agence = new Agence();
        $success = $agence->delete($id);

        if ($success) {
            return ['success' => 'Agence supprimée avec succès'];
        } else {
            return ['error' => 'Erreur lors de la suppression de l\'agence'];
        }
    }
}
