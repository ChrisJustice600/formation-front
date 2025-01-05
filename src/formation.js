const API_URL = "http://localhost:5002/api/formateurs"; // Remplace par l'URL de ton API

async function addFormateur(nom, prenom, email, telephone) {
    const formateurData = {
        nom: nom,
        prenom: prenom,
        email: email,
        telephone: telephone,
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
        document.getElementById("formateur-form").reset(); // Réinitialiser le formulaire
    } catch (error) {
        console.error("Erreur:", error);
        document.getElementById("error-message").textContent = `Erreur : ${error.message}`;
    }
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