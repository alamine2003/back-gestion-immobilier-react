<?php
require_once '../models/Appartement.php';

/**
 * Classe AppartementController : Gère les opérations de gestion des appartements (CRUD).
 */
class AppartementController {
    private $appartement;

    /**
     * Constructeur : Initialise le modèle Appartement.
     */
    public function __construct() {
        $this->appartement = new Appartement();
    }

    /**
     * Affiche la liste des appartements pour un bâtiment.
     * @param int $batiment_id ID du bâtiment
     * @return array Liste des appartements
     */
    public function index($batiment_id) {
        return $this->appartement->getAllByBatiment($batiment_id);
    }

    /**
     * Crée un nouvel appartement avec validation.
     * @param array $data Données du formulaire
     * @return string|bool Message d'erreur ou true si succès
     */
    public function create($data) {
        // Validation des données
        if (empty($data['numero']) || !is_numeric($data['superficie']) || $data['superficie'] <= 5 || 
            !is_numeric($data['loyer_mensuel']) || $data['loyer_mensuel'] <= 0 || empty($data['etat']) || 
            empty($data['batiment_id'])) {
            return 'Données invalides : vérifiez les champs.';
        }
        return $this->appartement->create($data);
    }

    /**
     * Met à jour un appartement avec validation.
     * @param int $id ID de l'appartement
     * @param array $data Données du formulaire
     * @return string|bool Message d'erreur ou true si succès
     */
    public function update($id, $data) {
        // Validation des données
        if (empty($data['numero']) || !is_numeric($data['superficie']) || $data['superficie'] <= 5 || 
            !is_numeric($data['loyer_mensuel']) || $data['loyer_mensuel'] <= 0 || empty($data['etat']) || 
            empty($data['batiment_id'])) {
                return 'Données invalides : vérifiez les champs.';
        }
        return $this->update($id, $data);
    }

    /**
     * Supprime un appartement.
     * @param int $id ID de l'appartement
     * @return bool Succès de l'opération
     */
    public function delete($id) {
        return $this->appartement->delete($id);
    }

    /**
     * Affiche les détails d'un appartement.
     * @param int $id ID de l'appartement
     * @return array|null Données de l'appartement
     */
    public function show($id) {
        return $this->appartement->getById($id);
    }
}