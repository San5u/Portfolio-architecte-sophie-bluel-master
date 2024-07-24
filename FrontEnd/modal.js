// Fonction pour afficher la modale
const showModal = (modal) => {
  modal.classList.add("visible");
};

// Ouvrir la modale si le token d'administrateur est trouvé et a la longueur attendue
const openModal = function () {
  const token = sessionStorage.getItem("token");
  
  // Vérifier si le token existe et a la longueur attendue (143 caractères)
  if (token && token.length === 143) {
    const modal = document.querySelector(".modal");
    showModal(modal);

    // Afficher ou masquer des éléments spécifiques à l'administration
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    modalGallery(worksData);

    modalStep = 0;

    // Ajouter les écouteurs d'événements
    modal.addEventListener("click", closeModal);
    document.querySelectorAll(".fa-xmark").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", openNewWorkForm);
  }
};

// Fermer la modale
const closeModal = function (e) {
  const modal = document.querySelector(".modal");
  if (e.target === modal || e.target.classList.contains("fa-xmark")) {
    modal.classList.remove("visible");

    // Supprimer les écouteurs d'événements
    modal.removeEventListener("click", closeModal);
    document.querySelectorAll(".fa-xmark").forEach((el) => {
      el.removeEventListener("click", closeModal);
    });
    document.removeEventListener("click", deleteBtn);
    document.removeEventListener("click", openNewWorkForm);

    modalStep = null;
  }
};

// Appel de la fonction pour ouvrir la modale
openModal();


