// Ouvrir la modale si le token est trouvé et a la longueur attendue
const openModal = function () {
    const token = sessionStorage.getItem("token");
    if (token && token.length === 143) {
      const modal = document.querySelector(".modal");
      modal.classList.add("visible");
  
      document.querySelector("#addPicture").style.display = "none";
      document.querySelector("#editGallery").style.display = "flex";
      modalGallery(worksData);
  
      modalStep = 0;
  
      // Ajouter les écouteurs d'événements
      modal.addEventListener("click", closeModal);
      document.querySelector(".fa-xmark").addEventListener("click", closeModal);
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
      document.querySelector(".fa-xmark").removeEventListener("click", closeModal);
      document.removeEventListener("click", deleteBtn);
      document.removeEventListener("click", openNewWorkForm);
  
      modalStep = null;
    }
  };


// Ouvrir la modale
const openModalImproved = () => {
  const token = sessionStorage.getItem("token");
  if (token && token.length === 143) {
    const modal = document.querySelector(".modal");
    showModal(modal);

    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    modalGallery(worksData);

    modalStep = 0;

    modal.addEventListener("click", closeModalImproved);
    document.querySelector(".fa-xmark").addEventListener("click", closeModalImproved);
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", openNewWorkForm);
  }
};
 