// Goods Receipts Management JavaScript
class GoodsReceiptManager {
    constructor() {
        this.goodsReceipts = [];
        this.filteredGoodsReceipts = [];
        this.purchaseOrders = [];
        this.currentGoodsReceipt = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPurchaseOrders();
        this.loadGoodsReceipts();
        AuthManager.updateActiveNavLink('goods-receipts.html');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('goodsReceiptForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', 
            Utils.debounce(() => this.applyFilters(), 300));
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('purchaseOrderFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortBy').addEventListener('change', () => this.applyFilters());

        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleDelete();
        });

        // Modal events
        document.getElementById('goodsReceiptModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Set default date to today
        document.getElementById('receivedDate').value = new Date().toISOString().split('T')[0];
    }

    async loadPurchaseOrders() {
        try {
            const response = await APIService.getPurchaseOrders();
            if (response.success) {
                this.purchaseOrders = response.data.filter(order => 
                    order.status === 'Issued' || order.status === 'Completed'
                );
                this.populatePurchaseOrderDropdown();
                this.populatePurchaseOrderFilter();
            } else {
                console.error('Failed to load purchase orders:', response.message);
            }
        } catch (error) {
            console.error('Error loading purchase orders:', error);
        }
    }

    populatePurchaseOrderDropdown() {
        const select = document.getElementById('purchaseOrderId');
        select.innerHTML = '<option value="">Select Purchase Order</option>';
        
        this.purchaseOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `#${order.id} - ${order.vendor ? order.vendor.name : 'N/A'} (${Utils.formatCurrency(order.total_amount)})`;
            select.appendChild(option);
        });
    }

    populatePurchaseOrderFilter() {
        const select = document.getElementById('purchaseOrderFilter');
        select.innerHTML = '<option value="">All Purchase Orders</option>';
        
        this.purchaseOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `#${order.id} - ${order.vendor ? order.vendor.name : 'N/A'}`;
            select.appendChild(option);
        });
    }

    async loadGoodsReceipts() {
        try {
            Utils.showLoading('goodsReceiptsTableBody');
            
            const response = await APIService.getGoodsReceipts();
            if (response.success) {
                this.goodsReceipts = response.data;
                this.filteredGoodsReceipts = [...this.goodsReceipts];
                this.renderGoodsReceiptsTable();
            } else {
                throw new Error(response.message || 'Failed to load goods receipts');
            }
        } catch (error) {
            console.error('Error loading goods receipts:', error);
            this.showError('Failed to load goods receipts. Please try again.');
            document.getElementById('goodsReceiptsTableBody').innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Failed to load goods receipts
                    </td>
                </tr>
            `;
        }
    }

    renderGoodsReceiptsTable() {
        const tbody = document.getElementById('goodsReceiptsTableBody');
        
        if (this.filteredGoodsReceipts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">
                        <i class="fas fa-inbox me-2"></i>
                        No goods receipts found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredGoodsReceipts.map(receipt => `
            <tr>
                <td>
                    <div class="fw-medium">#${receipt.id}</div>
                </td>
                <td>
                    ${receipt.purchase_order ? `#${receipt.purchase_order.id}` : 'N/A'}
                </td>
                <td>${Utils.escapeHtml(receipt.item)}</td>
                <td>
                    <span class="badge bg-light text-dark">${receipt.quantity_received}</span>
                </td>
                <td>${Utils.formatDate(receipt.received_date)}</td>
                <td>${Utils.escapeHtml(receipt.received_by)}</td>
                <td>
                    <span class="badge ${Utils.getStatusBadgeClass(receipt.status)}">
                        ${receipt.status}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" 
                                onclick="goodsReceiptManager.editGoodsReceipt(${receipt.id})"
                                title="Edit Goods Receipt">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" 
                                onclick="goodsReceiptManager.confirmDelete(${receipt.id})"
                                title="Delete Goods Receipt">
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
        const purchaseOrderFilter = document.getElementById('purchaseOrderFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        // Filter goods receipts
        this.filteredGoodsReceipts = this.goodsReceipts.filter(receipt => {
            const matchesSearch = !searchTerm || 
                receipt.item.toLowerCase().includes(searchTerm) ||
                receipt.received_by.toLowerCase().includes(searchTerm) ||
                receipt.id.toString().includes(searchTerm);

            const matchesStatus = !statusFilter || receipt.status === statusFilter;
            const matchesPurchaseOrder = !purchaseOrderFilter || receipt.purchase_order_id.toString() === purchaseOrderFilter;

            return matchesSearch && matchesStatus && matchesPurchaseOrder;
        });

        // Sort goods receipts
        this.filteredGoodsReceipts.sort((a, b) => {
            switch (sortBy) {
                case 'received_date':
                    return new Date(b.received_date) - new Date(a.received_date);
                case 'item':
                    return a.item.localeCompare(b.item);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        this.renderGoodsReceiptsTable();
    }

    editGoodsReceipt(receiptId) {
        const receipt = this.goodsReceipts.find(r => r.id === receiptId);
        if (!receipt) {
            this.showError('Goods receipt not found');
            return;
        }

        this.currentGoodsReceipt = receipt;
        this.isEditing = true;

        // Populate form
        document.getElementById('goodsReceiptId').value = receipt.id;
        document.getElementById('purchaseOrderId').value = receipt.purchase_order_id;
        document.getElementById('goodsReceiptItem').value = receipt.item;
        document.getElementById('quantityReceived').value = receipt.quantity_received;
        document.getElementById('receivedDate').value = receipt.received_date;
        document.getElementById('receivedBy').value = receipt.received_by;
        document.getElementById('goodsReceiptStatus').value = receipt.status;
        document.getElementById('goodsReceiptNotes').value = receipt.notes || '';

        // Update modal title
        document.getElementById('goodsReceiptModalLabel').textContent = 'Edit Goods Receipt';
        document.querySelector('#saveGoodsReceiptBtn .btn-text').textContent = 'Update Goods Receipt';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('goodsReceiptModal'));
        modal.show();
    }

    confirmDelete(receiptId) {
        const receipt = this.goodsReceipts.find(r => r.id === receiptId);
        if (!receipt) {
            this.showError('Goods receipt not found');
            return;
        }

        this.currentGoodsReceipt = receipt;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async handleFormSubmit() {
        const formData = new FormData(document.getElementById('goodsReceiptForm'));
        const receiptData = Object.fromEntries(formData);

        // Validate form
        if (!Utils.validateForm('goodsReceiptForm')) {
            this.showError('Please fill in all required fields correctly.');
            return;
        }

        // Convert numeric fields
        receiptData.purchase_order_id = parseInt(receiptData.purchase_order_id);
        receiptData.quantity_received = parseInt(receiptData.quantity_received);

        try {
            this.setFormLoading(true);

            let response;
            if (this.isEditing) {
                response = await APIService.updateGoodsReceipt(this.currentGoodsReceipt.id, receiptData);
            } else {
                response = await APIService.createGoodsReceipt(receiptData);
            }

            if (response.success) {
                Utils.showToast(
                    `Goods receipt ${this.isEditing ? 'updated' : 'created'} successfully!`,
                    'success'
                );

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('goodsReceiptModal'));
                modal.hide();

                // Reload goods receipts
                await this.loadGoodsReceipts();
            } else {
                throw new Error(response.message || `Failed to ${this.isEditing ? 'update' : 'create'} goods receipt`);
            }
        } catch (error) {
            console.error('Error saving goods receipt:', error);
            this.showError(error.message || `Failed to ${this.isEditing ? 'update' : 'create'} goods receipt. Please try again.`);
        } finally {
            this.setFormLoading(false);
        }
    }

    async handleDelete() {
        if (!this.currentGoodsReceipt) {
            this.showError('No goods receipt selected for deletion');
            return;
        }

        try {
            this.setDeleteLoading(true);

            const response = await APIService.deleteGoodsReceipt(this.currentGoodsReceipt.id);
            if (response.success) {
                Utils.showToast('Goods receipt deleted successfully!', 'success');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                // Reload goods receipts
                await this.loadGoodsReceipts();
            } else {
                throw new Error(response.message || 'Failed to delete goods receipt');
            }
        } catch (error) {
            console.error('Error deleting goods receipt:', error);
            this.showError(error.message || 'Failed to delete goods receipt. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    resetForm() {
        document.getElementById('goodsReceiptForm').reset();
        document.getElementById('goodsReceiptId').value = '';
        document.getElementById('goodsReceiptModalLabel').textContent = 'New Goods Receipt';
        document.querySelector('#saveGoodsReceiptBtn .btn-text').textContent = 'Save Goods Receipt';
        
        // Reset date to today
        document.getElementById('receivedDate').value = new Date().toISOString().split('T')[0];
        
        this.currentGoodsReceipt = null;
        this.isEditing = false;
        this.hideError();
    }

    setFormLoading(loading) {
        const btn = document.getElementById('saveGoodsReceiptBtn');
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
        const errorDiv = document.getElementById('goodsReceiptErrorMessage');
        const errorText = document.getElementById('goodsReceiptErrorText');
        
        errorText.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    hideError() {
        const errorDiv = document.getElementById('goodsReceiptErrorMessage');
        errorDiv.classList.add('d-none');
    }
}

// Global functions for HTML onclick handlers
function openGoodsReceiptModal() {
    goodsReceiptManager.resetForm();
    const modal = new bootstrap.Modal(document.getElementById('goodsReceiptModal'));
    modal.show();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('purchaseOrderFilter').value = '';
    document.getElementById('sortBy').value = 'received_date';
    goodsReceiptManager.applyFilters();
}

// Initialize when DOM is loaded
let goodsReceiptManager;
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    goodsReceiptManager = new GoodsReceiptManager();
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