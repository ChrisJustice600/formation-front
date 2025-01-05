const API_URL = "http://localhost:5002/api/domaines";

// Charger les domaines
async function fetchDomaines() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur lors de la récupération des domaines');
        const domaines = await response.json();
        displayDomaines(domaines);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    } finally {
        loader.style.display = 'none';
    }
}

// Afficher les domaines
function displayDomaines(domaines) {
    const tableBody = document.querySelector('#domaines-table tbody');
    tableBody.innerHTML = '';

    domaines.forEach(domaine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${domaine.code_domaine}</td>
            <td>${domaine.nom_domaine}</td>
            <td>${domaine.description}</td>
            <td class="action-buttons">
                <button onclick="editDomaine('${domaine._id}')">Modifier</button>
                <button onclick="deleteDomaine('${domaine._id}')">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Ajouter un domaine
async function addDomaine(domaineData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(domaineData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'ajout du domaine');
        }

        await fetchDomaines();
        document.getElementById('domaine-form').reset();
        alert('Domaine ajouté avec succès !');
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    }
}

// Rechercher des domaines
function searchDomaines(searchTerm) {
    const rows = document.querySelectorAll('#domaines-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchDomaines();

    // Gestionnaire du formulaire
    document.getElementById('domaine-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const domaineData = {
            code_domaine: document.getElementById('code_domaine').value,
            nom_domaine: document.getElementById('nom_domaine').value,
            description: document.getElementById('description').value
        };
        addDomaine(domaineData);
    });

    // Gestionnaire de la recherche
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchDomaines(e.target.value);
    });
});

// Fonctions pour éditer et supprimer (à implémenter selon vos besoins)
function editDomaine(id) {
    console.log('Éditer domaine:', id);
    // Implémenter la logique de modification
}

function deleteDomaine(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
        console.log('Supprimer domaine:', id);
        // Implémenter la logique de suppression
    }
} 