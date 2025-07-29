// Vendors Management JavaScript
class VendorManager {
    constructor() {
        this.vendors = [];
        this.filteredVendors = [];
        this.currentVendor = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadVendors();
        AuthManager.updateActiveNavLink('vendors.html');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('vendorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', 
            Utils.debounce(() => this.applyFilters(), 300));
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortBy').addEventListener('change', () => this.applyFilters());

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleDelete();
        });

        // Modal events
        document.getElementById('vendorModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });
    }

    async loadVendors() {
        try {
            Utils.showLoading('vendorsTableBody');
            
            const response = await APIService.getVendors();
            if (response.success) {
                this.vendors = response.data;
                this.filteredVendors = [...this.vendors];
                this.renderVendorsTable();
            } else {
                throw new Error(response.message || 'Failed to load vendors');
            }
        } catch (error) {
            console.error('Error loading vendors:', error);
            this.showError('Failed to load vendors. Please try again.');
            document.getElementById('vendorsTableBody').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Failed to load vendors
                    </td>
                </tr>
            `;
        }
    }

    renderVendorsTable() {
        const tbody = document.getElementById('vendorsTableBody');
        
        if (this.filteredVendors.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-inbox me-2"></i>
                        No vendors found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredVendors.map(vendor => `
            <tr>
                <td>
                    <div class="fw-medium">${Utils.escapeHtml(vendor.name)}</div>
                </td>
                <td>${Utils.escapeHtml(vendor.contact_person)}</td>
                <td>
                    <a href="mailto:${vendor.email}" class="text-decoration-none">
                        ${Utils.escapeHtml(vendor.email)}
                    </a>
                </td>
                <td>
                    <a href="tel:${vendor.phone}" class="text-decoration-none">
                        ${Utils.escapeHtml(vendor.phone)}
                    </a>
                </td>
                <td>
                    <span class="badge ${Utils.getStatusBadgeClass(vendor.status)}">
                        ${vendor.status}
                    </span>
                </td>
                <td>${Utils.formatDate(vendor.created_at)}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" 
                                onclick="vendorManager.editVendor(${vendor.id})"
                                title="Edit Vendor">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" 
                                onclick="vendorManager.confirmDelete(${vendor.id})"
                                title="Delete Vendor">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        // Filter vendors
        this.filteredVendors = this.vendors.filter(vendor => {
            const matchesSearch = !searchTerm || 
                vendor.name.toLowerCase().includes(searchTerm) ||
                vendor.contact_person.toLowerCase().includes(searchTerm) ||
                vendor.email.toLowerCase().includes(searchTerm) ||
                vendor.phone.toLowerCase().includes(searchTerm);

            const matchesStatus = !statusFilter || vendor.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Sort vendors
        this.filteredVendors.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created_at':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        this.renderVendorsTable();
    }

    editVendor(vendorId) {
        const vendor = this.vendors.find(v => v.id === vendorId);
        if (!vendor) {
            this.showError('Vendor not found');
            return;
        }

        this.currentVendor = vendor;
        this.isEditing = true;

        // Populate form
        document.getElementById('vendorId').value = vendor.id;
        document.getElementById('vendorName').value = vendor.name;
        document.getElementById('contactPerson').value = vendor.contact_person;
        document.getElementById('vendorEmail').value = vendor.email;
        document.getElementById('vendorPhone').value = vendor.phone;
        document.getElementById('vendorAddress').value = vendor.address;
        document.getElementById('vendorStatus').value = vendor.status;

        // Update modal title
        document.getElementById('vendorModalLabel').textContent = 'Edit Vendor';
        document.querySelector('#saveVendorBtn .btn-text').textContent = 'Update Vendor';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('vendorModal'));
        modal.show();
    }

    confirmDelete(vendorId) {
        const vendor = this.vendors.find(v => v.id === vendorId);
        if (!vendor) {
            this.showError('Vendor not found');
            return;
        }

        this.currentVendor = vendor;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async handleFormSubmit() {
        const formData = new FormData(document.getElementById('vendorForm'));
        const vendorData = Object.fromEntries(formData);

        // Validate form
        if (!Utils.validateForm('vendorForm')) {
            this.showError('Please fill in all required fields correctly.');
            return;
        }

        try {
            this.setFormLoading(true);

            let response;
            if (this.isEditing) {
                response = await APIService.updateVendor(this.currentVendor.id, vendorData);
            } else {
                response = await APIService.createVendor(vendorData);
            }

            if (response.success) {
                Utils.showToast(
                    `Vendor ${this.isEditing ? 'updated' : 'created'} successfully!`,
                    'success'
                );

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('vendorModal'));
                modal.hide();

                // Reload vendors
                await this.loadVendors();
            } else {
                throw new Error(response.message || `Failed to ${this.isEditing ? 'update' : 'create'} vendor`);
            }
        } catch (error) {
            console.error('Error saving vendor:', error);
            this.showError(error.message || `Failed to ${this.isEditing ? 'update' : 'create'} vendor. Please try again.`);
        } finally {
            this.setFormLoading(false);
        }
    }

    async handleDelete() {
        if (!this.currentVendor) {
            this.showError('No vendor selected for deletion');
            return;
        }

        try {
            this.setDeleteLoading(true);

            const response = await APIService.deleteVendor(this.currentVendor.id);
            if (response.success) {
                Utils.showToast('Vendor deleted successfully!', 'success');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                // Reload vendors
                await this.loadVendors();
            } else {
                throw new Error(response.message || 'Failed to delete vendor');
            }
        } catch (error) {
            console.error('Error deleting vendor:', error);
            this.showError(error.message || 'Failed to delete vendor. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    resetForm() {
        document.getElementById('vendorForm').reset();
        document.getElementById('vendorId').value = '';
        document.getElementById('vendorModalLabel').textContent = 'Add New Vendor';
        document.querySelector('#saveVendorBtn .btn-text').textContent = 'Save Vendor';
        
        this.currentVendor = null;
        this.isEditing = false;
        this.hideError();
    }

    setFormLoading(loading) {
        const btn = document.getElementById('saveVendorBtn');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.spinner-border');

        if (loading) {
            btn.disabled = true;
            btnText.classList.add('d-none');
            spinner.classList.remove('d-none');
        } else {
            btn.disabled = false;
            btnText.classList.remove('d-none');
            spinner.classList.add('d-none');
        }
    }

    setDeleteLoading(loading) {
        const btn = document.getElementById('confirmDeleteBtn');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.spinner-border');

        if (loading) {
            btn.disabled = true;
            btnText.classList.add('d-none');
            spinner.classList.remove('d-none');
        } else {
            btn.disabled = false;
            btnText.classList.remove('d-none');
            spinner.classList.add('d-none');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('vendorErrorMessage');
        const errorText = document.getElementById('vendorErrorText');
        
        errorText.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    hideError() {
        const errorDiv = document.getElementById('vendorErrorMessage');
        errorDiv.classList.add('d-none');
    }
}

// Global functions for HTML onclick handlers
function openVendorModal() {
    vendorManager.resetForm();
    const modal = new bootstrap.Modal(document.getElementById('vendorModal'));
    modal.show();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortBy').value = 'name';
    vendorManager.applyFilters();
}

// Initialize when DOM is loaded
let vendorManager;
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    vendorManager = new VendorManager();
});

// Handle logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthManager.logout();
        });
    }
});