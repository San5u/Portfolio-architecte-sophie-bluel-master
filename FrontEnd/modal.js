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
