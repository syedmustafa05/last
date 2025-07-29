# ProcureEase - ERP Procurement Management System

A complete, full-stack ERP procurement management application built with Laravel 12.x backend and modern HTML/CSS/JavaScript frontend.

## 🚀 Features

### Backend (Laravel 12.x)
- **RESTful API** with JSON responses
- **SQLite Database** with migrations and seeding
- **Eloquent ORM** with proper relationships
- **Authentication** ready for Laravel Breeze integration
- **CORS Configuration** for frontend access
- **Comprehensive CRUD** operations for all entities

### Frontend (HTML5/CSS3/JavaScript)
- **Responsive Design** with Bootstrap 5
- **Modern UI/UX** with professional styling
- **Vanilla JavaScript** (ES6+) - no frameworks
- **Font Awesome 6** icons
- **Google Fonts** (Inter)
- **Professional Color Scheme** (Blue & Teal)

### Core Modules
1. **Users Management** - Built-in Laravel authentication
2. **Requisitions** - Purchase request management
3. **Vendors** - Supplier information and management
4. **Purchase Orders** - Order creation and tracking
5. **Goods Receipts** - Inventory receiving
6. **Invoices** - Financial document management

## 📋 Requirements

- PHP 8.1 or higher
- Composer
- SQLite3
- Web server (Apache/Nginx) or PHP built-in server

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ProcureEase-Complete
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install PHP Dependencies
```bash
composer install
```

#### Environment Setup
```bash
cp .env.example .env
```

#### Generate Application Key
```bash
php artisan key:generate
```

#### Create SQLite Database
```bash
touch database/database.sqlite
```

#### Run Migrations
```bash
php artisan migrate
```

#### Seed Database with Sample Data
```bash
php artisan db:seed
```

#### Start Development Server
```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Serve Frontend (Using Python or any web server)
```bash
# Using Python 3
python -m http.server 3000

# Using PHP
php -S localhost:3000

# Using Node.js (if you have http-server installed)
npx http-server -p 3000
```

The frontend will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Users
- `id`, `name`, `email`, `password`, `email_verified_at`, `remember_token`, `timestamps`

### Requisitions
- `id`, `item`, `quantity`, `status` (Approved/Pending/Rejected), `requested_by`, `date`, `timestamps`
- **Relationships**: `hasMany PurchaseOrders`, `belongsTo User`

### Vendors
- `id`, `name`, `contact_person`, `email`, `phone`, `address`, `status` (Active/Inactive), `timestamps`
- **Relationships**: `hasMany PurchaseOrders`

### Purchase Orders
- `id`, `requisition_id`, `vendor_id`, `total_amount`, `status` (Draft/Issued/Completed/Cancelled), `order_date`, `notes`, `timestamps`
- **Relationships**: `belongsTo Requisition`, `belongsTo Vendor`, `hasMany GoodsReceipts`, `hasMany Invoices`

### Goods Receipts
- `id`, `purchase_order_id`, `item`, `quantity_received`, `received_date`, `received_by`, `status` (Received/Partial/Pending), `notes`, `timestamps`
- **Relationships**: `belongsTo PurchaseOrder`, `belongsTo User`

### Invoices
- `id`, `purchase_order_id`, `invoice_number`, `amount`, `invoice_date`, `due_date`, `status` (Draft/Sent/Paid/Overdue), `description`, `timestamps`
- **Relationships**: `belongsTo PurchaseOrder`

## 🔌 API Endpoints

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

## 🎨 Frontend Pages

1. **Login Page** (`login.html`) - User authentication
2. **Dashboard** (`dashboard.html`) - Overview and statistics
3. **Requisitions** (`requisitions.html`) - Purchase request management
4. **Vendors** (`vendors.html`) - Supplier management
5. **Purchase Orders** (`purchase-orders.html`) - Order management
6. **Goods Receipts** (`goods-receipts.html`) - Inventory receiving
7. **Invoices** (`invoices.html`) - Financial document management
8. **Reports** (`reports.html`) - Analytics and reporting

## 🔐 Authentication

### Demo Credentials
- **Email**: `john@example.com` | **Password**: `password`
- **Email**: `jane@example.com` | **Password**: `password`
- **Email**: `mike@example.com` | **Password**: `password`

## 🎯 Key Features

### Backend
- ✅ Complete CRUD operations for all entities
- ✅ Proper Eloquent relationships
- ✅ API validation and error handling
- ✅ Database seeding with realistic data
- ✅ CORS configuration for frontend
- ✅ RESTful API design

### Frontend
- ✅ Responsive design with Bootstrap 5
- ✅ Professional UI with modern styling
- ✅ Form validation and error handling
- ✅ Loading states and animations
- ✅ Status badges and color coding
- ✅ Modal dialogs for CRUD operations
- ✅ Data tables with sorting/filtering

## 🚀 Usage

1. **Start Backend Server**
   ```bash
   cd backend
   php artisan serve
   ```

2. **Start Frontend Server**
   ```bash
   cd frontend
   python -m http.server 3000
   ```

3. **Access Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

4. **Login with Demo Credentials**
   - Use any of the demo credentials listed above

## 📁 Project Structure

```
ProcureEase-Complete/
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── config/
├── frontend/               # HTML/CSS/JS Frontend
│   ├── css/
│   ├── js/
│   └── pages/
└── docs/                  # Documentation
```

## 🔧 Configuration

### Backend Configuration
- Database: SQLite (configured in `.env`)
- API Base URL: `http://localhost:8000/api`
- CORS: Enabled for all origins (development)

### Frontend Configuration
- API Base URL: `http://localhost:8000/api` (in `js/login.js`)
- Theme Colors: Blue (#3B82F6) and Teal (#2DD4BF)
- Font: Inter (Google Fonts)

## 🐛 Troubleshooting

### Common Issues

1. **Composer not found**
   ```bash
   curl -sS https://getcomposer.org/installer | php
   mv composer.phar /usr/local/bin/composer
   ```

2. **SQLite not available**
   ```bash
   sudo apt-get install php-sqlite3
   ```

3. **CORS issues**
   - Ensure backend is running on `http://localhost:8000`
   - Check CORS configuration in `config/cors.php`

4. **Database connection issues**
   - Verify SQLite file exists: `database/database.sqlite`
   - Check database path in `.env` file

## 📝 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**ProcureEase** - Streamlining procurement processes with modern technology.