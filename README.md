# Task Manager API Assessment

Project & Task Management System. This is a structured Node.js backend application built using TypeScript, Express, MongoDB (Mongoose), and Zod. It implements clean architecture to ensure modularity, type safety, and ease of testing.

---

## 1. Architectural Overview

This project is designed using a clean, layered architectural pattern that separates core **Feature Modules** from **Shared Infrastructure**. 

- **Feature Modules**: Grouped under `src/modules/`, each module (e.g., `auth`, `project`, `task`, `user`) contains its own routes, controllers, services, repositories, validations, and interfaces. This keeps code highly separated and localized.
- **Shared Infrastructure**: Located under `src/shared/`, this folder contains global configurations, constants, middlewares, utility functions, and general interface definitions that support the modules.

### Request-Response Lifecycle Flow
When an HTTP request enters the system, it starts a well-defined pipeline. Here is the sequential order of operations:

1. **Express Routing**: The router intercepts the incoming request and directs it to the corresponding controller method based on the HTTP method and URL endpoint.
2. **Authentication Middleware**: The authentication middleware intercepts the incoming request and validates the token. If the token is valid, it extracts the user context and adds it to the request. If the token is invalid or missing, it throws a structured 401 Unauthorized error with a message of "You are not logged in. Please provide a token to gain access."
3. **Zod Validation**: An Express middleware intercepts the request payload (body, query, or parameters) and validates it against a strict Zod schema before letting the request proceed. If validation fails, it throws a structured 400 Bad Request error with a message of "Validation input failed."
4. **Controller**: The controller acts as the entry point to the business module. It extracts input data (e.g., route parameters, headers, authenticated user context) and delegates sorting and pagination parsing to the `QueryFeatures` utility. It then calls the appropriate service method and returns a standardized JSON response.
5. **QueryFeatures Parsing Engine**: A single-responsibility helper utility that extracts query variables (such as `page`, `limit`, `sortBy`, and `sortOrder`) and provides default values for them to protect the database layer from malicious or inefficient querying.
6. **Service Layer**: This is where core business logic and business rules lives. The service coordinates domain logic, handles permissions, and manages cross-resource rules (e.g., checking if the requesting user owns the parent project before allowing them to create a task inside it). It does not query MongoDB directly; instead, it calls the repository layer.
7. **Repository Layer**: This layer abstracts all direct database queries. The repository encapsulates the Mongoose model, separating the service layer from repository layer. This keeps our service layer decoupled and easily testable using mock objects.
8. **MongoDB (Mongoose)**: The persistence layer where data is stored. Mongoose schemas are used to define documents, relationships, and model behavior.

### Request Flow Diagram

```
[ HTTP Request ]
       │
       ▼
┌─────────────────────────────────┐
│       Express Routing           │  (src/modules/*/task.routes.ts)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│   Authentication Middleware     │  (src/shared/middlewares/authenticate.ts)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│        Zod Validation           │  (src/shared/middlewares/validateRequest.ts)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│          Controller             │  (src/modules/*/task.controller.ts)
└──────┬───────────────────┬──────┘
       │                   │
       │ (Parses Query)    │ (Delegates)
       ▼                   ▼
┌─────────────────┐ ┌─────────────────────────────────┐
│  QueryFeatures  │ │          Service Layer          │  (src/modules/*/task.service.ts)
│ (Sanitization)  │ └────────────────┬────────────────┘
└─────────────────┘                  │
                                     │ (Executes Queries)
                                     ▼
                            ┌─────────────────────────────────┐
                            │        Repository Layer         │  (src/modules/*/task.repository.ts)
                            └────────────────┬────────────────┘
                                             │
                                             │ (Database Access)
                                             ▼
                                    ┌─────────────────────────────────┐
                                    │        MongoDB/Mongoose         │  (src/database/models/*)
                                    └─────────────────────────────────┘
```

### Key Architectural Design Patterns

*   **Decoupled Repository Pattern**: By routing database queries through repositories (e.g., `TaskRepository`), the service layer never interacts directly with Mongoose queries. This separation ensures that we can easily write unit tests for the services without needing a running database, simply by mocking the repository methods.
*   **Single-Responsibility Query Utility**: Rather than duplicating pagination and sorting validation code in every controller or service, the `QueryFeatures` class handles this cleanly. It translates raw Express query strings into formatted options that repositories use directly for sorting and offset calculations.

---

## 2. Environment Variables

Create a `.env` file in the root directory. You can copy the template below:

```ini
NODE_ENV=dev
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task_manager_db
JWT_SECRET=secret_jwt_key_123**
JWT_EXPIRES_IN=1d
SALT_ROUNDS=10
```

---

## 3. Installation & Setup Steps

Follow these steps to run the application locally:

### Step 1: Install Dependencies
Install all required project dependencies using npm:
```bash
npm install
```

### Step 2: Set Up Local MongoDB Database
Ensure you have MongoDB installed and running locally on the default port `27017`.
If you are running MongoDB via Docker, you can start it using:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 3: Configure Environment Variables
Create your local environment file:
```bash
cp .env.example .env
```
Ensure the variables inside `.env` match your local MongoDB and port preferences.

### Step 4: Boot the Server in Development Mode
Start the application with hot-reloading using:
```bash
npm run dev
```
The server will boot up and listen for requests on:
**http://localhost:3000**

---

## 4. Database Seeding Command

The project includes a custom database seeding script. Running the seed command clears any existing records in the database and populates fresh, mock records. This provides reviewers and developers with a consistent data environment immediately.

To run the seeding script, use:
```bash
npm run seed
```

### Generated Test Credentials
The script generates two default accounts with the password `test123`:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `eslam@example.com` | `test123` | Authorized to perform all actions, including deleting tasks and projects. |
| **Member** | `ahmed@example.com` | `test123` | Authorized to view and manage assigned projects and tasks. |

---

## 5. Test Execution Directions

We have built a robust testing infrastructure supporting both unit and integration tests.

### Isolated Database Environment
To ensure tests do not overwrite or modify your development database, the configuration file `src/database/connection.ts` intercepts the database connection. When it detects `cross-env NODE_ENV=test`, it dynamically routes requests to an isolated test database called `task_manager_db_test` (or `task_manager_test`).

### Execution Commands

*   **Sequential Test Command**: Runs all unit and integration tests sequentially to avoid database lock collisions.
    ```bash
    npm run test
    ```
---

## 6. Core API Directory Structures

Here is the clean layout of the `src/` directory showing how modules and shared resources are organized:

```text
src/
├── app.ts
├── server.ts
├── database/
│   ├── connection.ts
│   └── models/
│       ├── project.model.ts
│       ├── task.model.ts
│       └── user.model.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interfaces.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.validation.ts
│   ├── project/
│   │   ├── project.controller.ts
│   │   ├── project.interfaces.ts
│   │   ├── project.repository.ts
│   │   ├── project.routes.ts
│   │   ├── project.service.ts
│   │   └── project.validation.ts
│   ├── task/
│   │   ├── task.controller.ts
│   │   ├── task.interfaces.ts
│   │   ├── task.repository.ts
│   │   ├── task.routes.ts
│   │   ├── task.service.ts
│   │   └── task.validation.ts
│   └── user/
│       ├── user.interfaces.ts
│       └── user.repository.ts
└── shared/
    ├── config/
    │   └── env.ts
    ├── constants/
    │   ├── projects.ts
    │   ├── tasks.ts
    │   └── user-roles.ts
    ├── interfaces/
    │   ├── express.d.ts
    │   └── query.ts
    ├── middlewares/
    │   ├── authenticate.ts
    │   ├── authorize.ts
    │   ├── error.ts
    │   └── validateRequest.ts
    ├── scripts/
    │   └── seed.ts
    └── utils/
        ├── app-error.ts
        ├── catch-async.ts
        ├── jwt.ts
        └── query-features.ts
```
