// Purchase Orders Management JavaScript
class PurchaseOrderManager {
    constructor() {
        this.purchaseOrders = [];
        this.filteredPurchaseOrders = [];
        this.requisitions = [];
        this.vendors = [];
        this.currentPurchaseOrder = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDependencies();
        this.loadPurchaseOrders();
        AuthManager.updateActiveNavLink('purchase-orders.html');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('purchaseOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', 
            Utils.debounce(() => this.applyFilters(), 300));
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('vendorFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortBy').addEventListener('change', () => this.applyFilters());

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleDelete();
        });

        // Modal events
        document.getElementById('purchaseOrderModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Set default date to today
        document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
    }

    async loadDependencies() {
        try {
            const [requisitionsResponse, vendorsResponse] = await Promise.all([
                APIService.getRequisitions(),
                APIService.getVendors()
            ]);

            if (requisitionsResponse.success) {
                this.requisitions = requisitionsResponse.data.filter(req => req.status === 'Approved');
                this.populateRequisitionDropdown();
            }

            if (vendorsResponse.success) {
                this.vendors = vendorsResponse.data.filter(vendor => vendor.status === 'Active');
                this.populateVendorDropdown();
                this.populateVendorFilter();
            }
        } catch (error) {
            console.error('Error loading dependencies:', error);
        }
    }

    populateRequisitionDropdown() {
        const select = document.getElementById('requisitionId');
        select.innerHTML = '<option value="">Select Requisition</option>';
        
        this.requisitions.forEach(requisition => {
            const option = document.createElement('option');
            option.value = requisition.id;
            option.textContent = `#${requisition.id} - ${requisition.item} (Qty: ${requisition.quantity})`;
            select.appendChild(option);
        });
    }

    populateVendorDropdown() {
        const select = document.getElementById('vendorId');
        select.innerHTML = '<option value="">Select Vendor</option>';
        
        this.vendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.id;
            option.textContent = vendor.name;
            select.appendChild(option);
        });
    }

    populateVendorFilter() {
        const select = document.getElementById('vendorFilter');
        select.innerHTML = '<option value="">All Vendors</option>';
        
        this.vendors.forEach(vendor => {
            const option = document.createElement('option');
            option.value = vendor.id;
            option.textContent = vendor.name;
            select.appendChild(option);
        });
    }

    async loadPurchaseOrders() {
        try {
            Utils.showLoading('purchaseOrdersTableBody');
            
            const response = await APIService.getPurchaseOrders();
            if (response.success) {
                this.purchaseOrders = response.data;
                this.filteredPurchaseOrders = [...this.purchaseOrders];
                this.renderPurchaseOrdersTable();
            } else {
                throw new Error(response.message || 'Failed to load purchase orders');
            }
        } catch (error) {
            console.error('Error loading purchase orders:', error);
            this.showError('Failed to load purchase orders. Please try again.');
            document.getElementById('purchaseOrdersTableBody').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Failed to load purchase orders
                    </td>
                </tr>
            `;
        }
    }

    renderPurchaseOrdersTable() {
        const tbody = document.getElementById('purchaseOrdersTableBody');
        
        if (this.filteredPurchaseOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-inbox me-2"></i>
                        No purchase orders found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredPurchaseOrders.map(order => `
            <tr>
                <td>
                    <div class="fw-medium">#${order.id}</div>
                </td>
                <td>
                    ${order.requisition ? `#${order.requisition.id} - ${Utils.escapeHtml(order.requisition.item)}` : 'N/A'}
                </td>
                <td>
                    ${order.vendor ? Utils.escapeHtml(order.vendor.name) : 'N/A'}
                </td>
                <td>
                    <span class="fw-medium">${Utils.formatCurrency(order.total_amount)}</span>
                </td>
                <td>
                    <span class="badge ${Utils.getStatusBadgeClass(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td>${Utils.formatDate(order.order_date)}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" 
                                onclick="purchaseOrderManager.editPurchaseOrder(${order.id})"
                                title="Edit Purchase Order">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" 
                                onclick="purchaseOrderManager.confirmDelete(${order.id})"
                                title="Delete Purchase Order">
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
        const vendorFilter = document.getElementById('vendorFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        // Filter purchase orders
        this.filteredPurchaseOrders = this.purchaseOrders.filter(order => {
            const matchesSearch = !searchTerm || 
                order.id.toString().includes(searchTerm) ||
                (order.vendor && order.vendor.name.toLowerCase().includes(searchTerm)) ||
                (order.requisition && order.requisition.item.toLowerCase().includes(searchTerm));

            const matchesStatus = !statusFilter || order.status === statusFilter;
            const matchesVendor = !vendorFilter || order.vendor_id.toString() === vendorFilter;

            return matchesSearch && matchesStatus && matchesVendor;
        });

        // Sort purchase orders
        this.filteredPurchaseOrders.sort((a, b) => {
            switch (sortBy) {
                case 'order_date':
                    return new Date(b.order_date) - new Date(a.order_date);
                case 'total_amount':
                    return parseFloat(b.total_amount) - parseFloat(a.total_amount);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        this.renderPurchaseOrdersTable();
    }

    editPurchaseOrder(orderId) {
        const order = this.purchaseOrders.find(o => o.id === orderId);
        if (!order) {
            this.showError('Purchase order not found');
            return;
        }

        this.currentPurchaseOrder = order;
        this.isEditing = true;

        // Populate form
        document.getElementById('purchaseOrderId').value = order.id;
        document.getElementById('requisitionId').value = order.requisition_id;
        document.getElementById('vendorId').value = order.vendor_id;
        document.getElementById('totalAmount').value = order.total_amount;
        document.getElementById('orderDate').value = order.order_date;
        document.getElementById('purchaseOrderStatus').value = order.status;
        document.getElementById('notes').value = order.notes || '';

        // Update modal title
        document.getElementById('purchaseOrderModalLabel').textContent = 'Edit Purchase Order';
        document.querySelector('#savePurchaseOrderBtn .btn-text').textContent = 'Update Purchase Order';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('purchaseOrderModal'));
        modal.show();
    }

    confirmDelete(orderId) {
        const order = this.purchaseOrders.find(o => o.id === orderId);
        if (!order) {
            this.showError('Purchase order not found');
            return;
        }

        this.currentPurchaseOrder = order;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async handleFormSubmit() {
        const formData = new FormData(document.getElementById('purchaseOrderForm'));
        const orderData = Object.fromEntries(formData);

        // Validate form
        if (!Utils.validateForm('purchaseOrderForm')) {
            this.showError('Please fill in all required fields correctly.');
            return;
        }

        // Convert numeric fields
        orderData.requisition_id = parseInt(orderData.requisition_id);
        orderData.vendor_id = parseInt(orderData.vendor_id);
        orderData.total_amount = parseFloat(orderData.total_amount);

        try {
            this.setFormLoading(true);

            let response;
            if (this.isEditing) {
                response = await APIService.updatePurchaseOrder(this.currentPurchaseOrder.id, orderData);
            } else {
                response = await APIService.createPurchaseOrder(orderData);
            }

            if (response.success) {
                Utils.showToast(
                    `Purchase order ${this.isEditing ? 'updated' : 'created'} successfully!`,
                    'success'
                );

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('purchaseOrderModal'));
                modal.hide();

                // Reload purchase orders
                await this.loadPurchaseOrders();
            } else {
                throw new Error(response.message || `Failed to ${this.isEditing ? 'update' : 'create'} purchase order`);
            }
        } catch (error) {
            console.error('Error saving purchase order:', error);
            this.showError(error.message || `Failed to ${this.isEditing ? 'update' : 'create'} purchase order. Please try again.`);
        } finally {
            this.setFormLoading(false);
        }
    }

    async handleDelete() {
        if (!this.currentPurchaseOrder) {
            this.showError('No purchase order selected for deletion');
            return;
        }

        try {
            this.setDeleteLoading(true);

            const response = await APIService.deletePurchaseOrder(this.currentPurchaseOrder.id);
            if (response.success) {
                Utils.showToast('Purchase order deleted successfully!', 'success');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                // Reload purchase orders
                await this.loadPurchaseOrders();
            } else {
                throw new Error(response.message || 'Failed to delete purchase order');
            }
        } catch (error) {
            console.error('Error deleting purchase order:', error);
            this.showError(error.message || 'Failed to delete purchase order. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    resetForm() {
        document.getElementById('purchaseOrderForm').reset();
        document.getElementById('purchaseOrderId').value = '';
        document.getElementById('purchaseOrderModalLabel').textContent = 'New Purchase Order';
        document.querySelector('#savePurchaseOrderBtn .btn-text').textContent = 'Save Purchase Order';
        
        // Reset date to today
        document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
        
        this.currentPurchaseOrder = null;
        this.isEditing = false;
        this.hideError();
    }

    setFormLoading(loading) {
        const btn = document.getElementById('savePurchaseOrderBtn');
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
        const errorDiv = document.getElementById('purchaseOrderErrorMessage');
        const errorText = document.getElementById('purchaseOrderErrorText');
        
        errorText.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    hideError() {
        const errorDiv = document.getElementById('purchaseOrderErrorMessage');
        errorDiv.classList.add('d-none');
    }
}

// Global functions for HTML onclick handlers
function openPurchaseOrderModal() {
    purchaseOrderManager.resetForm();
    const modal = new bootstrap.Modal(document.getElementById('purchaseOrderModal'));
    modal.show();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('vendorFilter').value = '';
    document.getElementById('sortBy').value = 'order_date';
    purchaseOrderManager.applyFilters();
}

// Initialize when DOM is loaded
let purchaseOrderManager;
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    purchaseOrderManager = new PurchaseOrderManager();
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