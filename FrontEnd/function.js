function updateAuthButton(authBtn) {
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

