const { Builder, By, Key, until } = require("selenium-webdriver");

async function testGestionProduit() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("http://127.0.0.1:8080/gestion_produit/");
        await driver.manage().window().setRect({ width: 1054, height: 896 });

        // Supprimer l'utilisateur "Test User" s'il existe déjà
        try {
            let existingUser = await driver.findElements(By.xpath("//li[contains(text(), 'Test User')]"));
            if (existingUser.length > 0) {
                let deleteButton = await driver.findElement(By.xpath("//button[contains(@class, 'delete-button')][@data-name='Test User']"));
                await deleteButton.click();
                await driver.sleep(2000);
            }
        } catch (error) {
            console.log("🔹 Aucun utilisateur 'Test User' à supprimer.");
        }

        // Ajouter un nouvel utilisateur
        let nameField = await driver.findElement(By.id("name"));
        let emailField = await driver.findElement(By.id("email"));
        let submitButton = await driver.findElement(By.css("button[type='submit']"));

        await nameField.sendKeys("Test User");
        await emailField.sendKeys("testuser@mail.com");
        await submitButton.click();

        await driver.sleep(2000);

        await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Test User')]")), 5000);

        let editButton = await driver.findElement(By.xpath("//button[contains(@class, 'edit-button')][@data-name='Test User']"));
        await editButton.click();

        await driver.sleep(1000);

        await emailField.clear();
        await emailField.sendKeys("testuser_updated@mail.com");
        await submitButton.click();

        await driver.sleep(2000);

        await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'testuser_updated@mail.com')]")), 5000);

        let deleteButton = await driver.findElement(By.xpath("//button[contains(@class, 'delete-button')][@data-name='Test User']"));
        await deleteButton.click();

        await driver.sleep(2000);

        let userDeleted = await driver.findElements(By.xpath("//li[contains(text(), 'Test User')]"));
        if (userDeleted.length === 0) {
            console.log("✅ L'utilisateur a été supprimé avec succès !");
        } else {
            console.error("❌ L'utilisateur n'a pas été supprimé.");
        }

    } finally {
        await driver.quit();
    }
}

testGestionProduit();
