describe('Gestion des utilisateurs', () => {
    beforeEach(() => {
        cy.visit('index.html'); // Assurez-vous que le serveur tourne bien
    });

    it('Ajout d’un utilisateur', () => {
        cy.get('#name').type('John Doe', { delay: 10 }); // Réduit le délai entre chaque frappe
        cy.get('#email').type('johndoe@example.com', { delay: 10 });
        cy.get('#userForm button').click();

        // Vérifier immédiatement que l'élément est bien ajouté
        cy.get('#userList').contains('John Doe').should('be.visible');
        cy.get('#userList').contains('johndoe@example.com').should('be.visible');
    });

    it('Modification d’un utilisateur', () => {
        cy.get('#name').type('John Doe');
        cy.get('#email').type('johndoe@example.com');
        cy.get('#userForm button').click();

        // Modifier l'utilisateur
        cy.get('#userList li').first().find('.edit-button').click();

        cy.get('#name').should('be.visible').clear().type('Jane Doe');
        cy.get('#email').should('be.visible').clear().type('janedoe@example.com');
        cy.get('#userForm button').click();

        // Vérifier l'affichage immédiat
        cy.get('#userList').contains('Jane Doe').should('be.visible');
        cy.get('#userList').contains('janedoe@example.com').should('be.visible');
    });

    it('Suppression d’un utilisateur', () => {
        cy.get('#name').type('User Test');
        cy.get('#email').type('usertest@example.com');
        cy.get('#userForm button').click();

        // Supprimer l'utilisateur
        cy.get('#userList li').first().find('.delete-button').click();

        // Vérifier immédiatement la disparition
        cy.get('#userList').contains('User Test').should('not.exist');
    });
});
