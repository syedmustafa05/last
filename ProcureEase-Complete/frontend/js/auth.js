// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is logged in on page load
        this.currentUser = this.getCurrentUser();
        
        // Set up logout handlers
        this.setupLogoutHandlers();
        
        // Protect pages that require authentication
        this.protectPage();
    }

    // Mock authentication - in real app, this would validate against backend
    async login(email, password) {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user data - in real app, this would come from API
            const mockUsers = {
                'admin@procureease.com': {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@procureease.com',
                    role: 'admin'
                },
                'john.smith@procureease.com': {
                    id: 2,
                    name: 'John Smith',
                    email: 'john.smith@procureease.com',
                    role: 'user'
                }
            };

            const user = mockUsers[email];
            
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // In real app, validate password against hash
            if ((email === 'admin@procureease.com' && password !== 'admin123') ||
                (email === 'john.smith@procureease.com' && password !== 'password123')) {
                throw new Error('Invalid email or password');
            }

            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('loginTime', Date.now().toString());
            
            this.currentUser = user;
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        this.currentUser = null;
        
        // Redirect to login page
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (!userData) return null;
            
            const user = JSON.parse(userData);
            const loginTime = localStorage.getItem('loginTime');
            
            // Check if session is expired (24 hours)
            if (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
                this.logout();
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    setupLogoutHandlers() {
        // Set up logout button handlers
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    protectPage() {
        const currentPage = window.location.pathname.split('/').pop();
        const publicPages = ['login.html', 'index.html', ''];
        
        if (!publicPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        // If on login page and already authenticated, redirect to dashboard
        if (currentPage === 'login.html' && this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Update user display if authenticated
        if (this.isAuthenticated()) {
            this.updateUserDisplay();
        }
    }

    updateUserDisplay() {
        const userDisplays = document.querySelectorAll('[data-user-name]');
        userDisplays.forEach(element => {
            element.textContent = this.currentUser.name;
        });
        
        // Update user dropdown text
        const userDropdown = document.querySelector('.user-dropdown span');
        if (userDropdown) {
            userDropdown.textContent = this.currentUser.name;
        }
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Get user permissions (mock implementation)
    getPermissions() {
        if (!this.currentUser) return [];
        
        const rolePermissions = {
            'admin': ['create', 'read', 'update', 'delete', 'approve'],
            'manager': ['create', 'read', 'update', 'approve'],
            'user': ['create', 'read', 'update']
        };
        
        return rolePermissions[this.currentUser.role] || ['read'];
    }

    // Check if user can perform action
    canPerform(action) {
        const permissions = this.getPermissions();
        return permissions.includes(action);
    }
}

// Create global auth instance
const auth = new AuthManager();

// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('show');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });
        
        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
            }
        });
    }
    
    // Update active navigation link
    updateActiveNavLink();
});

// Update active navigation link based on current page
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            link.classList.add('active');
        }
    });
}

// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
});

// Form validation helper
function validateForm(form, rules) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Clear previous errors
    form.querySelectorAll('.is-invalid').forEach(element => {
        element.classList.remove('is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(element => {
        element.remove();
    });
    
    const errors = Utils.validateForm(data, rules);
    
    if (errors) {
        // Display errors
        Object.entries(errors).forEach(([field, message]) => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('is-invalid');
                
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = message;
                input.parentNode.appendChild(feedback);
            }
        });
        return false;
    }
    
    return data;
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    Utils.showToast('An unexpected error occurred. Please try again.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    Utils.showToast('An error occurred while processing your request.', 'error');
    e.preventDefault();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, auth };
}