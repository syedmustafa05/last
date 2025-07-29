// ProcureEase API Service
class APIService {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Generic CRUD operations
    async getAll(resource) {
        return this.request(`/${resource}`);
    }

    async getById(resource, id) {
        return this.request(`/${resource}/${id}`);
    }

    async create(resource, data) {
        return this.request(`/${resource}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async update(resource, id, data) {
        return this.request(`/${resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(resource, id) {
        return this.request(`/${resource}/${id}`, {
            method: 'DELETE'
        });
    }

    // Requisitions API
    async getRequisitions() {
        return this.getAll('requisitions');
    }

    async getRequisition(id) {
        return this.getById('requisitions', id);
    }

    async createRequisition(data) {
        return this.create('requisitions', data);
    }

    async updateRequisition(id, data) {
        return this.update('requisitions', id, data);
    }

    async deleteRequisition(id) {
        return this.delete('requisitions', id);
    }

    // Vendors API
    async getVendors() {
        return this.getAll('vendors');
    }

    async getVendor(id) {
        return this.getById('vendors', id);
    }

    async createVendor(data) {
        return this.create('vendors', data);
    }

    async updateVendor(id, data) {
        return this.update('vendors', id, data);
    }

    async deleteVendor(id) {
        return this.delete('vendors', id);
    }

    // Purchase Orders API
    async getPurchaseOrders() {
        return this.getAll('purchase-orders');
    }

    async getPurchaseOrder(id) {
        return this.getById('purchase-orders', id);
    }

    async createPurchaseOrder(data) {
        return this.create('purchase-orders', data);
    }

    async updatePurchaseOrder(id, data) {
        return this.update('purchase-orders', id, data);
    }

    async deletePurchaseOrder(id) {
        return this.delete('purchase-orders', id);
    }

    // Goods Receipts API
    async getGoodsReceipts() {
        return this.getAll('goods-receipts');
    }

    async getGoodsReceipt(id) {
        return this.getById('goods-receipts', id);
    }

    async createGoodsReceipt(data) {
        return this.create('goods-receipts', data);
    }

    async updateGoodsReceipt(id, data) {
        return this.update('goods-receipts', id, data);
    }

    async deleteGoodsReceipt(id) {
        return this.delete('goods-receipts', id);
    }

    // Invoices API
    async getInvoices() {
        return this.getAll('invoices');
    }

    async getInvoice(id) {
        return this.getById('invoices', id);
    }

    async createInvoice(data) {
        return this.create('invoices', data);
    }

    async updateInvoice(id, data) {
        return this.update('invoices', id, data);
    }

    async deleteInvoice(id) {
        return this.delete('invoices', id);
    }

    // Dashboard statistics
    async getDashboardStats() {
        try {
            const [requisitions, vendors, purchaseOrders, invoices] = await Promise.all([
                this.getRequisitions(),
                this.getVendors(),
                this.getPurchaseOrders(),
                this.getInvoices()
            ]);

            return {
                totalRequisitions: requisitions.data?.length || 0,
                activeVendors: vendors.data?.filter(v => v.status === 'Active').length || 0,
                pendingOrders: purchaseOrders.data?.filter(po => po.status === 'Pending' || po.status === 'Draft').length || 0,
                totalInvoices: invoices.data?.length || 0,
                recentRequisitions: requisitions.data?.slice(0, 5) || []
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalRequisitions: 0,
                activeVendors: 0,
                pendingOrders: 0,
                totalInvoices: 0,
                recentRequisitions: []
            };
        }
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/up`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Create global API instance
const api = new APIService();

// Utility functions
const Utils = {
    // Format date for display
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format currency
    formatCurrency(amount) {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Get status badge class
    getStatusBadgeClass(status) {
        if (!status) return 'bg-secondary';
        
        const statusLower = status.toLowerCase();
        const statusMap = {
            'approved': 'status-approved',
            'pending': 'status-pending',
            'rejected': 'status-rejected',
            'active': 'status-active',
            'inactive': 'status-inactive',
            'draft': 'status-draft',
            'issued': 'status-issued',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled',
            'received': 'status-received',
            'partial': 'status-partial',
            'sent': 'status-sent',
            'paid': 'status-paid',
            'overdue': 'status-overdue'
        };

        return statusMap[statusLower] || 'bg-secondary';
    },

    // Show toast notification
    showToast(message, type = 'success') {
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0" 
                 role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        // Add to toast container or create one
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);

        // Initialize and show toast
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: type === 'error' ? 5000 : 3000
        });
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },

    // Show loading state
    showLoading(element, show = true) {
        if (show) {
            element.classList.add('loading');
            const spinner = element.querySelector('.spinner-border');
            if (spinner) {
                spinner.classList.remove('d-none');
            }
            const btnText = element.querySelector('.btn-text');
            if (btnText) {
                btnText.style.opacity = '0';
            }
        } else {
            element.classList.remove('loading');
            const spinner = element.querySelector('.spinner-border');
            if (spinner) {
                spinner.classList.add('d-none');
            }
            const btnText = element.querySelector('.btn-text');
            if (btnText) {
                btnText.style.opacity = '1';
            }
        }
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Validate form data
    validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && (!value || value.toString().trim() === '')) {
                errors[field] = `${rule.label || field} is required`;
                continue;
            }
            
            if (value && rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors[field] = `${rule.label || field} must be a valid email`;
            }
            
            if (value && rule.min && value.toString().length < rule.min) {
                errors[field] = `${rule.label || field} must be at least ${rule.min} characters`;
            }
            
            if (value && rule.max && value.toString().length > rule.max) {
                errors[field] = `${rule.label || field} must not exceed ${rule.max} characters`;
            }
        }
        
        return Object.keys(errors).length === 0 ? null : errors;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIService, Utils };
}