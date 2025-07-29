// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const loginSpinner = document.getElementById('loginSpinner');
const loginError = document.getElementById('loginError');
const errorMessage = document.getElementById('errorMessage');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
        window.location.href = 'dashboard.html';
    }

    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePassword);
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
});

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    setLoading(true);
    hideError();
    
    const formData = {
        email: emailInput.value.trim(),
        password: passwordInput.value
    };
    
    try {
        // For demo purposes, we'll simulate a successful login
        // In a real application, you would make an API call here
        await simulateLogin(formData);
        
        // Store user data (in real app, this would come from the API)
        localStorage.setItem('auth_token', 'demo_token_123');
        localStorage.setItem('user_name', formData.email.split('@')[0]);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        showError(error.message || 'Login failed. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Simulate login API call
async function simulateLogin(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    const validCredentials = [
        { email: 'john@example.com', password: 'password' },
        { email: 'jane@example.com', password: 'password' },
        { email: 'mike@example.com', password: 'password' }
    ];
    
    const isValid = validCredentials.some(cred => 
        cred.email === credentials.email && cred.password === credentials.password
    );
    
    if (!isValid) {
        throw new Error('Invalid email or password');
    }
    
    return { success: true };
}

// Real API login function (commented out for demo)
/*
async function loginAPI(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }
    
    return await response.json();
}
*/

// Form validation
function validateForm() {
    let isValid = true;
    
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    
    return isValid;
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(emailInput, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(emailInput);
        return true;
    }
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showFieldError(passwordInput, 'Password is required');
        return false;
    } else if (password.length < 6) {
        showFieldError(passwordInput, 'Password must be at least 6 characters');
        return false;
    } else {
        clearFieldError(passwordInput);
        return true;
    }
}

// Field error handling
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// Password toggle
function togglePassword() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

// Loading state
function setLoading(loading) {
    if (loading) {
        loginBtn.disabled = true;
        loginSpinner.classList.remove('d-none');
    } else {
        loginBtn.disabled = false;
        loginSpinner.classList.add('d-none');
    }
}

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    loginError.classList.remove('d-none');
    loginError.classList.add('fade-in');
}

function hideError() {
    loginError.classList.add('d-none');
    loginError.classList.remove('fade-in');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export for use in other files
window.ProcureEase = {
    API_BASE_URL,
    formatCurrency,
    formatDate
};