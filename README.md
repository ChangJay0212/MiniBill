# MiniBill 💰

A comprehensive transaction management system built with Spring Boot and React TypeScript.

## 🌟 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Transaction Management**: Create, view, update, and delete transactions
- **Product Catalog**: Manage products with pricing and descriptions
- **User Management**: Admin panel for managing users and permissions
- **Payment Status Tracking**: Track payment status for each transaction
- **Responsive UI**: Modern Material-UI interface with intuitive navigation

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 2.7.5**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **Oracle Database 12c**
- **Maven** (Build tool)

### Frontend
- **React 18**
- **TypeScript**
- **Material-UI (MUI)**
- **React Router**
- **Axios** (HTTP client)
- **Vite** (Build tool)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17 or higher**
- **Node.js 18 or higher**
- **npm or yarn**
- **Oracle Database 12c** (or compatible version)
- **Maven 3.6+**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ChangJay0212/MiniBill.git
cd MiniBill
```

### 2. Database Setup
Set up your Oracle database and update the connection details in `src/main/resources/application.properties`.

### 3. Backend Setup
```bash
# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📚 Detailed Installation Guide

For detailed installation instructions, database setup, and configuration, please refer to:
👉 **[INSTALLATION.md](./INSTALLATION.md)**

## 🎯 Usage

### User Roles

#### Regular User
- View personal transactions
- Browse product catalog
- View transaction history with payment status

#### Administrator (Permission Level 99)
- All regular user features
- Create transactions for any user
- Manage all transactions (view, edit, delete)
- Update payment status
- Manage users and permissions
- Manage product catalog

### Key Features

1. **Transaction Creation**: Admins can create transactions for users with automatic pricing
2. **Payment Tracking**: Real-time payment status management
3. **User Management**: Complete user administration with permission levels
4. **Product Management**: Catalog management with pricing and descriptions

## 🔧 Configuration

### Backend Configuration
Key configuration files:
- `src/main/resources/application.properties` - Database and server settings
- `src/main/java/com/minibill/security/` - Security configuration

### Frontend Configuration
- `frontend/src/services/api.ts` - API endpoint configuration
- `frontend/vite.config.ts` - Build configuration

## 🌐 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration

### Transactions
- `GET /transactions` - Get all transactions (Admin only)
- `GET /transactions/my` - Get user's transactions
- `POST /transactions` - Create transaction
- `PUT /transactions/{id}` - Update transaction (Admin only)
- `DELETE /transactions/{id}` - Delete transaction (Admin only)

### Users
- `GET /users` - Get all users (Admin only)
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (Admin only)

### Catalog
- `GET /catalog` - Get product catalog
- `POST /catalog` - Create product (Admin only)
- `PUT /catalog/{id}` - Update product (Admin only)
- `DELETE /catalog/{id}` - Delete product (Admin only)

## 🏗️ Project Structure

```
MiniBill/
├── src/main/java/com/minibill/          # Backend source code
│   ├── catalog/                         # Product catalog module
│   ├── security/                        # Authentication & authorization
│   ├── transactions/                    # Transaction management
│   └── user/                           # User management
├── frontend/                           # React frontend
│   ├── src/
│   │   ├── components/                 # Reusable components
│   │   ├── pages/                      # Page components
│   │   ├── services/                   # API services
│   │   └── contexts/                   # React contexts
│   └── public/                         # Static assets
├── pom.xml                            # Maven configuration
└── README.md                          # This file
```

## 🚀 Deployment

### Production Build

#### Backend
```bash
mvn clean package
java -jar target/minibill-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ChangJay0212**
- GitHub: [@ChangJay0212](https://github.com/ChangJay0212)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Material-UI team for the beautiful components
- Oracle for the robust database system

---

For detailed setup instructions, troubleshooting, and advanced configuration, please check the [INSTALLATION.md](./INSTALLATION.md) guide.