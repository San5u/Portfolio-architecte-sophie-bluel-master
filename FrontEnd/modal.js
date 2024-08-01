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
      loadGalleryImages();
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
    e.target.closest('figure').remove(); // Supprimer l'image du DOM
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

  // Fermer les modales lorsque l'utilisateur clique en dehors
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', closeModal);
  });

  // Ajouter des écouteurs pour les boutons de suppression d'image
  document.getElementById('galleryImages').addEventListener('click', deleteImage);
});

// Fonction pour charger les images de la galerie dans la modale
const loadGalleryImages = () => {
  const galleryImages = document.getElementById('galleryImages');
  if (!galleryImages) {
    console.error("Élément avec l'ID 'galleryImages' non trouvé");
    return;
  }

  // Effacer les images précédentes
  galleryImages.innerHTML = '';

  //  données d'images 
  const images = [
    { src: 'assets/images/abajour-tahina.png', title: 'Abajour Tahina' },
    { src: 'assets/images/appartement-paris-v.png', title: 'Appartement Paris V' },
    { src: 'assets/images/restaurant-sushisen-londres.png', title: 'Restaurant Sushisen - Londres' },
    { src: 'assets/images/la-balisiere.png', title: 'Villa “La Balisiere” - Port Louis' },
    { src: 'assets/images/structures-thermopolis.png', title: 'Structures Thermopolis' },
    { src: 'assets/images/appartement-paris-x.png', title: 'Appartement Paris X' },
    { src: 'assets/images/le-coteau-cassis.png', title: 'Pavillon “Le coteau” - Cassis' },
    { src: 'assets/images/villa-ferneze.png', title: 'Villa Ferneze - Isola d’Elba' },
    { src: 'assets/images/appartement-paris-xviii.png', title: 'Appartement Paris XVIII' },
    { src: 'assets/images/bar-lullaby-paris.png', title: 'Bar “Lullaby” - Paris' },
    { src: 'assets/images/hotel-first-arte-new-delhi.png', title: 'Hotel First Arte - New Delhi' }
  ];

  // Ajouter les images à la modale
  images.forEach(image => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.title;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = image.title;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteImageBtn';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    figure.appendChild(img);
    figure.appendChild(figcaption);
    figure.appendChild(deleteBtn);
    galleryImages.appendChild(figure);
  });
};