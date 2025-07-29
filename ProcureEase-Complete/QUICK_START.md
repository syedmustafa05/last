# ProcureEase - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Automatic Startup (Recommended)
```bash
# Make the script executable and run it
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend
composer install
touch database/database.sqlite
php -S localhost:8000 -t public/
```

#### 2. Frontend Setup
```bash
cd frontend
python3 -m http.server 3000
# OR
php -S localhost:3000
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## 🔐 Login Credentials

Use any of these demo accounts:
- **Email**: `john@example.com` | **Password**: `password`
- **Email**: `jane@example.com` | **Password**: `password`
- **Email**: `mike@example.com` | **Password**: `password`

## 📱 What You Can Do

1. **Login** with demo credentials
2. **View Dashboard** with statistics and recent activity
3. **Navigate** through the sidebar menu
4. **Explore** the professional UI design
5. **Test** responsive design on different screen sizes

## 🎯 Key Features Demonstrated

### Frontend
- ✅ Professional login page with validation
- ✅ Responsive dashboard with statistics cards
- ✅ Modern sidebar navigation
- ✅ Status badges and color coding
- ✅ Loading states and animations
- ✅ Mobile-friendly design

### Backend (Ready for Integration)
- ✅ Complete API structure
- ✅ Database migrations and models
- ✅ Eloquent relationships
- ✅ CRUD controllers
- ✅ Sample data seeders
- ✅ CORS configuration

## 🔧 Next Steps

1. **Connect Frontend to Backend**: Update API calls in JavaScript files
2. **Add More Pages**: Create requisitions, vendors, purchase orders pages
3. **Implement Authentication**: Add Laravel Breeze or Sanctum
4. **Add Real-time Features**: Implement WebSockets for notifications
5. **Deploy**: Move to production environment

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints in the README
- Examine the code structure for implementation details

---

**ProcureEase** - Your complete ERP procurement solution! 🛒