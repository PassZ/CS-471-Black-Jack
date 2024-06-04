import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

const auth = getAuth();
// const app = app;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const backButton = document.getElementById('back-button');
    const logoutButton = document.getElementById('logout-button');
    const togglePassword = document.querySelector('#toggle-password');
    const password = document.querySelector('#login-password');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log('Logged in:', userCredential.user);
                    window.location.href = replaceFilename( window.location.href , 'game.html');
                })
                .catch((error) => {
                    console.error('Login failed:', error);
                    alert('Login failed! Please try again.');
                });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log('Registered:', userCredential.user);
                })
                .catch((error) => {
                    console.error('Registration failed:', error);
                });
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('forgot-password-email').value;
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert('Password reset email sent!');
                })
                .catch((error) => {
                    alert('Error sending password reset email: ' + error.message);
                });
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = replaceFilename( window.location.href , 'login.html');
        });
    }
    //  Might need to move this to ui.js
    if(logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }

    if(togglePassword) {
        togglePassword.addEventListener('click', function (e) {
            // Toggle the type attribute
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            // Toggle the eye slash icon
            if (togglePassword.src.match("img/hide.png")) {
                togglePassword.src = "img/show.png";
            } else {
                togglePassword.src = "img/hide.png";
            }
        });
    }
});

// Add listener for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in', user);
        window.location.href = replaceFilename( window.location.href , 'game.html');
    } else {
        console.log('No user is signed in');
    }
});

function replaceFilename(path, newFilename) {
    const separator = path.includes('/') ? '/' : '\\'; // Detect the separator
    let parts = path.split(separator);
    parts[parts.length - 1] = newFilename;
    return parts.join(separator);
}