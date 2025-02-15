<?php

namespace Test;

use \PDO;
use PHPUnit\Framework\TestCase;
use Classe\UserManager;
use Exception;

class UserManagerTest extends TestCase
{
    private UserManager $userManager;
    private PDO $db;

    protected function setUp(): void
    {
        $host = "127.0.0.1";
        $dbname = "user_management";
        $username = "root";
        $password = "";

        $this->db = new PDO("mysql:host=$host;port=3308;dbname=$dbname;charset=utf8", $username, $password);
        $this->userManager = new UserManager($this->db);

        // Nettoyage et préparation de la table avant chaque test
        $this->db->exec("TRUNCATE TABLE users");
    }

    public function testAddUser(): void
    {
        $this->userManager->addUser("John Doe", "johndoe@example.com");
        $users = $this->userManager->getUsers();

        $this->assertCount(1, $users);
        $this->assertEquals("John Doe", $users[0]['name']);
        $this->assertEquals("johndoe@example.com", $users[0]['email']);
        $this->assertNull($users[0]['deadline']); // Vérifie que la date est NULL par défaut
    }

    public function testAddUserWithDeadline(): void
    {
        $this->userManager->addUser("Jane Doe", "janedoe@example.com", "2025-12-31");
        $users = $this->userManager->getUsers();

        $this->assertCount(1, $users);
        $this->assertEquals("Jane Doe", $users[0]['name']);
        $this->assertEquals("janedoe@example.com", $users[0]['email']);
        $this->assertEquals("2025-12-31", $users[0]['deadline']); // Vérifie que la date est bien enregistrée
    }

    public function testUpdateUser(): void
    {
        $this->userManager->addUser("Jane Doe", "janedoe@example.com");
        $user = $this->userManager->getUsers()[0];

        $this->userManager->updateUser($user['id'], "Jane Smith", "janesmith@example.com", "2026-01-01");
        $updatedUser = $this->userManager->getUser($user['id']);

        $this->assertEquals("Jane Smith", $updatedUser['name']);
        $this->assertEquals("janesmith@example.com", $updatedUser['email']);
        $this->assertEquals("2026-01-01", $updatedUser['deadline']); // Vérifie que la date est mise à jour
    }

    public function testRemoveUser(): void
    {
        $this->userManager->addUser("User To Remove", "remove@example.com");
        $user = $this->userManager->getUsers()[0];

        $this->userManager->removeUser($user['id']);
        $users = $this->userManager->getUsers();

        $this->assertCount(0, $users);
    }

    public function testGetUsers(): void
    {
        $this->userManager->addUser("User1", "user1@example.com");
        $this->userManager->addUser("User2", "user2@example.com", "2027-06-15");

        $users = $this->userManager->getUsers();

        $this->assertCount(2, $users);
        $this->assertEquals("2027-06-15", $users[1]['deadline']); // Vérifie que la date est bien stockée
    }

    public function testInvalidUpdateThrowsException(): void
    {
        $this->expectException(Exception::class);
        $this->userManager->updateUser(9999, "Nonexistent User", "nonexistent@example.com", "2030-12-31");
    }

    public function testInvalidDeleteThrowsException(): void
    {
        $this->expectException(Exception::class);
        $this->userManager->removeUser(9999);
    }
}

?>
