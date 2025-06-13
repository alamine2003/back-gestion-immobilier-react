<?php
header('Content-Type: application/json');
require_once '../controllers/AgenceController.php';

$controller = new AgenceController();

// Autorisation (à améliorer plus tard avec un vrai token)
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit();
}

// Méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $agence = $controller->show($id);
            if ($agence) {
                echo json_encode($agence);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Agence non trouvée']);
            }
        } else {
            echo json_encode($controller->index());
        }
        break;

    case 'POST':
        $result = $controller->create($input);
        if ($result === true) {
            http_response_code(201);
            echo json_encode(['message' => 'Agence ajoutée avec succès']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requis pour la mise à jour']);
            break;
        }
        $result = $controller->update($id, $input);
        if ($result === true) {
            echo json_encode(['message' => 'Agence mise à jour']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requis pour la suppression']);
            break;
        }
        $deleted = $controller->delete($id);
        if ($deleted) {
            echo json_encode(['message' => 'Agence supprimée']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur lors de la suppression']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}
