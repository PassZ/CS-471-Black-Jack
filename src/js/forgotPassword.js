import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
// Function to handle the "Back to Login" button click event
function backToLogin() {
    // Redirect to the login page
    window.location.href = 'login.html';
}

// Add event listener to the "Back to Login" button
document.getElementById('back-button').addEventListener('click', backToLogin);


// Function to handle the form submission for password reset
function resetPassword() {
    const email = document.getElementById('forgot-password-email').value;
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent!');
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+email);
            document.getElementById('forgot-password-email').value = ''; // Clear the email field after sending the email
        })
        .catch((error) => {
            alert('Error sending password reset email: ' + error.message);
        });
}

// Add event listener to the form submission for password reset
document.getElementById('forgot-password-form').addEventListener('submit', resetPassword);

window.resetPassword = resetPassword;