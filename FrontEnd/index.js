document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');

    function updateAuthButton() {
        const token = localStorage.getItem('token');
        if (token) {
            authBtn.textContent = 'Logout';
            authBtn.href = '#'; // Pas besoin de lien pour déconnexion
            authBtn.addEventListener('click', () => {
                // Déconnexion
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

    // Met à jour le bouton au chargement de la page
    updateAuthButton();
});