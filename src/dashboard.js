const API_URL = "http://localhost:5002/api/participants"; // Remplace par l'URL de ton API

async function fetchParticipants() {
    const loader = document.getElementById("loader");
    const tableBody = document.querySelector("#participants-table tbody");
    
    loader.style.display = 'block';
    tableBody.innerHTML = ''; // On vide le corps du tableau pendant le chargement
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des participants");
        }
        const participants = await response.json();
        displayParticipants(participants);
    } catch (error) {
        console.error("Erreur:", error);
        alert(`Erreur : ${error.message}`);
    } finally {
        loader.style.display = 'none';
    }
}

function displayParticipants(participants) {
    const tableBody = document.querySelector("#participants-table tbody");
    tableBody.innerHTML = ""; // On vide uniquement le corps du tableau

    participants.forEach(participant => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${participant.matricule_participant}</td>
            <td>${participant.nom}</td>
            <td>${participant.prenom}</td>
            <td>${new Date(participant.date_naissance).toLocaleDateString()}</td>
            <td>${participant.profil}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Appel de la fonction pour récupérer les participants lors du chargement de la page
document.addEventListener("DOMContentLoaded", fetchParticipants);