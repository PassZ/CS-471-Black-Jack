// Import necessary Firebase functions
import { getAuth, sendPasswordResetEmail, signOut , onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {auth } from './firebase.js';


// Show register form and hide login form
function showRegisterForm() {
    // Set the display of the register form to block and login form to none
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';
}

// Function to toggle the display of user options
function showUserOptions() {
    const userOptions = document.querySelector('.user-options');
    if( userOptions.style.display === 'block' ){
        userOptions.style.display = 'none';
    }
    else{
        userOptions.style.display = 'block';
    }
}

// Implement the logout functionality
function logout() {
    getAuth().signOut().then(() => {
        // Redirect to the login page after successful logout
        function replaceFilename(path, newFilename) {
            const separator = path.includes('/') ? '/' : '\\'; // Detect the separator
            let parts = path.split(separator);
            parts[parts.length - 1] = newFilename;
            return parts.join(separator);
        }
        window.location.assign( replaceFilename( window.location.pathname , 'login.html'));


    }).catch((error) => {
        console.error('Logout failed:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showLoginForm(); // This will ensure the login form is visible on page load
});

// Expose functions to global scope
window.showRegisterForm = showRegisterForm;
// window.resetPassword = resetPassword;
window.showUserOptions = showUserOptions;
window.logout = logout;
