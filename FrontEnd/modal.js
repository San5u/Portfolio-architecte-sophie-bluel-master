const showModal = (modalId, event = null) => {
  if (event) {
    event.preventDefault(); 
  }

  // Cacher toutes les modales
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('visible');
  });

  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('visible');

    // Charger images galerie si modal galerie
    if (modalId === 'galleryModal') {
      loadGalleryImagesFromApi();
    }
  } else {
    console.error("Modale non trouvée avec l'ID:", modalId);
  }
};

// Fonction fermer modales
const closeModal = (e) => {
  const modal = e.target.closest('.modal');
  if (modal) {
    modal.classList.remove('visible');
    document.body.style.overflow = 'auto';
  }
};

// Fonction suppression image
const deleteImage = async (e) => {
  if (e.target.closest('.deleteImageBtn')) {
    e.preventDefault(); // évite le rafraîchissement

    const button = e.target.closest('.deleteImageBtn');
    const imageId = button.dataset.id;

    let token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      // Supprimer image de la galerie dans modal
      const galleryImages = document.getElementById('galleryImages');
      const imageToRemove = Array.from(galleryImages.getElementsByTagName('figure'))
        .find(f => f.querySelector('.deleteImageBtn').dataset.id === imageId);
      if (imageToRemove) {
        imageToRemove.remove();
      }

      // Supprimer image de la galerie principale
      const mainGallery = document.querySelector('.gallery');
      const imageInMainGallery = Array.from(mainGallery.getElementsByTagName('figure'))
        .find(f => f.querySelector('img').src === imageToRemove.querySelector('img').src);
      if (imageInMainGallery) {
        imageInMainGallery.remove();
      }

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image :', error);
    }
  }
};

// Fonction activer/désactiver bouton "Valider"
const updateValidateButtonState = () => {
  const photoInput = document.getElementById("photo").files.length > 0;
  const titleInput = document.getElementById("title").value.trim() !== "";
  const categoryInput = document.getElementById("selectCategory").value !== "";

  const validateButton = document.getElementById("valider");
  validateButton.disabled = !(photoInput && titleInput && categoryInput);
};
// Previsu image avant ajout + maj état bouton "Valider"
const photoInput = document.getElementById("photo");
const browseButton = document.getElementById("browsePictures"); 
const previewImg = document.getElementById("picturePreviewImg");

// Événement de changement pour l'input photo
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    const objectURL = URL.createObjectURL(file);
    previewImg.src = objectURL;
    previewImg.style.display = "block";
    browseButton.style.display = "none"; 
  } else {
    previewImg.style.display = "none";
    browseButton.style.display = "block"; 
  }
});

// Fonction pour réinitialiser le formulaire et le bouton
const resetForm = () => {
  photoInput.value = ""; 
  document.getElementById("title").value = "";
  document.getElementById("selectCategory").value = "";
  previewImg.style.display = "none"; 
  browseButton.style.display = "block"; 
  updateValidateButtonState(); // Desactiver bouton valider
};

// appel fonction  reinitialisation
document.getElementById("resetButton")?.addEventListener("click", resetForm);

// Écouter changements dans autres champs
document.getElementById("title").addEventListener("input", updateValidateButtonState);
document.getElementById("selectCategory").addEventListener("change", updateValidateButtonState);

// Ajouter l'événement click pour le bouton Valider
const validateButton = document.getElementById("valider");
validateButton.addEventListener("click", async (event) => {
  event.preventDefault(); 

  const fichier = photoInput.files[0];
  const titre = document.getElementById("title").value.trim();
  const categorieId = document.getElementById("selectCategory").options[document.getElementById("selectCategory").selectedIndex].value;

  if (fichier && titre && categorieId) {
    const formData = new FormData();
    formData.append('image', fichier);
    formData.append('title', titre);
    formData.append('category', categorieId);

    let token = localStorage.getItem('token');

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      const image = await response.json();

      // Ajouter l'image à la galerie  sans suppr les autre
      const gallery = document.querySelector('.gallery');
      if (gallery) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = image.imageUrl;
        img.alt = titre;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = titre;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure); 
      }

      // Reinitialiser le form après ajout
      resetForm();

      // Réafficher le bouton "Ajouter photo"
      browseButton.style.display = "block";

      // Reinitialiser la modale pour permettre de nouveau les clics
      loadGalleryImagesFromApi();

      // Fermer la fenêtre modale
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.style.display = "visible";
        document.body.style.overflow = "auto"; 
      }

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image :', error);
    }
  } else {
    console.warn('Tous les champs doivent être remplis.');
  }
});

const loadCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const categories = await response.json();

    const categorySelect = document.getElementById("selectCategory");
    categorySelect.innerHTML = '<option value="" disabled selected></option>'; 

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

// Charger images galerie depuis API
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

      // Ajouter images aussi dans galerie principale sans bouton suppression
      const figureMain = document.createElement('figure');
      figureMain.appendChild(img.cloneNode(true));
      figureMain.appendChild(figcaption.cloneNode(true));
      mainGallery.appendChild(figureMain);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des images :', error);
  }
};

// Fonction vérifier statut connexion
function checkLoginStatus() {
  const token = localStorage.getItem('token');
  return !!token; // Retourne vrai si token présent, sinon faux
}

// Fonction mettre à jour bouton auth et gérer déconnexion
function updateAuthButton(authBtn) {
  const isLoggedIn = checkLoginStatus();
  if (isLoggedIn) {
    authBtn.textContent = 'Logout';
    authBtn.href = '#'; // Pas besoin de lien pour déconnexion
    authBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      authBtn.textContent = 'Login';
      authBtn.href = 'login.html'; // Redirige vers page de connexion
      alert('Vous avez été déconnecté.');
      window.location.href = 'login.html'; // Redirige vers page de connexion
    });
  } else {
    authBtn.textContent = 'Login';
    authBtn.href = 'login.html'; // Redirige vers page de connexion
  }
}

// Fonction récupérer projets via API
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

// Fonction récupérer catégories via API avec gestion erreurs
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

// Fonction afficher galerie projets
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

// Fonction filtrer et afficher projets par catégorie
function filtrerGalerie(projets, categoryId) {
  const projetsFiltrees = categoryId === 0 ? projets : projets.filter(projet => projet.categoryId === categoryId);
  afficherGalerie(projetsFiltrees);
}

// Fonction afficher ou masquer catégories selon statut connexion
function toggleCategoriesVisibility(categorieSection) {
  const isLoggedIn = checkLoginStatus();
  if (isLoggedIn) {
    categorieSection.style.display = 'none'; // Masquer boutons catégorie si connecté
  } else {
    categorieSection.style.display = ''; // Laisser CSS gérer display
  }
}

// Fonction afficher ou masquer bouton "Modifier" et icône associée
function toggleEditButtonVisibility(editButton) {
  const isLoggedIn = checkLoginStatus();
  if (isLoggedIn) {
    editButton.style.display = ''; // Afficher bouton "Modifier" si connecté
    const editButtonDiv = document.querySelector('.edit-button');
    if (editButtonDiv) {
      editButtonDiv.style.display = ''; // Afficher icône éditeur si connecté
    }
  } else {
    editButton.style.display = 'none'; // Masquer bouton "Modifier" si non connecté
    const editButtonDiv = document.querySelector('.edit-button');
    if (editButtonDiv) {
      editButtonDiv.style.display = 'none'; // Masquer icône editeur si non connecté
    }
  }
}

function toggleBandeauVisibility() {
  const isLoggedIn = checkLoginStatus(); // utilisateur co ou pas
  const bandeau = document.querySelector('.bandeau');
  
  if (isLoggedIn) {
    bandeau.style.display = 'flex'; // Afficher le bandeau si connecté
  } else {
    bandeau.style.display = 'none'; // Masquer le bandeau si non connectée
  }
}

document.addEventListener('DOMContentLoaded', toggleBandeauVisibility);

// Gestion DOM au chargement page
document.addEventListener('DOMContentLoaded', async () => {
  const authBtn = document.getElementById('auth-btn');
  const editButtonDiv =  document.querySelector('.edit-button'); // Ajout pour bouton "Modifier"
  const categorieSection = document.querySelector('.categorie'); // Assurez-vous classe correcte

  // Met à jour bouton auth au chargement page
  if (authBtn) {
    updateAuthButton(authBtn);
  } else {
    console.error("Élément avec l'ID 'auth-btn' non trouvé");
  }

  // Afficher ou masquer catégories selon statut connexion
  if (categorieSection) {
    toggleCategoriesVisibility(categorieSection);
  } else {
    console.error("Élément avec la classe 'categorie' non trouvé");
  }

    // Afficher ou masquer bouton "Modifier"
    if (editButtonDiv) {
      toggleEditButtonVisibility(editButtonDiv);
  
      // Ajout de l'événement onclick pour ouvrir la modale
      editButtonDiv.onclick = function() {
        showModal('galleryModal');
      };
    } else {
      console.error("Élément avec l'ID 'editButton' non trouvé");
    }


const editModeButton = document.querySelector('.bandeau .modifier'); 

if (editModeButton) {
  editModeButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    showModal('galleryModal'); // Ouvre la première modale 
  });
} else {
  console.error("Élément avec la classe 'modifier' non trouvé dans le bandeau");
}

  // Récupérer projets et catégories via fetch
  const projets = await fetchProjets();
  const categories = await fetchCategories();

  categories.unshift({ id: 0, name: "Tous" });

  // Création boutons catégorie
  categories.forEach(category => {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = category.name;
    bouton.addEventListener("click", () => {
      filtrerGalerie(projets, category.id);
    });
    categorieSection.appendChild(bouton);
  });

  // Afficher tous projets au chargement page
  afficherGalerie(projets);

  // Ajouter écouteurs événements pour boutons
  const addPictureBtn = document.getElementById("addPictureBtn");
  if (addPictureBtn) {
    addPictureBtn.addEventListener("click", () => showModal('addPictureModal'));
  } else {
    console.error("Élément avec l'ID 'addPictureBtn' non trouvé");
  }

  // Ajouter écouteurs événements pour fermer modales
  document.querySelectorAll(".fa-xmark").forEach(el => {
    el.addEventListener("click", closeModal);
  });

  // Ajouter écouteurs pour boutons suppression image
  document.getElementById('galleryImages').addEventListener('click', deleteImage);
  document.querySelector('.gallery').addEventListener('click', deleteImage);


  
  // Charger dynamiquement images depuis API
  loadGalleryImagesFromApi(); 

  // Boutons haut deuxième modal
  document.getElementById("backToPreviousModal").addEventListener("click", () => {
    showModal('galleryModal');
  });

  document.querySelector(".modalCloseButton").addEventListener("click", closeModal);

  // Charger catégories pour formulaire ajout image
  loadCategories();
});


