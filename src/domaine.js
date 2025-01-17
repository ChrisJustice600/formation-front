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
async function displayDomaines(domaines) {
    const tableBody = document.querySelector('#domaines-table tbody');
    tableBody.innerHTML = '';

    try {
        // Récupérer les formations et formateurs pour les statistiques
        const formationsResponse = await fetch('http://localhost:5002/api/formations');
        const formateursResponse = await fetch('http://localhost:5002/api/formateurs');
        
        const formations = await formationsResponse.json();
        const formateurs = await formateursResponse.json();

        domaines.forEach(domaine => {
            // Calculer les statistiques
            const nbFormations = formations.filter(f => f.domaine === domaine.libelle).length;
            const nbFormateurs = formateurs.filter(f => f.domaine === domaine.libelle).length;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${domaine.code_domaine}</td>
                <td>${domaine.libelle}</td>
                <td>${domaine.description}</td>
                <td>${nbFormations}</td>
                <td>${nbFormateurs}</td>
                <td class="action-buttons">
                    <button onclick="editDomaine('${domaine._id}')" class="edit-btn">Modifier</button>
                    <button onclick="deleteDomaine('${domaine._id}')" class="delete-btn">Supprimer</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        document.getElementById('error-message').textContent = error.message;
    }
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
            libelle: document.getElementById('libelle').value,
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
async function deleteDomaine(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression du domaine');
            }

            await fetchDomaines();
            alert('Domaine supprimé avec succès !');
        } catch (error) {
            console.error('Erreur:', error);
            document.getElementById('error-message').textContent = error.message;
        }
    }
}

async function editDomaine(id) {
    const domaineData = {
        libelle: prompt("Entrez le nouveau libellé du domaine :"),
        description: prompt("Entrez la nouvelle description du domaine :")
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(domaineData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la mise à jour du domaine');
        }

        await fetchDomaines();
        alert('Domaine mis à jour avec succès !');
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    }
} 