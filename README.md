College Backend APIs
A backend service built with NestJS to manage user authentication, role-based access control, and product management, including CRUD operations with pagination and search functionality.

Features

JWT-based Authentication
Role-based access control (Admin, User, Manager)
Products CRUD operations
Pagination and search for product listings
College Placements Data
College Courses Data
City and State Filter for Colleges
REST API documentation with Swagger


Prerequisites

Node.js (v16+ recommended)
npm (comes with Node.js)
PostgreSQL (running locally or on a server)
Postman (optional, for testing APIs)
pgAdmin (optional, for database management)


Project Setup

1. Clone the Repository
git clone <repository_url>
cd college-backend

2. Install Dependencies
npm install

4. Configure Environment Variables
Create a .env file in the project root and add the following variables:

env


Copy code


DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=college_data
JWT_SECRET=my_super_secret_key
PORT=3000
Update the values based on your environment.

4. Setup PostgreSQL Database
Create a database named college_data.
Use the provided SQL scripts to create tables:


5. Run Database Migrations (Optional)
If using TypeORM migrations, ensure the database schema is in sync:

npm run typeorm:run
6. Start the Development Server
npm run start:dev

The application will start on http://localhost:3000.

API Documentation
Swagger UI
Swagger documentation is available at: 
http://localhost:3000/api-docs




login cred
1.admin
{
  "username": "testuser",
  "password": "password123"
}

2.general user
{
  "username": "teacher",
  "password": "string"
}



