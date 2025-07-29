// API Configuration
const API_BASE_URL = window.ProcureEase?.API_BASE_URL || 'http://localhost:8000/api';

// DOM Elements
const sidebarCollapse = document.getElementById('sidebarCollapse');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const userName = document.getElementById('userName');

// Dashboard elements
const totalRequisitions = document.getElementById('totalRequisitions');
const activeVendors = document.getElementById('activeVendors');
const pendingOrders = document.getElementById('pendingOrders');
const totalValue = document.getElementById('totalValue');
const recentRequisitions = document.getElementById('recentRequisitions');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Sidebar toggle
    sidebarCollapse.addEventListener('click', toggleSidebar);
    
    // Load dashboard data
    loadDashboardData();
});

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set user name
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) {
        userName.textContent = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1);
    }
}

// Initialize dashboard
function initializeDashboard() {
    // Set active navigation
    setActiveNavigation('dashboard');
    
    // Add fade-in animation
    document.body.classList.add('fade-in');
}

// Sidebar toggle
function toggleSidebar() {
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
}

// Set active navigation
function setActiveNavigation(page) {
    const navLinks = document.querySelectorAll('.sidebar .components li');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`.sidebar .components li a[href="${page}.html"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load statistics
        await loadStatistics();
        
        // Load recent requisitions
        await loadRecentRequisitions();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Load statistics
async function loadStatistics() {
    try {
        // For demo purposes, we'll use mock data
        // In a real application, you would make API calls here
        const stats = await getMockStatistics();
        
        // Update UI
        totalRequisitions.textContent = stats.totalRequisitions;
        activeVendors.textContent = stats.activeVendors;
        pendingOrders.textContent = stats.pendingOrders;
        totalValue.textContent = formatCurrency(stats.totalValue);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load recent requisitions
async function loadRecentRequisitions() {
    try {
        // For demo purposes, we'll use mock data
        const requisitions = await getMockRequisitions();
        
        // Clear existing content
        recentRequisitions.innerHTML = '';
        
        // Add requisitions to table
        requisitions.forEach(req => {
            const row = createRequisitionRow(req);
            recentRequisitions.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading recent requisitions:', error);
    }
}

// Create requisition table row
function createRequisitionRow(requisition) {
    const row = document.createElement('tr');
    row.className = 'fade-in';
    
    const statusBadge = getStatusBadge(requisition.status);
    
    row.innerHTML = `
        <td>${requisition.item}</td>
        <td>${requisition.quantity}</td>
        <td>${statusBadge}</td>
        <td>${requisition.requestedBy}</td>
        <td>${formatDate(requisition.date)}</td>
    `;
    
    return row;
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusClasses = {
        'Approved': 'bg-success',
        'Pending': 'bg-warning',
        'Rejected': 'bg-danger'
    };
    
    const badgeClass = statusClasses[status] || 'bg-secondary';
    
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

// Mock data functions (replace with real API calls)
async function getMockStatistics() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalRequisitions: 15,
        activeVendors: 8,
        pendingOrders: 3,
        totalValue: 125000
    };
}

async function getMockRequisitions() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
        {
            id: 1,
            item: 'Laptop Computers',
            quantity: 10,
            status: 'Approved',
            requestedBy: 'John Doe',
            date: '2024-01-15'
        },
        {
            id: 2,
            item: 'Office Chairs',
            quantity: 25,
            status: 'Pending',
            requestedBy: 'Jane Smith',
            date: '2024-01-14'
        },
        {
            id: 3,
            item: 'Printers',
            quantity: 5,
            status: 'Approved',
            requestedBy: 'Mike Johnson',
            date: '2024-01-13'
        },
        {
            id: 4,
            item: 'Network Equipment',
            quantity: 8,
            status: 'Pending',
            requestedBy: 'Sarah Wilson',
            date: '2024-01-12'
        },
        {
            id: 5,
            item: 'Desk Supplies',
            quantity: 100,
            status: 'Rejected',
            requestedBy: 'David Brown',
            date: '2024-01-11'
        }
    ];
}

// Real API functions (commented out for demo)
/*
async function getStatisticsAPI() {
    const response = await fetch(`${API_BASE_URL}/dashboard/statistics`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to load statistics');
    }
    
    return await response.json();
}

async function getRequisitionsAPI() {
    const response = await fetch(`${API_BASE_URL}/requisitions?limit=5`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to load requisitions');
    }
    
    const data = await response.json();
    return data.data || [];
}
*/

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

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Logout function
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    window.location.href = 'login.html';
}

// Export functions for global use
window.ProcureEase = {
    ...window.ProcureEase,
    logout,
    showNotification
};