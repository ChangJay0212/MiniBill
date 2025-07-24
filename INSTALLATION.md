# MiniBill - Detailed Installation Guide

This guide provides step-by-step instructions for setting up the MiniBill application from scratch.

## 📋 Table of Contents

1. [System Requirements](#️-system-requirements)
2. [Database Setup](#️-database-setup)
3. [Backend Setup](#-backend-setup)
4. [Frontend Setup](#-frontend-setup)
5. [Configuration](#-configuration)
6. [Running the Application](#-running-the-application)
7. [Project Packaging](#-project-packaging)
8. [Troubleshooting](#-troubleshooting)
9. [Production Deployment](#-production-deployment)

## 🖥️ System Requirements

### Hardware Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **CPU**: Any modern processor (dual-core or better)

### Software Requirements
- **Operating System**: Windows 10/11 or Linux Ubuntu 18.04+
- **Java**: Version 17 or higher
- **Node.js**: Version 18 or higher
- **Maven**: Version 3.6 or higher
- **Oracle Database**: Version 12c or higher (or Docker)

## 🗄️ Database Setup

### Option 1: Docker (Recommended for Development)

1. **Install Docker Desktop**
   - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Follow installation instructions for your OS

2. **Run Oracle Database Container**
   ```bash
   # Windows
   docker run --rm -d --name oracle-xe ^
     -e ORACLE_PASSWORD=1234 ^
     -v C:\Users\User\Documents\MiniBill\init.sql:/docker-entrypoint-initdb.d/init.sql ^
     -p 1521:1521 ^
     gvenzl/oracle-xe

   # Linux
   docker run --rm -d --name oracle-xe \
     -e ORACLE_PASSWORD=1234 \
     -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql \
     -p 1521:1521 \
     gvenzl/oracle-xe
   ```

3. **Wait for Database Initialization**
   ```bash
   # Check if database is ready
   docker logs oracle-xe
   
   # You should see "DATABASE IS READY TO USE!" when it's ready
   ```

### Option 2: Local Oracle Installation

1. **Download Oracle Database**
   - Download Oracle Database 12c or higher from Oracle website
   - Follow Oracle's installation guide for your operating system

2. **Create Database User**
   ```sql
   -- Connect as SYSDBA
   CREATE USER minibill IDENTIFIED BY password123;
   GRANT CONNECT, RESOURCE, DBA TO minibill;
   GRANT CREATE SESSION TO minibill;
   GRANT CREATE TABLE TO minibill;
   GRANT CREATE SEQUENCE TO minibill;
   ```

3. **Run Database Initialization Script**
   ```bash
   # Connect to Oracle and run the init.sql script
   sqlplus minibill/password123@localhost:1521/XE @init.sql
   ```

## 🔧 Backend Setup

### 1. Install Java 17+

#### Windows
1. Download OpenJDK 17 from [https://adoptium.net/](https://adoptium.net/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```cmd
   java -version
   javac -version
   ```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Verify installation
java -version
```

### 2. Install Maven

#### Windows
1. Download Maven from [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH environment variable
4. Verify: `mvn -version`

#### Linux
```bash
sudo apt install maven
```

### 3. Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=minibill
spring.datasource.password=password123
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.Oracle12cDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=mySecretKey
jwt.expiration=86400000
```

### 4. Build and Run Backend

```bash
# Navigate to project root
cd MiniBill

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

## 🎨 Frontend Setup

### 1. Install Node.js

#### Windows
1. Download from [https://nodejs.org/](https://nodejs.org/)
2. Run the installer
3. Verify: `node --version` and `npm --version`

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 3. Configure API Endpoints

Edit `frontend/src/services/api.ts` if needed:

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

### 4. Run Frontend Development Server

```bash
# Start development server
npm run dev

# Or using yarn
yarn dev
```

The frontend will be available at `http://localhost:5173`

## ⚙️ Configuration

### Backend Configuration Files

1. **application.properties**
   ```properties
   # Server settings
   server.port=8080
   server.servlet.context-path=/

   # Database settings
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
   spring.datasource.username=your_username
   spring.datasource.password=your_password

   # Security settings
   jwt.secret=your-secret-key-here
   jwt.expiration=86400000
   ```

2. **CORS Configuration** (if needed)
   Edit `src/main/java/com/minibill/config/WebConfig.java`

### Frontend Configuration Files

1. **vite.config.ts**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: {
         '/api': {
           target: 'http://localhost:8080',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   });
   ```

## 🚀 Running the Application

### Development Mode

1. **Start Database** (if using Docker)
   ```bash
   docker start oracle-xe
   ```

2. **Start Backend**
   ```bash
   cd MiniBill
   mvn spring-boot:run
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Database: localhost:1521

### Default Login Credentials

After running the initialization script, you can use:
- **Username**: admin
- **Password**: admin123
- **Permission Level**: 99 (Administrator)

## � Project Packaging

This section covers how to package the MiniBill application for distribution or deployment.

### Backend Packaging

#### 1. Create Executable JAR

```bash
# Navigate to project root
cd MiniBill

# Clean previous builds
mvn clean

# Package the application (skips tests for faster build)
mvn package -DskipTests

# Or include tests
mvn package
```

The packaged JAR file will be created at:
```
target/minibill-0.0.1-SNAPSHOT.jar
```

#### 2. Create Production JAR with Dependencies

```bash
# Create a JAR with all dependencies included
mvn clean compile assembly:single

# Or use the Spring Boot plugin
mvn clean package spring-boot:repackage
```

#### 3. Verify JAR Contents

```bash
# List contents of the JAR file
jar -tf target/minibill-0.0.1-SNAPSHOT.jar

# Check if main class is correctly set
java -jar target/minibill-0.0.1-SNAPSHOT.jar --help
```

#### 4. Test the Packaged Application

```bash
# Run the packaged JAR
java -jar target/minibill-0.0.1-SNAPSHOT.jar

# Run with specific profile
java -jar target/minibill-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Run with custom port
java -jar target/minibill-0.0.1-SNAPSHOT.jar --server.port=9090
```

### Frontend Packaging

#### 1. Build Production Bundle

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Create production build
npm run build
```

The built files will be in the `dist/` directory:
```
frontend/dist/
├── index.html
├── assets/
│   ├── css files
│   ├── js files
│   └── images
└── other static files
```

#### 2. Preview Production Build

```bash
# Preview the production build locally
npm run preview

# Or using a simple HTTP server
npx serve dist
```

#### 3. Optimize Build Size

```bash
# Analyze bundle size
npm run build -- --analyze

# Build with specific base URL for deployment
npm run build -- --base=/minibill/
```

### Complete Project Packaging

#### 1. Full Application Package

Create a complete package with both frontend and backend:

```bash
# Create package directory
mkdir minibill-release
cd minibill-release

# Copy backend JAR
cp ../target/minibill-0.0.1-SNAPSHOT.jar ./minibill-backend.jar

# Copy frontend build
cp -r ../frontend/dist ./frontend

# Copy configuration files
cp ../src/main/resources/application.properties ./application-template.properties

# Copy database initialization script
cp ../init.sql ./

# Create startup scripts
```

#### 2. Create Startup Scripts

**Windows (start.bat):**
```batch
@echo off
echo Starting MiniBill Application...
echo.

echo Starting Backend Server...
start "MiniBill Backend" java -jar minibill-backend.jar

echo.
echo Backend started on http://localhost:8080
echo Frontend files are in ./frontend directory
echo.
echo Setup a web server to serve the frontend files
echo or use: npx serve frontend
echo.
pause
```

**Linux (start.sh):**
```bash
#!/bin/bash
echo "Starting MiniBill Application..."
echo ""

echo "Starting Backend Server..."
nohup java -jar minibill-backend.jar > backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Backend started on http://localhost:8080"
echo "Backend logs: backend.log"
echo ""
echo "Frontend files are in ./frontend directory"
echo "Setup a web server to serve the frontend files"
echo "or use: npx serve frontend"
echo ""
```

#### 3. Create README for Package

Create `PACKAGE_README.md`:
```markdown
# MiniBill Application Package

## Contents
- `minibill-backend.jar` - Backend application
- `frontend/` - Frontend static files
- `application-template.properties` - Configuration template
- `init.sql` - Database initialization script
- `start.bat` / `start.sh` - Startup scripts

## Quick Start
1. Ensure Java 17+ is installed
2. Setup Oracle database and run init.sql
3. Configure application-template.properties
4. Run startup script or java -jar minibill-backend.jar
5. Serve frontend files using a web server

## Requirements
- Java 17+
- Oracle Database 12c+
- Web server for frontend (nginx, Apache, or Node.js serve)
```

#### 4. Create Distribution Archive

```bash
# Create ZIP archive (Windows)
powershell Compress-Archive -Path minibill-release/* -DestinationPath minibill-v1.0.zip

# Create tar.gz archive (Linux)
tar -czf minibill-v1.0.tar.gz minibill-release/

# Create both archives
7z a minibill-v1.0.zip minibill-release/
tar -czf minibill-v1.0.tar.gz minibill-release/
```

### Docker Packaging

#### 1. Create Dockerfile for Backend

Create `Dockerfile` in project root:
```dockerfile
FROM openjdk:17-jre-slim

WORKDIR /app

COPY target/minibill-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

#### 2. Create Dockerfile for Frontend

Create `Dockerfile` in frontend directory:
```dockerfile
FROM nginx:alpine

COPY dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Build Docker Images

```bash
# Build backend image
docker build -t minibill-backend:latest .

# Build frontend image
cd frontend
docker build -t minibill-frontend:latest .
```

#### 4. Create Docker Compose for Complete Package

Create `docker-compose.package.yml`:
```yaml
version: '3.8'
services:
  database:
    image: gvenzl/oracle-xe
    environment:
      ORACLE_PASSWORD: minibill123
    ports:
      - "1521:1521"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      - oracle-data:/opt/oracle/oradata

  backend:
    image: minibill-backend:latest
    ports:
      - "8080:8080"
    depends_on:
      - database
    environment:
      SPRING_DATASOURCE_URL: jdbc:oracle:thin:@database:1521:XE
      SPRING_DATASOURCE_USERNAME: minibill
      SPRING_DATASOURCE_PASSWORD: password123

  frontend:
    image: minibill-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  oracle-data:
```

#### 5. Package Docker Distribution

```bash
# Save Docker images
docker save minibill-backend:latest > minibill-backend.tar
docker save minibill-frontend:latest > minibill-frontend.tar

# Create complete Docker package
mkdir docker-package
cp minibill-backend.tar docker-package/
cp minibill-frontend.tar docker-package/
cp docker-compose.package.yml docker-package/docker-compose.yml
cp init.sql docker-package/

# Create installation script
cat > docker-package/install.sh << 'EOF'
#!/bin/bash
echo "Loading MiniBill Docker images..."
docker load < minibill-backend.tar
docker load < minibill-frontend.tar
echo "Starting MiniBill application..."
docker-compose up -d
echo "Application started!"
echo "Frontend: http://localhost"
echo "Backend: http://localhost:8080"
EOF

chmod +x docker-package/install.sh
```

### Package Verification

#### 1. Test Backend Package

```bash
# Test JAR file
java -jar target/minibill-0.0.1-SNAPSHOT.jar --spring.profiles.active=test

# Check application startup
curl http://localhost:8080/health || echo "Health check endpoint not available"
```

#### 2. Test Frontend Package

```bash
# Test frontend build
cd frontend
npx serve dist -l 3000

# Check if all routes work
curl http://localhost:3000/ 
curl http://localhost:3000/login
curl http://localhost:3000/dashboard
```

#### 3. Test Complete Package

```bash
# Test the complete release package
cd minibill-release
java -jar minibill-backend.jar &
npx serve frontend &

# Wait and test
sleep 10
curl http://localhost:8080/
curl http://localhost:5000/
```

## �🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check if Oracle container is running
docker ps

# Check Oracle logs
docker logs oracle-xe

# Restart container if needed
docker restart oracle-xe
```

#### 2. Port Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux
```

#### 3. Maven Build Issues
```bash
# Clear Maven cache
mvn clean

# Force update dependencies
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

#### 4. Node.js/npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Use specific Node version with nvm
nvm install 18
nvm use 18
```

### Environment-Specific Issues

#### Windows
- Ensure JAVA_HOME is set correctly
- Use Git Bash or PowerShell for better command support
- Antivirus software might block some operations

#### Linux
- Ensure sufficient permissions for Docker
- May need to run with `sudo` for some operations

## 🌐 Production Deployment

### Backend Deployment

1. **Build Production JAR**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Run Production Server**
   ```bash
   java -jar target/minibill-0.0.1-SNAPSHOT.jar
   ```

3. **Environment Variables**
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   export DB_URL=your-production-db-url
   export DB_USERNAME=your-db-username
   export DB_PASSWORD=your-db-password
   export JWT_SECRET=your-production-jwt-secret
   ```

### Frontend Deployment

1. **Build Production Bundle**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Static Files**
   - Upload `dist/` folder to your web server
   - Configure web server to serve `index.html` for all routes
   - Set up reverse proxy to backend API

### Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  database:
    image: gvenzl/oracle-xe
    environment:
      ORACLE_PASSWORD: production-password
    ports:
      - "1521:1521"
    volumes:
      - oracle-data:/opt/oracle/oradata

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - database
    environment:
      SPRING_DATASOURCE_URL: jdbc:oracle:thin:@database:1521:XE

volumes:
  oracle-data:
```

## 📞 Support

If you encounter any issues not covered in this guide:

1. Check the [main README.md](./README.md) for basic troubleshooting
2. Review the application logs for error messages
3. Ensure all prerequisites are correctly installed
4. Check GitHub issues for similar problems
5. Create a new issue with detailed error information

## 🔄 Updates

To update the application:

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Update backend dependencies**
   ```bash
   mvn clean install
   ```

3. **Update frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Restart services**
   ```bash
   # Restart backend
   mvn spring-boot:run

   # Restart frontend
   npm run dev
   ```
