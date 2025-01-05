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
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération du domaine');
        const domaine = await response.json();

        // Remplir le formulaire avec les données existantes
        document.getElementById('code_domaine').value = domaine.code_domaine;
        document.getElementById('libelle').value = domaine.libelle;
        document.getElementById('description').value = domaine.description;

        // Modifier le bouton submit et sauvegarder l'ID
        const form = document.getElementById('domaine-form');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Modifier Domaine';
        form.dataset.editId = id;

        // Modifier le gestionnaire de soumission du formulaire
        form.onsubmit = async (e) => {
            e.preventDefault();
            const domaineData = {
                code_domaine: document.getElementById('code_domaine').value,
                libelle: document.getElementById('libelle').value,
                description: document.getElementById('description').value
            };

            try {
                const updateResponse = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(domaineData)
                });

                if (!updateResponse.ok) {
                    const error = await updateResponse.json();
                    throw new Error(error.message || 'Erreur lors de la modification du domaine');
                }

                await fetchDomaines();
                form.reset();
                submitButton.textContent = 'Ajouter Domaine';
                form.onsubmit = null; // Réinitialiser le gestionnaire d'événements
                alert('Domaine modifié avec succès !');
            } catch (error) {
                console.error('Erreur:', error);
                document.getElementById('error-message').textContent = error.message;
            }
        };
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    }
} 