<?php
require_once '../models/Agence.php';

/**
 * Classe AgenceController : Gère les opérations de gestion des agences (CRUD).
 */
class AgenceController {
    private $agence;

    /**
     * Constructeur : Initialise le modèle Agence.
     */
    public function __construct() {
        $this->agence = new Agence();
    }

    /**
     * Affiche la liste des agences.
     * @return array Liste des agences
     */
    public function index() {
        return $this->agence->getAll();
    }

    /**
     * Crée une nouvelle agence avec validation.
     * @param array $data Données du formulaire
     * @return string|bool Message d'erreur ou true si succès
     */
    public function create($data) {
        // Validation des données
        if (empty($data['nom']) || (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL))) {
            return 'Données invalides';
        }
        return $this->agence->create($data);
    }

    /**
     * Met à jour une agence avec validation.
     * @param int $id ID de l'agence
     * @param array $data Données du formulaire
     * @return string|bool Message d'erreur ou true si succès
     */
    public function update($id, $data) {
        // Validation des données
        if (empty($data['nom']) || (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL))) {
            return 'Données invalides';
        }
        return $this->agence->update($id, $data);
    }

    /**
     * Supprime une agence.
     * @param int $id ID de l'agence
     * @return bool Succès de l'opération
     */
    public function delete($id) {
        return $this->agence->delete($id);
    }

    /**
     * Affiche les détails d'une agence.
     * @param int $id ID de l'agence
     * @return array|null Données de l'agence
     */
    public function show($id) {
        return $this->agence->getById($id);
    }
}