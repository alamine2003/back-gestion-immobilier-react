<?php
require_once('../config/cors.php');
require_once('../controllers/BatimentController.php');

$controller = new BatimentController();
$method = $_SERVER['REQUEST_METHOD'];

header("Content-Type: application/json");

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            echo json_encode($controller->show($_GET['id']));
        } else {
            echo json_encode($controller->index());
        }
        break;

    case 'POST':
        // Récupérer les données du formulaire et fichiers (multipart/form-data)
        $data = $_POST;
        $files = $_FILES;

        $result = $controller->create($data, $files);
        if ($result === true) {
            echo json_encode(['message' => 'Bâtiment ajouté avec succès']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
            break;
        }

        // En PUT on récupère les données JSON, pas de fichier (complexe à gérer)
        $data = json_decode(file_get_contents("php://input"), true);

        $result = $controller->update($id, $data);
        if ($result === true) {
            echo json_encode(['message' => 'Bâtiment mis à jour']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id && $controller->delete($id)) {
            echo json_encode(['message' => 'Bâtiment supprimé']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Erreur lors de la suppression']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}
