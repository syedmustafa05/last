# ProcureEase - Complete ERP Procurement Management System

A full-stack procurement management application built with Laravel backend and vanilla JavaScript frontend.

## 🚀 Features

### Backend (Laravel 12.x)
- **RESTful API** with JSON responses
- **Database Models** with proper relationships
- **CRUD Operations** for all entities
- **SQLite Database** for development
- **Database Seeding** with realistic sample data
- **CORS Configuration** for frontend access
- **Error Handling** with proper HTTP status codes

### Frontend (HTML5 + Bootstrap 5)
- **Professional UI** with modern design
- **Responsive Layout** with mobile-first approach
- **Interactive Dashboard** with real-time statistics
- **Modal Forms** for create/edit operations
- **Data Tables** with sorting and filtering
- **Status Badges** with color-coded indicators
- **Toast Notifications** for user feedback

### Core Modules
1. **Requisitions** - Manage procurement requests
2. **Vendors** - Maintain vendor information
3. **Purchase Orders** - Create and track orders
4. **Goods Receipts** - Record received items
5. **Invoices** - Manage billing and payments

## 📋 System Requirements

- **PHP 8.1+** with extensions: sqlite3, mbstring, curl, xml
- **Composer** for dependency management
- **Python 3** for frontend development server
- **Modern Web Browser** with JavaScript enabled

## 🛠️ Installation & Setup

### Quick Start

1. **Clone or extract the project:**
   ```bash
   # If cloning from repository
   git clone <repository-url> ProcureEase-Complete
   cd ProcureEase-Complete
   ```

2. **Make startup scripts executable:**
   ```bash
   chmod +x start-backend.sh start-frontend.sh
   ```

3. **Start the backend server:**
   ```bash
   ./start-backend.sh
   ```
   This will:
   - Install Composer dependencies
   - Set up the SQLite database
   - Run migrations and seed data
   - Start Laravel server on http://localhost:8000

4. **Start the frontend server (in a new terminal):**
   ```bash
   ./start-frontend.sh
   ```
   This will start the frontend on http://localhost:3000

5. **Access the application:**
   - Open http://localhost:3000/pages/login.html
   - Use demo credentials: `admin@procureease.com` / `admin123`

### Manual Setup

#### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve --host=0.0.0.0 --port=8000
```

#### Frontend Setup
```bash
cd frontend
python3 -m http.server 3000
```

## 🗄️ Database Schema

### Tables and Relationships

```
users
├── id (primary)
├── name
├── email
├── password
└── timestamps

requisitions
├── id (primary)
├── item
├── quantity
├── status (Approved/Pending/Rejected)
├── requested_by (foreign key → users.id)
├── date
└── timestamps

vendors
├── id (primary)
├── name
├── contact_person
├── email
├── phone
├── address
├── status (Active/Inactive)
└── timestamps

purchase_orders
├── id (primary)
├── requisition_id (foreign key → requisitions.id)
├── vendor_id (foreign key → vendors.id)
├── total_amount
├── status (Draft/Issued/Completed/Cancelled)
├── order_date
├── notes
└── timestamps

goods_receipts
├── id (primary)
├── purchase_order_id (foreign key → purchase_orders.id)
├── item
├── quantity_received
├── received_date
├── received_by
├── status (Received/Partial/Pending)
├── notes
└── timestamps

invoices
├── id (primary)
├── purchase_order_id (foreign key → purchase_orders.id)
├── invoice_number (unique)
├── amount
├── invoice_date
├── due_date
├── status (Draft/Sent/Paid/Overdue)
├── description
└── timestamps
```

## 🔌 API Endpoints

### Authentication
- Mock authentication system (for demo purposes)
- Session management with localStorage

### Requisitions
- `GET /api/requisitions` - List all requisitions
- `POST /api/requisitions` - Create new requisition
- `GET /api/requisitions/{id}` - Get specific requisition
- `PUT /api/requisitions/{id}` - Update requisition
- `DELETE /api/requisitions/{id}` - Delete requisition

### Vendors
- `GET /api/vendors` - List all vendors
- `POST /api/vendors` - Create new vendor
- `GET /api/vendors/{id}` - Get specific vendor
- `PUT /api/vendors/{id}` - Update vendor
- `DELETE /api/vendors/{id}` - Delete vendor

### Purchase Orders
- `GET /api/purchase-orders` - List all purchase orders
- `POST /api/purchase-orders` - Create new purchase order
- `GET /api/purchase-orders/{id}` - Get specific purchase order
- `PUT /api/purchase-orders/{id}` - Update purchase order
- `DELETE /api/purchase-orders/{id}` - Delete purchase order

### Goods Receipts
- `GET /api/goods-receipts` - List all goods receipts
- `POST /api/goods-receipts` - Create new goods receipt
- `GET /api/goods-receipts/{id}` - Get specific goods receipt
- `PUT /api/goods-receipts/{id}` - Update goods receipt
- `DELETE /api/goods-receipts/{id}` - Delete goods receipt

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/{id}` - Get specific invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice

## 👤 Demo Users

The system comes with pre-seeded demo users:

| Email | Password | Role |
|-------|----------|------|
| admin@procureease.com | admin123 | Admin |
| john.smith@procureease.com | password123 | User |
| sarah.johnson@procureease.com | password123 | User |
| michael.davis@procureease.com | password123 | User |
| emily.wilson@procureease.com | password123 | User |

## 🎨 UI Components

### Design System
- **Primary Color:** #3B82F6 (Blue)
- **Secondary Color:** #2DD4BF (Teal)
- **Font:** Inter (Google Fonts)
- **Icons:** Font Awesome 6
- **Framework:** Bootstrap 5

### Key Components
- **Sidebar Navigation** with active state indicators
- **Statistics Cards** with hover animations
- **Data Tables** with responsive design
- **Modal Forms** for CRUD operations
- **Toast Notifications** for user feedback
- **Status Badges** with color coding
- **Loading States** with spinners and skeletons

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (< 768px)

Mobile features:
- Collapsible sidebar
- Touch-friendly buttons
- Optimized form layouts
- Responsive tables

## 🔧 Configuration

### Environment Variables (.env)
```
APP_NAME=ProcureEase
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

CORS_ALLOWED_ORIGINS=*
```

### API Configuration
The frontend API service is configured to connect to:
- **Base URL:** http://localhost:8000/api
- **Headers:** Content-Type: application/json, Accept: application/json

## 🧪 Testing the Application

### Sample Data
The application comes with realistic sample data:
- 5 Users
- 5 Vendors (4 Active, 1 Inactive)
- 6 Requisitions (3 Approved, 2 Pending, 1 Rejected)
- 3 Purchase Orders
- 2 Goods Receipts
- 2 Invoices

### Testing Workflow
1. **Login** with demo credentials
2. **View Dashboard** to see statistics
3. **Browse Requisitions** to see sample data
4. **Create New Requisition** using the form
5. **Manage Vendors** and their information
6. **Process Purchase Orders** from approved requisitions
7. **Record Goods Receipts** for delivered items
8. **Generate Invoices** for completed orders

## 🔍 Troubleshooting

### Common Issues

**Backend not starting:**
- Ensure PHP 8.1+ is installed
- Check if SQLite extension is enabled
- Verify Composer is installed

**Frontend not loading:**
- Ensure Python is installed
- Check if port 3000 is available
- Verify backend is running on port 8000

**API calls failing:**
- Check CORS configuration
- Verify backend server is running
- Check browser console for errors

**Database issues:**
- Ensure SQLite file has write permissions
- Try running migrations manually: `php artisan migrate:fresh --seed`

### Logs
- **Laravel Logs:** `backend/storage/logs/laravel.log`
- **Browser Console:** F12 → Console tab

## 🚀 Production Deployment

For production deployment:

1. **Backend:**
   - Use proper database (MySQL/PostgreSQL)
   - Configure environment variables
   - Set up proper authentication
   - Enable caching and optimization
   - Configure web server (Apache/Nginx)

2. **Frontend:**
   - Use proper web server
   - Minify CSS/JS files
   - Enable HTTPS
   - Configure CDN for assets

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

This is a complete demo application. For improvements:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📞 Support

For questions or issues:
- Check the troubleshooting section
- Review the API documentation
- Examine the browser console for errors
- Check Laravel logs for backend issues

---

**ProcureEase** - Streamlining procurement management with modern technology.