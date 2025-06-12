<?php
require_once '../config/database.php';
require_once '../models/User.php';

/**
 * Classe UserController : Gère les opérations de gestion des utilisateurs (CRUD).
 */
class UserController {
    private $user;

    /**
     * Constructeur : Initialise le modèle User.
     */
    public function __construct() {
        $this->user = new User();
    }

    /**
     * Affiche la liste des utilisateurs.
     * @return array Liste des utilisateurs
     */
    public function index() {
        return $this->user->getAll();
    }

    /**
     * Crée un nouvel utilisateur avec validation.
     * @param array $data Données du formulaire
     * @return string|bool Message d'erreur ou true si succès
     */
    public function create($data) {
        // Validation des données
        if (empty($data['nom']) || empty($data['prenom']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL) || 
            empty($data['mot_de_passe']) || !in_array($data['role'], ['admin', 'agent'])) {
            return 'Données invalides';
        }
        $data['mot_de_passe'] = password_hash($data['mot_de_passe'], PASSWORD_DEFAULT);
        return $this->user->create($data);
    }

    /**
     * Met à jour un utilisateur avec validation.
     * @param int $id ID de l'utilisateur
     * @param array $data Données du formulaire
     * @return string|bool Message d'erreur ou true si succès
     */
    public function update($id, $data) {
        // Validation des données
        if (empty($data['nom']) || empty($data['prenom']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL) || 
            !in_array($data['role'], ['admin', 'agent'])) {
            return 'Données invalides';
        }
        if (!empty($data['mot_de_passe'])) {
            $data['mot_de_passe'] = password_hash($data['mot_de_passe'], PASSWORD_DEFAULT);
        } else {
            unset($data['mot_de_passe']);
        }
        return $this->user->update($id, $data);
    }

    /**
     * Supprime un utilisateur.
     * @param int $id ID de l'utilisateur
     * @return bool Succès de l'opération
     */
    public function delete($id) {
        return $this->user->delete($id);
    }

    /**
     * Affiche les détails d'un utilisateur.
     * @param int $id ID de l'utilisateur
     * @return array|null Données de l'utilisateur
     */
    public function show($id) {
        return $this->user->getById($id);
    }
}