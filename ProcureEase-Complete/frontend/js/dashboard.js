// Dashboard Functionality
class Dashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadDashboardData();
        this.setupRefreshInterval();
        this.checkSystemStatus();
    }

    async loadDashboardData() {
        try {
            // Show loading state
            this.showLoadingState(true);
            
            // Fetch dashboard statistics
            const stats = await api.getDashboardStats();
            
            // Update statistics cards
            this.updateStatsCards(stats);
            
            // Update recent requisitions table
            this.updateRecentRequisitions(stats.recentRequisitions);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            Utils.showToast('Failed to load dashboard data', 'error');
            
            // Show error state or default values
            this.showErrorState();
        } finally {
            this.showLoadingState(false);
        }
    }

    updateStatsCards(stats) {
        // Update total requisitions
        const totalRequisitions = document.getElementById('totalRequisitions');
        if (totalRequisitions) {
            this.animateCounter(totalRequisitions, stats.totalRequisitions);
        }
        
        // Update active vendors
        const activeVendors = document.getElementById('activeVendors');
        if (activeVendors) {
            this.animateCounter(activeVendors, stats.activeVendors);
        }
        
        // Update pending orders
        const pendingOrders = document.getElementById('pendingOrders');
        if (pendingOrders) {
            this.animateCounter(pendingOrders, stats.pendingOrders);
        }
        
        // Update total invoices
        const totalInvoices = document.getElementById('totalInvoices');
        if (totalInvoices) {
            this.animateCounter(totalInvoices, stats.totalInvoices);
        }
    }

    animateCounter(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - startValue) / 20;
        let currentValue = startValue;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= targetValue) || 
                (increment < 0 && currentValue <= targetValue)) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue);
        }, 50);
    }

    updateRecentRequisitions(requisitions) {
        const tbody = document.getElementById('recentRequisitions');
        if (!tbody) return;
        
        if (!requisitions || requisitions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                        No recent requisitions found
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = requisitions.map(req => `
            <tr>
                <td>
                    <div class="fw-medium">${req.item}</div>
                </td>
                <td>
                    <span class="badge bg-light text-dark">${req.quantity}</span>
                </td>
                <td>
                    <span class="badge ${Utils.getStatusBadgeClass(req.status)}">${req.status}</span>
                </td>
                <td>
                    <small class="text-muted">${Utils.formatDate(req.date)}</small>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2" style="width: 24px; height: 24px; font-size: 0.7rem;">
                            ${req.user ? req.user.name.charAt(0) : 'U'}
                        </div>
                        <small>${req.user ? req.user.name : 'Unknown'}</small>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async checkSystemStatus() {
        try {
            // Check API status
            const apiStatus = await api.healthCheck();
            const apiStatusElement = document.getElementById('apiStatus');
            const dbStatusElement = document.getElementById('dbStatus');
            const lastSyncElement = document.getElementById('lastSync');
            
            if (apiStatusElement) {
                if (apiStatus) {
                    apiStatusElement.textContent = 'Online';
                    apiStatusElement.className = 'badge bg-success';
                } else {
                    apiStatusElement.textContent = 'Offline';
                    apiStatusElement.className = 'badge bg-danger';
                }
            }
            
            if (dbStatusElement) {
                if (apiStatus) {
                    dbStatusElement.textContent = 'Connected';
                    dbStatusElement.className = 'badge bg-success';
                } else {
                    dbStatusElement.textContent = 'Disconnected';
                    dbStatusElement.className = 'badge bg-danger';
                }
            }
            
            if (lastSyncElement) {
                lastSyncElement.textContent = 'Just now';
            }
            
        } catch (error) {
            console.error('Error checking system status:', error);
        }
    }

    showLoadingState(show) {
        const statsCards = document.querySelectorAll('.stats-card');
        const recentRequisitionsTable = document.querySelector('#recentRequisitions').closest('.card');
        
        if (show) {
            // Show skeleton loading for stats cards
            statsCards.forEach(card => {
                const statsNumber = card.querySelector('.stats-number');
                if (statsNumber) {
                    statsNumber.textContent = '...';
                    statsNumber.classList.add('skeleton');
                }
            });
            
            // Show loading spinner for table
            const tbody = document.getElementById('recentRequisitions');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </td>
                    </tr>
                `;
            }
        } else {
            // Remove skeleton loading
            statsCards.forEach(card => {
                const statsNumber = card.querySelector('.stats-number');
                if (statsNumber) {
                    statsNumber.classList.remove('skeleton');
                }
            });
        }
    }

    showErrorState() {
        // Set default values for stats cards
        const defaultStats = {
            totalRequisitions: 0,
            activeVendors: 0,
            pendingOrders: 0,
            totalInvoices: 0
        };
        
        this.updateStatsCards(defaultStats);
        
        // Show error message in recent requisitions
        const tbody = document.getElementById('recentRequisitions');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
                        Failed to load data. Please try again.
                    </td>
                </tr>
            `;
        }
    }

    setupRefreshInterval() {
        // Refresh dashboard data every 5 minutes
        setInterval(() => {
            this.loadDashboardData();
        }, 5 * 60 * 1000);
        
        // Update last sync time every minute
        setInterval(() => {
            const lastSyncElement = document.getElementById('lastSync');
            if (lastSyncElement) {
                const now = new Date();
                lastSyncElement.textContent = now.toLocaleTimeString();
            }
        }, 60 * 1000);
    }

    // Manual refresh function
    async refresh() {
        Utils.showToast('Refreshing dashboard...', 'info');
        await this.loadDashboardData();
        Utils.showToast('Dashboard refreshed successfully', 'success');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize dashboard if we're on the dashboard page
    if (document.getElementById('totalRequisitions')) {
        const dashboard = new Dashboard();
        
        // Add refresh button functionality if it exists
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => dashboard.refresh());
        }
        
        // Add keyboard shortcut for refresh (Ctrl+R or Cmd+R)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                dashboard.refresh();
            }
        });
    }
});

// Handle page visibility change to refresh data when user returns
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && document.getElementById('totalRequisitions')) {
        // User returned to the tab, refresh data
        setTimeout(() => {
            const dashboard = new Dashboard();
        }, 1000);
    }
});