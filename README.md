# Node.js Express API Boilerplate

A robust, production-ready boilerplate for building scalable RESTful APIs with Express.js. Includes security best practices, standardized error handling, database utilities, JWT authentication, and automated documentation.

---

## ✨ Features

- **Express.js 5** with async/await support
- **Security**: Helmet, CORS, and input validation
- **Compression**: Gzip for optimized responses
- **Standardized API responses** and centralized error handling
- **Graceful shutdown** for reliability
- **Swagger (OpenAPI) documentation** at `/api-docs`
- **MySQL & PostgreSQL** database utilities with safe query helpers
- **JWT authentication** utilities
- **Prettier** and **ESLint** (Airbnb) for code style and quality
- **GitHub Actions CI** for formatting, linting, and testing
- **Environment variable management** with `.env` support

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/kitsune2411/node-express-boilerplate.git
cd node-express-boilerplate
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and update the values as needed for your local setup.

```sh
cp .env.example .env
```

### 4. Run the server

```sh
npm start
```

The server will run on [http://localhost:3000](http://localhost:3000) by default.

### 5. API Documentation

Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for interactive Swagger UI and OpenAPI documentation.

---

## 🗂️ Project Structure

```
.
├── src/
│   ├── controllers/      # Route controllers
│   ├── docs/             # Swagger/OpenAPI docs and components
│   ├── middlewares/      # Custom Express middlewares (error, auth, etc.)
│   ├── models/           # Database models (if using ORM)
│   ├── routes/           # Express route definitions
│   └── utils/            # Utility/helper functions
├── lib/                  # Database and JWT utilities
├── test/                 # Unit and integration tests
├── assets/               # Static assets (if any)
├── .env.example          # Example environment variables
├── package.json
└── README.md
```

---

## 🛠️ Scripts

- `npm start` – Start the server
- `npm run dev` – Start with nodemon (auto-reload)
- `npm run lint` – Run ESLint for code quality
- `npm run lint:fix` – Auto-fix lint issues
- `npm run format` – Run Prettier for code formatting
- `npm test` – Run tests (add your tests in `/test`)

---

## 🧩 API Standards

- All responses follow a consistent JSON structure:

  ```json
  {
    "success": true,
    "data": {
      /* ... */
    },
    "message": "Operation successful"
  }
  ```

  or for errors:

  ```json
  {
    "success": false,
    "error": "Error message",
    "code": 400,
    "data": null
  }
  ```

- Error and 404 handlers are centralized and documented in Swagger.

---

## 📚 Documentation

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **JSDoc**: Inline for all controllers, routes, and utilities

---

## 🧪 Testing & CI

- Ready for unit and integration tests (add your tests in `/test`)
- GitHub Actions workflow for CI: checks formatting, linting, and tests on every push/PR

---

## 🛡️ Security

- Uses Helmet for HTTP headers
- CORS enabled by default
- Centralized error handling to avoid leaking stack traces

---

## 📝 License

[ISC](LICENSE)

---

## 👤 Author

Maintained by [kitsune2411](https://github.com/kitsune2411)

---

## 💡 Contributing

Contributions, issues, and feature requests are welcome!  
Please read the [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md) and
