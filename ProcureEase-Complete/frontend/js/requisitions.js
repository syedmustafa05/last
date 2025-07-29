// Requisitions Management JavaScript
class RequisitionManager {
    constructor() {
        this.requisitions = [];
        this.filteredRequisitions = [];
        this.users = [];
        this.currentRequisition = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUsers();
        this.loadRequisitions();
        AuthManager.updateActiveNavLink('requisitions.html');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('requisitionForm').addEventListener('submit', (e) => {
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
        document.getElementById('requisitionModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Set default date to today
        document.getElementById('requisitionDate').value = new Date().toISOString().split('T')[0];
    }

    async loadUsers() {
        try {
            const response = await APIService.getUsers();
            if (response.success) {
                this.users = response.data;
                this.populateUserDropdown();
            } else {
                console.error('Failed to load users:', response.message);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    populateUserDropdown() {
        const select = document.getElementById('requestedBy');
        select.innerHTML = '<option value="">Select User</option>';
        
        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            select.appendChild(option);
        });
    }

    async loadRequisitions() {
        try {
            Utils.showLoading('requisitionsTableBody');
            
            const response = await APIService.getRequisitions();
            if (response.success) {
                this.requisitions = response.data;
                this.filteredRequisitions = [...this.requisitions];
                this.renderRequisitionsTable();
            } else {
                throw new Error(response.message || 'Failed to load requisitions');
            }
        } catch (error) {
            console.error('Error loading requisitions:', error);
            this.showError('Failed to load requisitions. Please try again.');
            document.getElementById('requisitionsTableBody').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Failed to load requisitions
                    </td>
                </tr>
            `;
        }
    }

    renderRequisitionsTable() {
        const tbody = document.getElementById('requisitionsTableBody');
        
        if (this.filteredRequisitions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-inbox me-2"></i>
                        No requisitions found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredRequisitions.map(requisition => `
            <tr>
                <td>
                    <div class="fw-medium">#${requisition.id}</div>
                </td>
                <td>${Utils.escapeHtml(requisition.item)}</td>
                <td>
                    <span class="badge bg-light text-dark">${requisition.quantity}</span>
                </td>
                <td>
                    <span class="badge ${Utils.getStatusBadgeClass(requisition.status)}">
                        ${requisition.status}
                    </span>
                </td>
                <td>
                    ${requisition.user ? Utils.escapeHtml(requisition.user.name) : 'N/A'}
                </td>
                <td>${Utils.formatDate(requisition.date)}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" 
                                onclick="requisitionManager.editRequisition(${requisition.id})"
                                title="Edit Requisition">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" 
                                onclick="requisitionManager.confirmDelete(${requisition.id})"
                                title="Delete Requisition">
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

        // Filter requisitions
        this.filteredRequisitions = this.requisitions.filter(requisition => {
            const matchesSearch = !searchTerm || 
                requisition.item.toLowerCase().includes(searchTerm) ||
                requisition.id.toString().includes(searchTerm) ||
                (requisition.user && requisition.user.name.toLowerCase().includes(searchTerm));

            const matchesStatus = !statusFilter || requisition.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Sort requisitions
        this.filteredRequisitions.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'item':
                    return a.item.localeCompare(b.item);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        this.renderRequisitionsTable();
    }

    editRequisition(requisitionId) {
        const requisition = this.requisitions.find(r => r.id === requisitionId);
        if (!requisition) {
            this.showError('Requisition not found');
            return;
        }

        this.currentRequisition = requisition;
        this.isEditing = true;

        // Populate form
        document.getElementById('requisitionId').value = requisition.id;
        document.getElementById('requisitionItem').value = requisition.item;
        document.getElementById('requisitionQuantity').value = requisition.quantity;
        document.getElementById('requisitionDate').value = requisition.date;
        document.getElementById('requisitionStatus').value = requisition.status;
        document.getElementById('requestedBy').value = requisition.requested_by;

        // Update modal title
        document.getElementById('requisitionModalLabel').textContent = 'Edit Requisition';
        document.querySelector('#saveRequisitionBtn .btn-text').textContent = 'Update Requisition';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('requisitionModal'));
        modal.show();
    }

    confirmDelete(requisitionId) {
        const requisition = this.requisitions.find(r => r.id === requisitionId);
        if (!requisition) {
            this.showError('Requisition not found');
            return;
        }

        this.currentRequisition = requisition;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async handleFormSubmit() {
        const formData = new FormData(document.getElementById('requisitionForm'));
        const requisitionData = Object.fromEntries(formData);

        // Validate form
        if (!Utils.validateForm('requisitionForm')) {
            this.showError('Please fill in all required fields correctly.');
            return;
        }

        // Convert quantity to number
        requisitionData.quantity = parseInt(requisitionData.quantity);

        try {
            this.setFormLoading(true);

            let response;
            if (this.isEditing) {
                response = await APIService.updateRequisition(this.currentRequisition.id, requisitionData);
            } else {
                response = await APIService.createRequisition(requisitionData);
            }

            if (response.success) {
                Utils.showToast(
                    `Requisition ${this.isEditing ? 'updated' : 'created'} successfully!`,
                    'success'
                );

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('requisitionModal'));
                modal.hide();

                // Reload requisitions
                await this.loadRequisitions();
            } else {
                throw new Error(response.message || `Failed to ${this.isEditing ? 'update' : 'create'} requisition`);
            }
        } catch (error) {
            console.error('Error saving requisition:', error);
            this.showError(error.message || `Failed to ${this.isEditing ? 'update' : 'create'} requisition. Please try again.`);
        } finally {
            this.setFormLoading(false);
        }
    }

    async handleDelete() {
        if (!this.currentRequisition) {
            this.showError('No requisition selected for deletion');
            return;
        }

        try {
            this.setDeleteLoading(true);

            const response = await APIService.deleteRequisition(this.currentRequisition.id);
            if (response.success) {
                Utils.showToast('Requisition deleted successfully!', 'success');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                // Reload requisitions
                await this.loadRequisitions();
            } else {
                throw new Error(response.message || 'Failed to delete requisition');
            }
        } catch (error) {
            console.error('Error deleting requisition:', error);
            this.showError(error.message || 'Failed to delete requisition. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    resetForm() {
        document.getElementById('requisitionForm').reset();
        document.getElementById('requisitionId').value = '';
        document.getElementById('requisitionModalLabel').textContent = 'New Requisition';
        document.querySelector('#saveRequisitionBtn .btn-text').textContent = 'Save Requisition';
        
        // Reset date to today
        document.getElementById('requisitionDate').value = new Date().toISOString().split('T')[0];
        
        this.currentRequisition = null;
        this.isEditing = false;
        this.hideError();
    }

    setFormLoading(loading) {
        const btn = document.getElementById('saveRequisitionBtn');
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
        const errorDiv = document.getElementById('requisitionErrorMessage');
        const errorText = document.getElementById('requisitionErrorText');
        
        errorText.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    hideError() {
        const errorDiv = document.getElementById('requisitionErrorMessage');
        errorDiv.classList.add('d-none');
    }
}

// Global functions for HTML onclick handlers
function openRequisitionModal() {
    requisitionManager.resetForm();
    const modal = new bootstrap.Modal(document.getElementById('requisitionModal'));
    modal.show();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortBy').value = 'date';
    requisitionManager.applyFilters();
}

// Initialize when DOM is loaded
let requisitionManager;
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    requisitionManager = new RequisitionManager();
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