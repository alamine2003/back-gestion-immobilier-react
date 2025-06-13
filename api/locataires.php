<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit();
}

require_once '../controllers/LocataireController.php';
$controller = new LocataireController();

// Récupération de la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $locataire = $controller->show($_GET['id']);
            echo json_encode($locataire);
        } else {
            $locataires = $controller->index();
            echo json_encode($locataires);
        }
        break;

    case 'POST':
        // Lecture du corps JSON
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($_GET['id'])) {
            $controller->update($_GET['id'], $data);
            echo json_encode(['message' => 'Locataire modifié']);
        } else {
            $controller->create($data);
            echo json_encode(['message' => 'Locataire ajouté']);
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        if (isset($_DELETE['id'])) {
            $controller->delete($_DELETE['id']);
            echo json_encode(['message' => 'Locataire supprimé']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID manquant']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}











