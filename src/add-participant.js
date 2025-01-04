const API_URL = "http://localhost:5002/api/participants"; // Remplace par l'URL de ton API

async function addParticipant(matricule, nom, prenom, date_naissance, profil) {
  const participantData = {
    matricule_participant: matricule,
    nom: nom,
    prenom: prenom,
    date_naissance: date_naissance,
    profil: profil,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(participantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'ajout du participant"
      );
    }

    const result = await response.json();
    console.log("Participant ajouté avec succès:", result);
    alert("Participant ajouté avec succès !");
    // Réinitialiser le formulaire
    document.getElementById("participant-form").reset();
  } catch (error) {
    console.error("Erreur:", error);
    document.getElementById(
      "error-message"
    ).textContent = `Erreur : ${error.message}`;
  }
}

// Écouteur d'événements pour le formulaire d'ajout de participant
document
  .getElementById("participant-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const matricule = document.getElementById("matricule").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const date_naissance = document.getElementById("date_naissance").value;
    const profil = document.getElementById("profil").value;

    // Appel à la fonction d'ajout de participant
    addParticipant(matricule, nom, prenom, date_naissance, profil);
  });
