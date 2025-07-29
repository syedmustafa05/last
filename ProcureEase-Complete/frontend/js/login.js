// Login Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            hideError();
            
            // Get form data
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            
            // Validate form
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }
            
            // Show loading state
            Utils.showLoading(loginBtn, true);
            
            try {
                // Attempt login
                const result = await auth.login(email, password);
                
                if (result.success) {
                    Utils.showToast('Login successful! Redirecting...', 'success');
                    
                    // Redirect to dashboard after short delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showError(result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('An error occurred during login. Please try again.');
            } finally {
                Utils.showLoading(loginBtn, false);
            }
        });
    }
    
    // Auto-fill demo credentials when clicking on demo section
    const demoCredentials = document.querySelector('.demo-credentials');
    if (demoCredentials) {
        demoCredentials.addEventListener('click', function() {
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (emailInput && passwordInput) {
                emailInput.value = 'admin@procureease.com';
                passwordInput.value = 'admin123';
                
                // Add visual feedback
                demoCredentials.style.backgroundColor = '#e3f2fd';
                setTimeout(() => {
                    demoCredentials.style.backgroundColor = '';
                }, 500);
            }
        });
    }
    
    function showError(message) {
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.classList.remove('d-none');
        }
    }
    
    function hideError() {
        if (errorMessage) {
            errorMessage.classList.add('d-none');
        }
    }
    
    // Handle Enter key in form fields
    const formInputs = loginForm.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });
    
    // Focus on email field when page loads
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.focus();
    }
});