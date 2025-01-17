const API_URL = "http://localhost:5002/api/formations";
const FORMATEURS_API_URL = "http://localhost:5002/api/formateurs";

// Charger les formateurs dans le select
async function loadFormateurs() {
    try {
        const response = await fetch(FORMATEURS_API_URL);
        if (!response.ok) throw new Error('Erreur lors du chargement des formateurs');
        const formateurs = await response.json();
        
        const selectFormateur = document.getElementById('formateur');
        formateurs.forEach(formateur => {
            const option = document.createElement('option');
            option.value = formateur._id;
            option.textContent = `${formateur.nom} ${formateur.prenom}`;
            selectFormateur.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    }
}

// Ajouter une formation
async function addFormation(formationData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formationData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'ajout de la formation');
        }

        await fetchFormations();
        document.getElementById('formation-form').reset();
        alert('Formation ajoutée avec succès !');
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    }
}

// Récupérer et afficher les formations
async function fetchFormations() {
    const loader = document.getElementById('loader');
    const tableBody = document.querySelector('#formations-table tbody');
    
    loader.style.display = 'block';
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur lors de la récupération des formations');
        const formations = await response.json();
        
        displayFormations(formations);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('error-message').textContent = error.message;
    } finally {
        loader.style.display = 'none';
    }
}

// Afficher les formations dans le tableau
function displayFormations(formations) {
    const tableBody = document.querySelector('#formations-table tbody');
    tableBody.innerHTML = '';

    formations.forEach(formation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formation.code_formation}</td>
            <td>${formation.intitule}</td>
            <td>${formation.domaine}</td>
            <td>${formation.nombre_jours}</td>
            <td>${formation.mois}/${formation.annee}</td>
            <td>${formation.formateur ? `${formation.formateur.nom} ${formation.formateur.prenom}` : 'Non assigné'}</td>
            <td class="action-buttons">
                <button onclick="editFormation('${formation._id}')">Modifier</button>
                <button onclick="deleteFormation('${formation._id}')">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Rechercher des formations
function searchFormations(searchTerm) {
    const rows = document.querySelectorAll('#formations-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadFormateurs();
    fetchFormations();

    // Gestionnaire du formulaire
    document.getElementById('formation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formationData = {
            code_formation: document.getElementById('code_formation').value,
            intitule: document.getElementById('intitule').value,
            domaine: document.getElementById('domaine').value,
            nombre_jours: parseInt(document.getElementById('nombre_jours').value),
            annee: parseInt(document.getElementById('annee').value),
            mois: parseInt(document.getElementById('mois').value),
            formateur: document.getElementById('formateur').value
        };
        addFormation(formationData);
    });

    // Gestionnaire de la recherche
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchFormations(e.target.value);
    });
});

// Fonctions pour éditer et supprimer (à implémenter selon vos besoins)
function editFormation(id) {
    // Implémenter la logique de modification
    console.log('Éditer formation:', id);
}

async function deleteFormation(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la suppression de la formation');
            }

            await fetchFormations();
            alert('Formation supprimée avec succès !');
        } catch (error) {
            console.error('Erreur:', error);
            document.getElementById('error-message').textContent = error.message;
        }
    }
}
