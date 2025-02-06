<?php

use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\WebDriverBy;
use PHPUnit\Framework\TestCase;

class UserManagerUITest extends TestCase
{
    private RemoteWebDriver $driver;

    protected function setUp(): void
    {
        $host = 'http://localhost:4444/wd/hub'; // Adresse du serveur Selenium
        $this->driver = RemoteWebDriver::create($host, DesiredCapabilities::chrome());
    }

    protected function tearDown(): void
    {
        $this->driver->quit();
    }

    public function testAddUserThroughUI(): void
    {
        $this->driver->get('http://localhost/user-management');

        // Remplir le formulaire d'ajout d'utilisateur
        $this->driver->findElement(WebDriverBy::name('name'))->sendKeys('John Doe');
        $this->driver->findElement(WebDriverBy::name('email'))->sendKeys('johndoe@example.com');
        $this->driver->findElement(WebDriverBy::id('submit'))->click();

        // Vérifier que l'utilisateur a été ajouté dans la liste
        $usersTable = $this->driver->findElement(WebDriverBy::id('users-table'))->getText();
        $this->assertStringContainsString('John Doe', $usersTable);
    }

    public function testDeleteUserThroughUI(): void
    {
        $this->driver->get('http://localhost/user-management');

        // Supposer que l'utilisateur existe déjà
        $deleteButton = $this->driver->findElement(WebDriverBy::cssSelector('.delete-button'));
        $deleteButton->click();

        // Vérifier qu'il a bien été supprimé
        $usersTable = $this->driver->findElement(WebDriverBy::id('users-table'))->getText();
        $this->assertStringNotContainsString('John Doe', $usersTable);
    }
}

?>
