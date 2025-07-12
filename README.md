# Node.js API Boilerplate

A production-ready Express.js API boilerplate with security, documentation, and database utilities.

## Features

- Express.js 5 with async/await support
- Security headers via Helmet
- CORS enabled
- Gzip compression
- Graceful shutdown
- Swagger (OpenAPI) documentation at `/api-docs`
- MySQL and PostgreSQL utilities
- JWT authentication utilities
- Prettier code formatting
- GitHub Actions CI

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update values as needed.

### 3. Run the server

```sh
npm start
```

Server runs on [http://localhost:3000](http://localhost:3000) by default.

### 4. API Documentation

Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for Swagger UI.

## Project Structure

```
.
├── src/
│   ├── controllers/
│   ├── docs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
├── lib/
├── test/
├── assets/
├── .env.example
├── package.json
└── README.md
```

## Scripts

- `npm start` – Start the server
- `npm run dev` – Start with nodemon (auto-reload)
- `npm run test` – Run tests (add your tests in `/test`)

## License

ISC
