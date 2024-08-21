// Fonction pour afficher une modale spécifique
const showModal = (modalId) => {
  // Cacher toutes les modales
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('visible');
  });

  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('visible');

    // Charger les images de la galerie si on ouvre la modale de la galerie
    if (modalId === 'galleryModal') {
      loadGalleryImagesFromApi();
    }
  } else {
    console.error("Modale non trouvée avec l'ID:", modalId);
  }
};

// Fonction pour fermer les modales
const closeModal = (e) => {
  const modal = e.target.closest('.modal');
  if (modal) {
    modal.classList.remove('visible');
  }
};

// Fonction pour gérer la suppression d'image
const deleteImage = async (e) => {
  if (e.target.closest('.deleteImageBtn')) {
    const button = e.target.closest('.deleteImageBtn');
    const imageId = button.dataset.id;

    alert(`Vous avez cliqué sur l'image avec l'ID : ${imageId}`);

    let token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      // Supprimer l'image de la galerie dans la modale
      const galleryImages = document.getElementById('galleryImages');
      const imageToRemove = Array.from(galleryImages.getElementsByTagName('figure'))
        .find(f => f.querySelector('.deleteImageBtn').dataset.id === imageId);
      if (imageToRemove) {
        imageToRemove.remove();
      }

      // Supprimer l'image de la galerie principale
      const mainGallery = document.querySelector('.gallery');
      const imageInMainGallery = Array.from(mainGallery.getElementsByTagName('figure'))
        .find(f => f.querySelector('.deleteImageBtn') && f.querySelector('.deleteImageBtn').dataset.id === imageId);
      if (imageInMainGallery) {
        imageInMainGallery.remove();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image :', error);
    }
  }
};

// Fonction pour activer/désactiver le bouton "Valider"
const updateValidateButtonState = () => {
  const photoInput = document.getElementById("photo").files.length > 0;
  const titleInput = document.getElementById("title").value.trim() !== "";
  const categoryInput = document.getElementById("selectCategory").value !== "";

  const validateButton = document.getElementById("valider");
  validateButton.disabled = !(photoInput && titleInput && categoryInput);
};

// Prévisualiser l'image avant de l'ajouter et mettre à jour l'état du bouton "Valider"
const photoInput = document.getElementById("photo");
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById("picturePreviewImg");
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      updateValidateButtonState();
    };
    reader.readAsDataURL(file);
  }
});

// Écouter les changements dans les autres champs
document.getElementById("title").addEventListener("input", updateValidateButtonState);
document.getElementById("selectCategory").addEventListener("change", updateValidateButtonState);

const loadCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const categories = await response.json();

    const categorySelect = document.getElementById("selectCategory");
    categorySelect.innerHTML = '<option value="" disabled selected>Choisissez une catégorie</option>'; 

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
};

// Charger les images de la galerie depuis l'API
const loadGalleryImagesFromApi = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const images = await response.json();

    const galleryImages = document.getElementById('galleryImages');
    galleryImages.innerHTML = '';

    const mainGallery = document.querySelector('.gallery');
    mainGallery.innerHTML = '';

    images.forEach(image => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = image.imageUrl;
      img.alt = image.title || 'Image';

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = image.title || 'Image';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'deleteImageBtn';
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteBtn.dataset.id = image.id;

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      galleryImages.appendChild(figure);

      // Ajouter les images aussi dans la galerie principale sans le bouton de suppression
      const figureMain = document.createElement('figure');
      figureMain.appendChild(img.cloneNode(true));
      figureMain.appendChild(figcaption.cloneNode(true));
      mainGallery.appendChild(figureMain);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des images :', error);
  }
};

// Fonction pour vérifier le statut de connexion
function checkLoginStatus() {
  const token = localStorage.getItem('token');
  return !!token; // Retourne vrai si un token est présent, sinon faux
}

// Fonction pour mettre à jour le bouton d'authentification et gérer la déconnexion
function updateAuthButton(authBtn) {
  const isLoggedIn = checkLoginStatus();
  if (isLoggedIn) {
    authBtn.textContent = 'Logout';
    authBtn.href = '#'; // Pas besoin de lien pour déconnexion
    authBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      authBtn.textContent = 'Login';
      authBtn.href = 'login.html'; // Redirige vers la page de connexion
      alert('Vous avez été déconnecté.');
      window.location.href = 'login.html'; // Redirige vers la page de connexion
    });
  } else {
    authBtn.textContent = 'Login';
    authBtn.href = 'login.html'; // Redirige vers la page de connexion
  }
}

// Fonction pour récupérer les projets via l'API
async function fetchProjets() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des projets :', error);
    return [];
  }
}

// Fonction pour récupérer les catégories via l'API avec gestion des erreurs
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des catégories :', error);
    return [];
  }
}

// Fonction pour afficher la galerie de projets
function afficherGalerie(projets) {
  const galerie = document.querySelector(".gallery");
  galerie.innerHTML = "";
  projets.forEach(projet => {
    const articleElement = document.createElement("article");
    articleElement.classList.add("projet");
    articleElement.setAttribute("id", "projetGalerie-" + projet.id);
    const imageElement = document.createElement("img");
    imageElement.src = projet.imageUrl;
    imageElement.alt = projet.title;
    const nomElement = document.createElement("h3");
    nomElement.innerText = projet.title;
    articleElement.appendChild(imageElement);
    articleElement.appendChild(nomElement);
    galerie.appendChild(articleElement);
  });
}

// Fonction pour filtrer et afficher les projets par catégorie
function filtrerGalerie(projets, categoryId) {
  const projetsFiltrees = categoryId === 0 ? projets : projets.filter(projet => projet.categoryId === categoryId);
  afficherGalerie(projetsFiltrees);
}

// Fonction pour afficher ou masquer les catégories en fonction du statut de connexion
function toggleCategoriesVisibility(categorieSection) {
  const isLoggedIn = checkLoginStatus();
  if (isLoggedIn) {
    categorieSection.style.display = 'none'; // Masquer les boutons de catégorie si l'utilisateur est connecté
  } else {
    categorieSection.style.display = ''; // Laisse le CSS gérer le display
  }
}

// Fonction pour afficher ou masquer le bouton "Modifier" et l'icône associée
function toggleEditButtonVisibility(editButton) {
  const isLoggedIn = checkLoginStatus();
  if (isLoggedIn) {
    editButton.style.display = ''; // Afficher le bouton "Modifier" si l'utilisateur est connecté
    const editButtonDiv = document.querySelector('.edit-button');
    if (editButtonDiv) {
      editButtonDiv.style.display = ''; // Afficher l'icône de l'éditeur si l'utilisateur est connecté
    }
  } else {
    editButton.style.display = 'none'; // Masquer le bouton "Modifier" si l'utilisateur n'est pas connecté
    const editButtonDiv = document.querySelector('.edit-button');
    if (editButtonDiv) {
      editButtonDiv.style.display = 'none'; // Masquer l'icône de l'éditeur si l'utilisateur n'est pas connecté
    }
  }
}

// Gestion du DOM au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  const authBtn = document.getElementById('auth-btn');
  const editButton = document.getElementById('editButton'); // Ajout pour le bouton "Modifier"
  const categorieSection = document.querySelector('.categorie'); // Assurez-vous que la classe est correcte

  // Met à jour le bouton d'authentification au chargement de la page
  if (authBtn) {
    updateAuthButton(authBtn);
  } else {
    console.error("Élément avec l'ID 'auth-btn' non trouvé");
  }

  // Afficher ou masquer les catégories en fonction du statut de connexion
  if (categorieSection) {
    toggleCategoriesVisibility(categorieSection);
  } else {
    console.error("Élément avec la classe 'categorie' non trouvé");
  }

  // Afficher ou masquer le bouton "Modifier"
  if (editButton) {
    toggleEditButtonVisibility(editButton);
  } else {
    console.error("Élément avec l'ID 'editButton' non trouvé");
  }

  // Récupération des projets et catégories via fetch
  const projets = await fetchProjets();
  const categories = await fetchCategories();

  categories.unshift({ id: 0, name: "Tous" });

  // Création des boutons de catégorie
  categories.forEach(category => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = category.name;
    bouton.addEventListener("click", () => {
      filtrerGalerie(projets, category.id);
    });
    categorieSection.appendChild(bouton);
  });

  // Afficher tous les projets au chargement de la page
  afficherGalerie(projets);

  // Ajouter des écouteurs d'événements pour les boutons
  const addPictureBtn = document.getElementById("addPictureBtn");
  if (addPictureBtn) {
    addPictureBtn.addEventListener("click", () => showModal('addPictureModal'));
  } else {
    console.error("Élément avec l'ID 'addPictureBtn' non trouvé");
  }

  // Ajouter des écouteurs d'événements pour fermer les modales
  document.querySelectorAll(".fa-xmark").forEach(el => {
    el.addEventListener("click", closeModal);
  });

  // Ajouter des écouteurs pour les boutons de suppression d'image
  document.getElementById('galleryImages').addEventListener('click', deleteImage);
  document.querySelector('.gallery').addEventListener('click', deleteImage);

  // Charger dynamiquement les images à partir de l'API
  loadGalleryImagesFromApi(); 

  // Les boutons en haut de la deuxième modale
  document.getElementById("backToPreviousModal").addEventListener("click", () => {
    showModal('firstModal');
  });

  document.querySelector(".modalCloseButton").addEventListener("click", closeModal);

  // Charger les catégories pour le formulaire d'ajout d'image
  loadCategories();
});