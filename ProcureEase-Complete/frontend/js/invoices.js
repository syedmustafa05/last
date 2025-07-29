// Invoices Management JavaScript
class InvoiceManager {
    constructor() {
        this.invoices = [];
        this.filteredInvoices = [];
        this.purchaseOrders = [];
        this.currentInvoice = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPurchaseOrders();
        this.loadInvoices();
        AuthManager.updateActiveNavLink('invoices.html');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('invoiceForm').addEventListener('submit', (e) => {
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
        document.getElementById('invoiceModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // 30 days from today
        
        document.getElementById('invoiceDate').value = today;
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
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

    async loadInvoices() {
        try {
            Utils.showLoading('invoicesTableBody');
            
            const response = await APIService.getInvoices();
            if (response.success) {
                this.invoices = response.data;
                this.filteredInvoices = [...this.invoices];
                this.renderInvoicesTable();
            } else {
                throw new Error(response.message || 'Failed to load invoices');
            }
        } catch (error) {
            console.error('Error loading invoices:', error);
            this.showError('Failed to load invoices. Please try again.');
            document.getElementById('invoicesTableBody').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Failed to load invoices
                    </td>
                </tr>
            `;
        }
    }

    renderInvoicesTable() {
        const tbody = document.getElementById('invoicesTableBody');
        
        if (this.filteredInvoices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-inbox me-2"></i>
                        No invoices found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredInvoices.map(invoice => {
            const isOverdue = invoice.status !== 'Paid' && new Date(invoice.due_date) < new Date();
            const actualStatus = isOverdue ? 'Overdue' : invoice.status;
            
            return `
                <tr>
                    <td>
                        <div class="fw-medium">${Utils.escapeHtml(invoice.invoice_number)}</div>
                    </td>
                    <td>
                        ${invoice.purchase_order ? `#${invoice.purchase_order.id}` : 'N/A'}
                    </td>
                    <td>
                        <span class="fw-medium">${Utils.formatCurrency(invoice.amount)}</span>
                    </td>
                    <td>${Utils.formatDate(invoice.invoice_date)}</td>
                    <td>
                        <span class="${isOverdue ? 'text-danger fw-medium' : ''}">
                            ${Utils.formatDate(invoice.due_date)}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${Utils.getStatusBadgeClass(actualStatus)}">
                            ${actualStatus}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary" 
                                    onclick="invoiceManager.editInvoice(${invoice.id})"
                                    title="Edit Invoice">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger" 
                                    onclick="invoiceManager.confirmDelete(${invoice.id})"
                                    title="Delete Invoice">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const purchaseOrderFilter = document.getElementById('purchaseOrderFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        // Filter invoices
        this.filteredInvoices = this.invoices.filter(invoice => {
            const matchesSearch = !searchTerm || 
                invoice.invoice_number.toLowerCase().includes(searchTerm) ||
                invoice.id.toString().includes(searchTerm) ||
                (invoice.purchase_order && invoice.purchase_order.id.toString().includes(searchTerm));

            const isOverdue = invoice.status !== 'Paid' && new Date(invoice.due_date) < new Date();
            const actualStatus = isOverdue ? 'Overdue' : invoice.status;
            const matchesStatus = !statusFilter || actualStatus === statusFilter;
            
            const matchesPurchaseOrder = !purchaseOrderFilter || invoice.purchase_order_id.toString() === purchaseOrderFilter;

            return matchesSearch && matchesStatus && matchesPurchaseOrder;
        });

        // Sort invoices
        this.filteredInvoices.sort((a, b) => {
            switch (sortBy) {
                case 'invoice_date':
                    return new Date(b.invoice_date) - new Date(a.invoice_date);
                case 'amount':
                    return parseFloat(b.amount) - parseFloat(a.amount);
                case 'status':
                    const aOverdue = a.status !== 'Paid' && new Date(a.due_date) < new Date();
                    const bOverdue = b.status !== 'Paid' && new Date(b.due_date) < new Date();
                    const aStatus = aOverdue ? 'Overdue' : a.status;
                    const bStatus = bOverdue ? 'Overdue' : b.status;
                    return aStatus.localeCompare(bStatus);
                case 'due_date':
                    return new Date(a.due_date) - new Date(b.due_date);
                default:
                    return 0;
            }
        });

        this.renderInvoicesTable();
    }

    editInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            this.showError('Invoice not found');
            return;
        }

        this.currentInvoice = invoice;
        this.isEditing = true;

        // Populate form
        document.getElementById('invoiceId').value = invoice.id;
        document.getElementById('purchaseOrderId').value = invoice.purchase_order_id;
        document.getElementById('invoiceNumber').value = invoice.invoice_number;
        document.getElementById('invoiceAmount').value = invoice.amount;
        document.getElementById('invoiceDate').value = invoice.invoice_date;
        document.getElementById('dueDate').value = invoice.due_date;
        document.getElementById('invoiceStatus').value = invoice.status;
        document.getElementById('invoiceDescription').value = invoice.description || '';

        // Update modal title
        document.getElementById('invoiceModalLabel').textContent = 'Edit Invoice';
        document.querySelector('#saveInvoiceBtn .btn-text').textContent = 'Update Invoice';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        modal.show();
    }

    confirmDelete(invoiceId) {
        const invoice = this.invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            this.showError('Invoice not found');
            return;
        }

        this.currentInvoice = invoice;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async handleFormSubmit() {
        const formData = new FormData(document.getElementById('invoiceForm'));
        const invoiceData = Object.fromEntries(formData);

        // Validate form
        if (!Utils.validateForm('invoiceForm')) {
            this.showError('Please fill in all required fields correctly.');
            return;
        }

        // Additional validation
        if (new Date(invoiceData.due_date) < new Date(invoiceData.invoice_date)) {
            this.showError('Due date cannot be earlier than invoice date.');
            return;
        }

        // Convert numeric fields
        invoiceData.purchase_order_id = parseInt(invoiceData.purchase_order_id);
        invoiceData.amount = parseFloat(invoiceData.amount);

        try {
            this.setFormLoading(true);

            let response;
            if (this.isEditing) {
                response = await APIService.updateInvoice(this.currentInvoice.id, invoiceData);
            } else {
                response = await APIService.createInvoice(invoiceData);
            }

            if (response.success) {
                Utils.showToast(
                    `Invoice ${this.isEditing ? 'updated' : 'created'} successfully!`,
                    'success'
                );

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'));
                modal.hide();

                // Reload invoices
                await this.loadInvoices();
            } else {
                throw new Error(response.message || `Failed to ${this.isEditing ? 'update' : 'create'} invoice`);
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            this.showError(error.message || `Failed to ${this.isEditing ? 'update' : 'create'} invoice. Please try again.`);
        } finally {
            this.setFormLoading(false);
        }
    }

    async handleDelete() {
        if (!this.currentInvoice) {
            this.showError('No invoice selected for deletion');
            return;
        }

        try {
            this.setDeleteLoading(true);

            const response = await APIService.deleteInvoice(this.currentInvoice.id);
            if (response.success) {
                Utils.showToast('Invoice deleted successfully!', 'success');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                // Reload invoices
                await this.loadInvoices();
            } else {
                throw new Error(response.message || 'Failed to delete invoice');
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
            this.showError(error.message || 'Failed to delete invoice. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    resetForm() {
        document.getElementById('invoiceForm').reset();
        document.getElementById('invoiceId').value = '';
        document.getElementById('invoiceModalLabel').textContent = 'New Invoice';
        document.querySelector('#saveInvoiceBtn .btn-text').textContent = 'Save Invoice';
        
        // Reset dates
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        
        document.getElementById('invoiceDate').value = today;
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
        
        this.currentInvoice = null;
        this.isEditing = false;
        this.hideError();
    }

    setFormLoading(loading) {
        const btn = document.getElementById('saveInvoiceBtn');
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
        const errorDiv = document.getElementById('invoiceErrorMessage');
        const errorText = document.getElementById('invoiceErrorText');
        
        errorText.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    hideError() {
        const errorDiv = document.getElementById('invoiceErrorMessage');
        errorDiv.classList.add('d-none');
    }
}

// Global functions for HTML onclick handlers
function openInvoiceModal() {
    invoiceManager.resetForm();
    const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
    modal.show();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('purchaseOrderFilter').value = '';
    document.getElementById('sortBy').value = 'invoice_date';
    invoiceManager.applyFilters();
}

// Initialize when DOM is loaded
let invoiceManager;
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    invoiceManager = new InvoiceManager();
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