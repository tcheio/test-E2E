document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const userIdField = document.getElementById("userId");
    const apiURL = "http://127.0.0.1:9090/api.php"; // Assure-toi que c'est la bonne URL

    // 🔄 Récupérer et afficher les utilisateurs
    async function fetchUsers() {
        try {
            const response = await fetch(apiURL);
            if (!response.ok) throw new Error(`Erreur lors de la récupération des utilisateurs: ${response.status}`);
            const users = await response.json();

            userList.innerHTML = ""; // Vide la liste avant d'ajouter les nouveaux utilisateurs
            users.forEach(user => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${user.name} (${user.email})
                    <button class="edit-button" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}">✏️</button>
                    <button class="delete-button" data-id="${user.id}">❌</button>
                `;
                userList.appendChild(li);
            });
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
        }
    }

    // Ajouter un écouteur d'événements pour la modification
    userList.addEventListener("click", function(event) {
        if (event.target.classList.contains("edit-button")) {
            const id = event.target.getAttribute("data-id");
            const name = event.target.getAttribute("data-name");
            const email = event.target.getAttribute("data-email");
            editUser(id, name, email);
        }
    });

    // Ajouter un écouteur d'événements pour la suppression
    userList.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-button")) {
            const id = event.target.getAttribute("data-id");
            deleteUser(id);
        }
    });

    // 🔹 Ajout ou mise à jour d'un utilisateur
    userForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const userId = userIdField.value.trim();
        const method = userId ? "PUT" : "POST";
        const bodyData = userId ? { id: userId, name, email } : { name, email };

        try {
            const response = await fetch(apiURL, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Erreur lors de l'ajout/mise à jour de l'utilisateur: ${response.status} - ${errorResponse}`);
            }
            const data = await response.json();

            if (data.error) throw new Error(data.error);
            fetchUsers();
            userForm.reset();
            userIdField.value = "";
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout/mise à jour :", error);
        }
    });

    // ✏️ Modifier un utilisateur
    window.editUser = function (id, name, email) {
        document.getElementById("name").value = name;
        document.getElementById("email").value = email;
        userIdField.value = id;
    };

    // ❌ Supprimer un utilisateur
    window.deleteUser = async function (id) {
        try {
            const response = await fetch(`${apiURL}?id=${id}`, { method: "DELETE" });
            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Erreur lors de la suppression de l'utilisateur: ${response.status} - ${errorResponse}`);
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            fetchUsers();
        } catch (error) {
            console.error("❌ Erreur lors de la suppression :", error);
        }
    };

    fetchUsers(); // Charger les utilisateurs dès le chargement de la page
});
