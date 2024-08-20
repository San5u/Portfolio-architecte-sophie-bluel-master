// Fonction pour afficher une modale spécifique
const showModal = (modalId) => {
  // Cacher toutes les modales
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('visible');
  });

  // Afficher la modale demandée
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
const closeModal = function (e) {
  const modal = e.target.closest('.modal');
  if (modal) {
    modal.classList.remove('visible');
  }
};

// Fonction pour gérer la suppression d'image
const deleteImage = (e) => {
  if (e.target.closest('.deleteImageBtn')) {
    const button = e.target.closest('.deleteImageBtn');
    const imageId = button.dataset.id;

    // ALERT click sur poubelle avec ID
    alert(`Vous avez cliqué sur l'image avec l'ID : ${imageId}`);

    let token=localStorage.getItem('token');

    //envoi d'une requete Ajax pour supprimer la photo 
    const response = fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: "DELETE",
    headers:{ Authorization: `Bearer ${token}` }
    

    // ... 
  });



    // Supprimer l'image de la galerie dans la modale
    const galleryImages = document.getElementById('galleryImages');
    const imageToRemove = Array.from(galleryImages.getElementsByTagName('figure')).find(f => f.querySelector('.deleteImageBtn').dataset.id === imageId);
    if (imageToRemove) {
      imageToRemove.remove();
    }

    // Supprimer l'image de la galerie principale
    const mainGallery = document.querySelector('.gallery');
    const imageInMainGallery = Array.from(mainGallery.getElementsByTagName('figure')).find(f => f.querySelector('.deleteImageBtn').dataset.id === imageId);
    if (imageInMainGallery) {
      imageInMainGallery.remove();
    }
  }
};

// Ajouter des écouteurs d'événements pour les boutons
document.addEventListener("DOMContentLoaded", function() {
  const editButton = document.getElementById("editButton");
  if (editButton) {
    editButton.addEventListener("click", () => showModal('galleryModal'));
  } else {
    console.error("Élément avec l'ID 'editButton' non trouvé");
  }

  const addPictureBtn = document.getElementById("addPictureBtn");
  if (addPictureBtn) {
    addPictureBtn.addEventListener("click", () => showModal('addPictureModal'));
  } else {
    console.error("Élément avec l'ID 'addPictureBtn' non trouvé");
  }


 // Ajouter des écouteurs d'événements pour fermer les modales
 document.querySelectorAll(".fa-xmark").forEach((el) => {
  el.addEventListener("click", closeModal);
});


  // Ajouter des écouteurs pour les boutons de suppression d'image
  document.getElementById('galleryImages').addEventListener('click', deleteImage);
  document.querySelector('.gallery').addEventListener('click', deleteImage);

  // Charger dynamiquement les images à partir de l'API
  loadGalleryImagesFromApi(); 
});

 

  const loadGalleryImagesFromApi = async () => {
    try {
      const response = await fetch("http://localhost:5678/api/works"); 
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        img.alt = image.title ||  'Image'; 

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = image.title || 'Image'; 

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deleteImageBtn';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.dataset.id = image.id; 
  
        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        galleryImages.appendChild(figure);
  
 // Ajouter les images aussi dans la galerie principale si besoin
 const mainGallery = document.querySelector('.gallery');
 const figureMain = figure.cloneNode(true);
 mainGallery.appendChild(figureMain);
});

    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  //            DEUXIEME PAGE MODALE
  

 

// Fonction pour activer/désactiver le bouton "V alider"
const updateValidateButtonState = () => {
  const photoInput = document.getElementById("photo").files.length > 0;
  const titleInput = document.getElementById("title").value.trim() !== "";
  const categoryInput = document.getElementById("selectCategory").value !== "";

  const validateButton = document.getElementById("valider");

 // Activer le bouton si tous les champs sont remplis
 validateButton.disabled = !(photoInput && titleInput && categoryInput);
};

 // Prévisualiser l'image avant de l'ajouter et mettre à jour l'état du bouton "Valider"
const photoInput = document.getElementById("photo");
photoInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
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

// appel fonction quand c'est chargé
document.addEventListener("DOMContentLoaded", loadCategories);


// les boutons en haut de la deuxieme modale 

document.addEventListener("DOMContentLoaded", function() {
  // Bouton pour revenir à la modale précédente
  document.getElementById("backToPreviousModal").addEventListener("click", function() {
      
      showModal('firstModal');
  });

  // Bouton de fermeture de la modale
  document.querySelector(".modalCloseButton").addEventListener("click", function() {
      
      closeModal();
  });
});