const baseApiUrl = "http://localhost:5678/api/";  // Définition de l'URL de base de l'API
const loginBtn = document.getElementById("btnlogin");  // Corriger la déclaration du bouton de connexion
console.log(loginBtn);

function checkLoginStatus() {
  let token = localStorage.getItem("token");
  if (token) {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Login";
  }
}

// Appel de la fonction pour définir l'état initial du bouton
checkLoginStatus();

document.addEventListener("submit", (e) => {
  e.preventDefault();  // Empêche le rechargement de la page lors de la soumission du formulaire

  let form = {
    email: document.getElementById("email"),  // Récupère l'élément du DOM avec l'ID "email"
    password: document.getElementById("password"),  // Récupère l'élément du DOM avec l'ID "password"
  };

  fetch(`${baseApiUrl}users/login`, {
    method: "POST",  // Spécifie que la méthode de la requête est POST
    headers: {
      Accept: "application/json",  // Indique que le client accepte les réponses JSON
      "Content-Type": "application/json",  // Indique que le corps de la requête est en JSON
    },
    body: JSON.stringify({
      email: form.email.value,  // Convertit l'email du formulaire en chaîne JSON
      password: form.password.value,  // Convertit le mot de passe du formulaire en chaîne JSON
    }),
  }).then((response) => {
    if (response.status !== 200) {
      alert("Email ou mot de passe erronés");  // Affiche une alerte si le statut de la réponse n'est pas 200
    } else {
      response.json().then((data) => {
        localStorage.setItem("token", data.token);  // Stocke le token dans le sessionStorage
        loginBtn.textContent = "Logout"; //va changer le bouton login en logout
        window.location.href="index.html";  // Redirige vers la page "index.html"
      });
    }
  });
});

