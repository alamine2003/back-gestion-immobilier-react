<?php
require_once '../models/Batiment.php';

class BatimentController {
    private $batiment;

    public function __construct() {
        $this->batiment = new Batiment();
    }

    public function index() {
        return $this->batiment->getAll();
    }

    public function create($data, $file) {
        // Validation des champs obligatoires
        if (empty($data['nom']) || empty($data['adresse']) || !isset($data['nb_appartements']) || empty($data['proprietaire']) || !isset($data['agence_id'])) {
            return 'Données manquantes';
        }

        // Gestion upload image
        $imageName = null;
        if ($file && isset($file['image']) && $file['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/batiments/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $tmpName = $file['image']['tmp_name'];
            $ext = pathinfo($file['image']['name'], PATHINFO_EXTENSION);
            $imageName = uniqid('batiment_') . '.' . $ext;
            $dest = $uploadDir . $imageName;

            if (!move_uploaded_file($tmpName, $dest)) {
                return 'Erreur lors de l\'upload de l\'image';
            }
        } else {
            return 'Image du bâtiment obligatoire';
        }

        return $this->batiment->create($data, $imageName);
    }

    public function update($id, $data, $file = null) {
        // Si on met à jour une image
        if ($file && isset($file['image']) && $file['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads/batiments/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $tmpName = $file['image']['tmp_name'];
            $ext = pathinfo($file['image']['name'], PATHINFO_EXTENSION);
            $imageName = uniqid('batiment_') . '.' . $ext;
            $dest = $uploadDir . $imageName;

            if (!move_uploaded_file($tmpName, $dest)) {
                return 'Erreur lors de l\'upload de l\'image';
            }
            $data['image'] = $imageName;
        }

        return $this->batiment->update($id, $data);
    }

    public function delete($id) {
        return $this->batiment->delete($id);
    }

    public function show($id) {
        return $this->batiment->getById($id);
    }
}
