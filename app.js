const form = document.getElementById('registrationForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const contact = document.getElementById('contact');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

// Restrict contact field to digits only
contact.addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
        e.preventDefault();
    }
});

contact.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
});

// Real-time validation as the user leaves each field
username.addEventListener('blur', validateUsername);
email.addEventListener('blur', validateEmail);
contact.addEventListener('blur', validateContact);
password.addEventListener('blur', validatePassword);
confirmPassword.addEventListener('blur', validateConfirmPassword);

// Re-check confirm password live whenever password changes
password.addEventListener('input', function () {
    if (confirmPassword.value.trim() !== '') {
        validateConfirmPassword();
    }
});

// Show/hide password toggles
document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            btn.textContent = '🙈';
            btn.setAttribute('aria-label', 'Hide password');
        } else {
            targetInput.type = 'password';
            btn.textContent = '👁';
            btn.setAttribute('aria-label', 'Show password');
        }
    });
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    validateForm();
});


function validateForm() {
    let isValid = true;

    isValid = validateUsername() && isValid;
    isValid = validateEmail() && isValid;
    isValid = validateContact() && isValid;
    isValid = validatePassword() && isValid;
    isValid = validateConfirmPassword() && isValid;

    if (isValid) {
        const usernameValue = username.value.trim();
        alert('✅ Registration Successful! Welcome ' + usernameValue);
        form.reset();
        clearAllSuccess();
    }
}


function validateUsername() {
    const value = username.value.trim();
    username.value = value; // remove stray leading/trailing spaces from the field itself
    const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // must start with letter/underscore

    if (value === '') {
        showError(username, 'usernameError', '! Username is required');
        return false;
    }
    if (value.length < 3) {
        showError(username, 'usernameError', '! Username must be at least 3 characters');
        return false;
    }
    if (value.length > 20) {
        showError(username, 'usernameError', '! Username must not exceed 20 characters');
        return false;
    }
    if (!usernameRegex.test(value)) {
        showError(username, 'usernameError', '! Username must start with a letter and contain only letters, numbers, and underscores');
        return false;
    }

    showSuccess(username, 'usernameError');
    return true;
}


function validateEmail() {
    const value = email.value.trim();
    email.value = value;
    const emailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    if (value === '') {
        showError(email, 'emailError', '! Email is required');
        return false;
    }
    if (!emailRegex.test(value) || value.endsWith('.') || value.includes('..')) {
        showError(email, 'emailError', '! Enter a valid email (cannot start with a symbol or contain consecutive dots)');
        return false;
    }

    showSuccess(email, 'emailError');
    return true;
}


function validateContact() {
    const value = contact.value.trim();
    contact.value = value;
    const contactRegex = /^[0-9]{10}$/;

    if (value === '') {
        showError(contact, 'contactError', '! Contact number is required');
        return false;
    }
    if (!contactRegex.test(value)) {
        showError(contact, 'contactError', '! Contact must be exactly 10 digits');
        return false;
    }

    showSuccess(contact, 'contactError');
    return true;
}


function validatePassword() {
    const value = password.value.trim();
    const specialCharRegex = /[!@#$%^&*]/;

    if (value === '') {
        showError(password, 'passwordError', '! Password is required');
        return false;
    }
    if (value.length < 8) {
        showError(password, 'passwordError', '! Password must be at least 8 characters');
        return false;
    }
    if (value.length > 64) {
        showError(password, 'passwordError', '! Password must not exceed 64 characters');
        return false;
    }
    if (!specialCharRegex.test(value)) {
        showError(password, 'passwordError', '! Password must include a special character (!@#$%^&*)');
        return false;
    }

    showSuccess(password, 'passwordError');
    return true;
}


function validateConfirmPassword() {
    const value = confirmPassword.value.trim();
    const passwordValue = password.value.trim();

    if (value === '') {
        showError(confirmPassword, 'confirmPasswordError', '! Please confirm your password');
        return false;
    }
    if (value !== passwordValue) {
        showError(confirmPassword, 'confirmPasswordError', '! Passwords do not match');
        return false;
    }

    showSuccess(confirmPassword, 'confirmPasswordError');
    return true;
}


function showError(input, errorId, message) {
    const errorLabel = document.getElementById(errorId);
    errorLabel.innerText = message;
    errorLabel.style.display = 'block';
    input.classList.remove('success-input');
    input.classList.add('error-input');
    input.setAttribute('aria-invalid', 'true');
}

function showSuccess(input, errorId) {
    const errorLabel = document.getElementById(errorId);
    errorLabel.innerText = '';
    errorLabel.style.display = 'none';
    input.classList.remove('error-input');
    input.classList.add('success-input');
    input.setAttribute('aria-invalid', 'false');
}

function clearAllSuccess() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('success-input', 'error-input');
        input.removeAttribute('aria-invalid');
    });
}