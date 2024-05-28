// Import necessary Firebase functions
import { getAuth, sendPasswordResetEmail, signOut , onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Show login form and hide register form
// function showLoginForm() {
//     // Set the display of the login form to block and register form to none
//     document.getElementById('login-form-container').style.display = 'block';
//     // document.getElementById('register-form-container').style.display = 'none';
//
//     // Set the forgot password link to display for the login form
//     // document.getElementById('forgot-password-link').style.display = 'block';
//
//     // Update the active tab styling
//     // document.querySelector('.tab.active').classList.remove('active');
//     // document.querySelector('li[onclick="showLoginForm()"]').classList.add('active');
// }

// Show register form and hide login form
function showRegisterForm() {
    // Set the display of the register form to block and login form to none
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';

    // Hide the forgot password link since it's not needed for the register form
    // document.getElementById('forgot-password-link').style.display = 'none';

    // Update the active tab styling
    // document.querySelector('.tab.active').classList.remove('active');
    // document.querySelector('li[onclick="showRegisterForm()"]').classList.add('active');
}

// Function to reset the password
// function resetPassword() {
//     const email = document.getElementById('login-email').value;
//     if (!email) {
//         alert('Please enter your email address.');
//         return;
//     }
//     const auth = getAuth();
//     sendPasswordResetEmail(auth, email)
//         .then(() => {
//             alert('Password reset email sent!');
//         })
//         .catch((error) => {
//             alert('Error sending password reset email: ' + error.message);
//         });
// }

// Function to toggle the display of user options
function showUserOptions() {
    const userOptions = document.querySelector('.user-options');
    if (userOptions.style.display === 'block') {
        userOptions.style.display = 'none';
    } else {
        userOptions.style.display = 'block';
    }
}

// Implement the logout functionality
function logout() {
    getAuth().signOut().then(() => {
        // Redirect to the login page after successful logout
        window.location.assign('/src/login.html');
    }).catch((error) => {
        console.error('Logout failed:', error);
    });
}

// document.addEventListener('DOMContentLoaded', () => {
//     showLoginForm(); // This will ensure the login form is visible on page load
// });

// Expose functions to global scope
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
// window.resetPassword = resetPassword;
window.showUserOptions = showUserOptions;
window.logout = logout;

// Add event listener for the forgot password form
// document.getElementById('forgot-password-form').addEventListener('submit', async function(event) {
//     event.preventDefault(); // Prevent form submission
//     const email = document.getElementById('forgot-password-email').value;
//     if (!email) {
//         alert('Please enter your email address.');
//         return;
//     }
//     const auth = getAuth();
//     sendPasswordResetEmail(auth, email)
//         .then(() => {
//             alert('Password reset email sent!');
//             document.getElementById('forgot-password-email').value = ''; // Clear the email field after sending the email
//         })
//         .catch((error) => {
//             alert('Error sending password reset email: ' + error.message);
//         });
// });

// Add event listener for the back button in the forgot password form
// document.getElementById('back-button').addEventListener('click', function() {
//     window.location.href = 'login.html'; // Redirect back to login page
// });
