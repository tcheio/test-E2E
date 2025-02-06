<?php

use Classe\UserManager;

require_once '.\Classe\UserManager.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$method = $_SERVER['REQUEST_METHOD'];
$userManager = new UserManager();

try {
    $inputData = json_decode(file_get_contents("php://input"), true);

    switch ($method) {
        case 'POST':
            if (!empty($inputData['name']) && !empty($inputData['email'])) {
                $userManager->addUser($inputData['name'], $inputData['email']);
                echo json_encode(["message" => "Utilisateur ajouté avec succès"]);
            } else {
                throw new Exception("Données manquantes.");
            }
            break;

        case 'GET':
            echo json_encode($userManager->getUsers());
            break;

        case 'DELETE':
            if (!empty($_GET['id'])) {
                $userManager->removeUser($_GET['id']);
                echo json_encode(["message" => "Utilisateur supprimé"]);
            } else {
                throw new Exception("ID manquant pour la suppression.");
            }
            break;

        case 'PUT':
            if (!empty($inputData['id']) && !empty($inputData['name']) && !empty($inputData['email'])) {
                $userManager->updateUser($inputData['id'], $inputData['name'], $inputData['email']);
                echo json_encode(["message" => "Utilisateur mis à jour"]);
            } else {
                throw new Exception("Données manquantes pour la mise à jour.");
            }
            break;

        default:
            throw new Exception("Méthode HTTP non supportée.");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
