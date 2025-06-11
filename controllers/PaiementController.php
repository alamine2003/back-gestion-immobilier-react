<?php
require_once '../models/Paiement.php';
require_once '../models/Location.php';
require_once '../models/Appartement.php';
require_once '../models/Locataire.php';

class PaiementController {
    public function getAllByLocation($location_id) {
        $paiement = new Paiement();
        return $paiement->getAllByLocation($location_id);
    }
    public function create($data) {
        // Récupérer les infos pour le PDF
        $locationModel = new Location();
        $appartementModel = new Appartement();
        $locataireModel = new Locataire();
        $location = $locationModel->getById($data['location_id']);
        $appartement = $appartementModel->getById($location['appartement_id']);
        $locataire = $locataireModel->getById($location['locataire_id']);
        $data['locataire_nom'] = $locataire['nom'];
        $data['locataire_prenom'] = $locataire['prenom'];
        $data['appartement_numero'] = $appartement['numero'];
        return (new Paiement())->create($data);
    }
    public function delete($id) {
        $paiement = new Paiement();
        return $paiement->delete($id);
    }
    public function show($id) {
        $paiement = new Paiement();
        return $paiement->getById($id);
    }
    public function getAllByLocataire($locataire_id) {
        $paiement = new Paiement();
        return $paiement->getAllByLocataire($locataire_id);
    }
    public function getAllByAppartement($appartement_id) {
        $paiement = new Paiement();
        return $paiement->getAllByAppartement($appartement_id);
    }
} 