describe('Gestion des utilisateurs', () => {
    beforeEach(() => {
        cy.visit('index.html'); // Assurez-vous que le serveur tourne bien
    });

    // Fonction pour ajouter un utilisateur
    function addUser(name, email) {
        cy.get('#name').clear().type(name);
        cy.get('#email').clear().type(email);
        cy.get('#userForm button').click();
        cy.get('#userList').contains(name).should('exist'); // Vérification immédiate
    }

    // Fonction pour trouver un utilisateur
    function findUser(name) {
        return cy.get('#userList li').contains(name).parent();
    }

    // Fonction pour modifier un utilisateur
    function editUser(oldName, newName, newEmail) {
        findUser(oldName).find('.edit-button').click();
        cy.get('#name').clear().type(newName);
        cy.get('#email').clear().type(newEmail);
        cy.get('#userForm button').click();
        cy.get('#userList').contains(newName).should('exist'); // Vérification rapide
    }

    // Fonction pour supprimer un utilisateur
    function deleteUser(name) {
        findUser(name).find('.delete-button').click();
        cy.get('#userList').contains(name).should('not.exist'); // Vérification rapide
    }

    it('Ajout d’un utilisateur', () => {
        addUser('John Doe', 'johndoe@example.com');
    });

    it('Modification d’un utilisateur', () => {
        addUser('John Doe', 'johndoe@example.com');
        editUser('John Doe', 'Jane Doe', 'janedoe@example.com');
    });

    it('Suppression d’un utilisateur', () => {
        addUser('User Test', 'usertest@example.com');
        deleteUser('User Test');
    });
});
