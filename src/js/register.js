import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { auth } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        const registrationForm = new RegistrationForm(email, password);
        if (registrationForm.validate()) {
            try {
                await registrationForm.submit();
                alert('Registration successful! Redirecting to login page.');
                window.location.href = 'login.html';
            } catch (error) {
                alert('Registration failed: ' + error.message);
            }
        } else {
            alert('Please fill in all fields correctly.');
        }
    });
});

class RegistrationForm {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    validate() {
        return this.email && this.password;
    }

    async submit() {
        if (this.validate()) {
            try {
                await createUserWithEmailAndPassword(auth, this.email, this.password);
                alert('Registration successful!');
            } catch (error) {
                throw new Error(error.message);
            }
        } else {
            throw new Error('Please fill in all fields.');
        }
    }
}
