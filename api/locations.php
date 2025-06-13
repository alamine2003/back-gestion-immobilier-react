<?php
header('Content-Type: application/json');
require_once '../controllers/LocationController.php';

$controller = new LocationController();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $location = $controller->show($_GET['id']);
            if ($location) {
                echo json_encode($location);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Location non trouvée']);
            }
        } else {
            echo json_encode($controller->index());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Données JSON invalides']);
            exit;
        }
        $result = $controller->create($data);
        if ($result === true) {
            echo json_encode(['message' => 'Location créée avec succès']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Paramètre manquant : id']);
            exit;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Données JSON invalides']);
            exit;
        }
        $result = $controller->update($_GET['id'], $data);
        if ($result === true) {
            echo json_encode(['message' => 'Location mise à jour avec succès']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Paramètre manquant : id']);
            exit;
        }
        $controller->delete($_GET['id']);
        echo json_encode(['message' => 'Location supprimée']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}
