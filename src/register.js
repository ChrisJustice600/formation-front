const API_URL = "http://localhost:5002/api/utilisateurs"; // Remplace par l'URL de ton API

// Fonction pour enregistrer un utilisateur
async function registerUser(username, email, password) {
  const userData = {
    username: username,
    email: email,
    password: password,
  };

  const submitButton = document.querySelector('button[type="submit"]'); // Sélectionner le bouton d'inscription
  const loader = document.getElementById("loader"); // Sélectionner le loader

  // Afficher le loader et masquer le bouton
  loader.style.display = "block";
  submitButton.style.display = "none";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const result = await response.json();

      // throw new Error("Erreur lors de l'enregistrement de l'utilisateur");
      console.log("Utilisateur enregistré avec succès:", result);

    }

    const result = await response.json();
    console.log("Utilisateur enregistré avec succès:", result);
    return result;
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    // Masquer le loader et réafficher le bouton
    loader.style.display = "none";
    submitButton.style.display = "block";
    submitButton.textContent = "S'inscrire"; // Réinitialiser le texte du bouton
  }
}

// Écouteur d'événements pour le formulaire d'inscription
document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    // Validation simple
    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    // Appel à la fonction d'enregistrement
    registerUser(username, email, password);
  });
