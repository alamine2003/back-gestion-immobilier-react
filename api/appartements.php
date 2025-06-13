<?php
require_once '../config/cors.php';
require_once '../controllers/AppartementController.php';

$controller = new AppartementController();
$method = $_SERVER['REQUEST_METHOD'];

header("Content-Type: application/json");

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            echo json_encode($controller->show($_GET['id']));
        } elseif (isset($_GET['batiment_id'])) {
            echo json_encode($controller->index($_GET['batiment_id']));
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Paramètre manquant : id ou batiment_id']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $controller->create($data);
        if ($result === true) {
            echo json_encode(['message' => 'Appartement ajouté avec succès']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => $result]);
        }
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        parse_str(file_get_contents("php://input"), $_PUT);
        if ($id) {
            $result = $controller->update($id, $_PUT);
            if ($result === true) {
                echo json_encode(['message' => 'Appartement mis à jour']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => $result]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id && $controller->delete($id)) {
            echo json_encode(['message' => 'Appartement supprimé']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant ou erreur de suppression']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}
