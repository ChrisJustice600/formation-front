const API_URL = "http://localhost:5002/api/utilisateurs/auth"; // Endpoint de l'API pour la connexion

// Fonction pour connecter un utilisateur
async function loginUser(email, password) {
  const userData = {
    email: email,
    password: password,
  };

  const submitButton = document.querySelector('button[type="submit"]'); // Sélectionner le bouton de connexion

  // Afficher le loader dans le bouton
  submitButton.textContent = "En cours...";
  submitButton.disabled = true; // Désactiver le bouton pour éviter plusieurs clics

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include", // Inclut les cookies dans la requête
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la connexion.");
    }

    const result = await response.json();
    console.log("Utilisateur connecté avec succès :", result);

    // Redirection après connexion réussie
    window.location.href = "dashboard.html"; // Page à afficher après connexion
  } catch (error) {
    console.error("Erreur :", error);
    alert(`Erreur : ${error.message}`);
  } finally {
    // Réinitialiser le bouton
    submitButton.textContent = "Se connecter";
    submitButton.disabled = false; // Réactiver le bouton
  }
}

// Gestionnaire d'événement pour le formulaire de connexion
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Appel à la fonction de connexion
    loginUser(email, password);
  });
