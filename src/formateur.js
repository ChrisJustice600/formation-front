const API_URL = "http://localhost:5002/api/formateurs"; // Remplace par l'URL de ton API

async function addFormateur(nom, prenom, email, telephone, domaine, code_formateur) {
    const formateurData = {
        code_formateur: code_formateur,
        nom: nom,
        prenom: prenom,
        email: email,
        numero_telephone: telephone,
        domaine: domaine
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formateurData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout du formateur");
        }

        const result = await response.json();
        console.log("Formateur ajouté avec succès:", result);
        alert("Formateur ajouté avec succès !");
        document.getElementById("formateur-form").reset();
        fetchFormateurs();
    } catch (error) {
        console.error("Erreur:", error);
        document.getElementById("error-message").textContent = `Erreur : ${error.message}`;
    }
}
 

// Écouteur d'événements pour le formulaire d'ajout de formateur
document.getElementById("formateur-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const code_formateur = document.getElementById("code_formateur").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("email").value;
    const telephone = document.getElementById("telephone").value;
    const domaine = document.getElementById("domaine").value;

    console.log("Prénom:", prenom);
    console.log("Email:", email);
    console.log("Téléphone:", telephone);
    console.log("Domaine:", domaine);
    console.log("Code Formateur:", code_formateur);
    // Appel à la fonction d'ajout de formateur
    addFormateur(nom, prenom, email, telephone, domaine, code_formateur);
});

async function fetchFormateurs() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des formateurs");
        }
        const formateurs = await response.json();
        displayFormateurs(formateurs);
    } catch (error) {
        console.error("Erreur:", error);
        alert(`Erreur : ${error.message}`);
    }
}

function displayFormateurs(formateurs) {
    const tableBody = document.querySelector("#formateurs-table tbody");
    tableBody.innerHTML = ""; // Vider le tableau avant d'ajouter les nouveaux formateurs

    formateurs.forEach(formateur => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formateur.nom}</td>
            <td>${formateur.prenom}</td>
            <td>${formateur.email}</td>
            <td>${formateur.telephone}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Écouteur d'événements pour le formulaire d'ajout de formateur
document.getElementById("formateur-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("email").value;
    const telephone = document.getElementById("telephone").value;

    // Appel à la fonction d'ajout de formateur
    addFormateur(nom, prenom, email, telephone);
});

// Appel de la fonction pour récupérer les formateurs lors du chargement de la page
document.addEventListener("DOMContentLoaded", fetchFormateurs);