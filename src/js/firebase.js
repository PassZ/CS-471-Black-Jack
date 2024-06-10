// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8ZCc3HB5ZQSSQJu4t-5aLj767JKzsjwU",
  authDomain: "cs-471-black-jack.firebaseapp.com",
  projectId: "cs-471-black-jack",
  storageBucket: "cs-471-black-jack.appspot.com",
  messagingSenderId: "323711806885",
  appId: "1:323711806885:web:61e980d6ad56c02ed8cc4c",
  measurementId: "G-3KKX3W76WB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, analytics, auth };

// Listen to the authentication state
onAuthStateChanged(auth, (user) => {
  const authContainer = document.getElementById('auth-container');
  const userContent = document.getElementById('user-content');
    if( authContainer && userContent ){
        if (user) {
            authContainer.style.display = 'none';
            userContent.style.display = 'block';
            // console.log('User is signed in', user);
        } else {
            authContainer.style.display = 'block';
            userContent.style.display = 'none';
            // console.log('No user is signed in');
        }
    }

    if (user && window.location.pathname === '/src/accountInformation.html') {
        document.getElementById('username').textContent = user.displayName || user.email.substring(0, user.email.indexOf('@'));
        document.getElementById('email').textContent = user.email;

    }

});

if( window.location.pathname === '/src/login.html'){
    // Login event listener
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                // console.log('Logged in:', userCredential.user);
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    });
}
    // // Login event listener
    // document.getElementById('login-form').addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     const email = document.getElementById('login-email').value;
    //     const password = document.getElementById('login-password').value;
    //     signInWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             // Signed in
    //             console.log('Logged in:', userCredential.user);
    //             window.location.href = '/src/game.html';
    //         })
    //         .catch((error) => {
    //             console.error('Login failed:', error);
    //             alert('Login failed! Please try again.');
    //         });
    // });

    // // Register event listener
    // document.getElementById('register-form').addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     const email = document.getElementById('register-email').value;
    //     const password = document.getElementById('register-password').value;
    //     createUserWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             // Registered but not logged in
    //             console.log('Registered:', userCredential.user);
    //         })
    //         .catch((error) => {
    //             console.error('Registration failed:', error);
    //         });
    // });


function backToLogin() {
    // Redirect to the login page
    window.location.href = 'login.html';
}
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
        })
        .catch((error) => {
            alert('Error sending password reset email: ' + error.message);
        });
}
// document.getElementById('back-button').addEventListener('click', backToLogin);

// document.getElementById('forgot-password-form').addEventListener('submit', resetPassword);



const status = document.getElementById('status');
if (status){
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if(status.textContent.includes( 'Player') ){
                    status.textContent = status.textContent.replace( 'Player' , user.displayName || user.email.substring(0, user.email.indexOf('@')))
                }

            }
        }
    });
    
    const config = {
        childList: true, 
        subtree: true,   
        characterData: true 
    };
    observer.observe(status, config);    
}


