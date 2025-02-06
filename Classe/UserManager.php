<?php

namespace Classe;

use \PDO; // ✅ Import the global PDO class
use Exception;
use InvalidArgumentException;

class UserManager
{
    private PDO $db;

    public function __construct()
    {
        $host = "127.0.0.1";
        $dbname = "user_management";
        $username = "root";
        $password = "";
        $this->db = new PDO("mysql:host=$host;port=3308;dbname=$dbname;charset=utf8", $username, $password);
    }

    public function addUser(string $name, string $email): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Email invalide.");
        }

        $stmt = $this->db->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
        $stmt->execute(['name' => $name, 'email' => $email]);
    }

    public function removeUser(int $id): void
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        if ($stmt->rowCount() === 0) {
            throw new Exception("Utilisateur introuvable.");
        }
    }

    public function getUsers(): array
    {
        $stmt = $this->db->query("SELECT * FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUser(int $id): array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user) throw new Exception("Utilisateur introuvable.");
        return $user;
    }

    public function updateUser(int $id, string $name, string $email): void
    {
        $stmt = $this->db->prepare("UPDATE users SET name = :name, email = :email WHERE id = :id");
        $stmt->execute(['id' => $id, 'name' => $name, 'email' => $email]);
        if ($stmt->rowCount() === 0) {
            throw new Exception("Utilisateur introuvable ou aucune modification effectuée.");
        }
    }
}

?>
