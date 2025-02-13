# InnovaADS API

## 📌 About project

This project is the backend of the InnovaADS platform.

## 🚀 Techs

- Node.js
- TypeScript
- Express
- Database: MySQL
- ORM: TypeORM

## 📂 Project architecture

- This project uses the Clean Architecture. For more details, [click here](https://www.canalti.com.br/desenvolvimento-de-software/clean-architecture-guia-completo/).

```md
/project-root
│-- src/
│   ├── @types/                              # Common types on all application
│   ├── config/                              # General configs
│   ├── core/                                # Common features used throughout the project
│       ├── utils/                           # Utils features
│   ├── domain/                              # Application domain layer
│       ├── errors/                          # Folder with possible domain errors
│       ├── modules                          # Domain parts that have in common features
│           ├── {MODULE_NAME}/               # Module folder
│              ├── usecases/                 # Application Business Rules
│              ├── templates/                # Module templates for emails
│              ├── entities/                 # Enterprise Business Rules
│              ├── repositories/             # Contracts (types) for frameworks and drivers for database
│   ├── infra/                               # Application infrastructure layer
│       ├── database/                        # Database implementation
│       ├── http/                            # Interface Adapters
│           ├── middlewares/                 # Middlewares of authentication for API routes
│           ├── controllers/                 # Interface Adapters between external calls and domain layer
│              ├── {MODULE_NAME}/            # Module folder
│           ├── routes/                      # Files with routes, separated by module name
│   ├── providers/                           # Implementation of external services
│-- tests/                                   # Application tests helpers
│-- .env.example                             # Variáveis de ambiente
│-- package.json                             # Dependencies and scripts
│-- README.md                                # Project docs
```

## 🔧 Setup and installation

1. Clone the repository:

   ```sh
    git clone https://github.com/IagoAndrade16/innovaads_api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

   or

   ```sh
    yarn
   ```

3. Config environment variables:

   ```sh
    cp .env.example .env
   ```

4. Run all pending migrations on local DB:

   ```sh
    npm typeorm-dev-run
   ```

5. Start server:

   ```sh
   npm run dev
   ```

   or

   ```sh
    yarn dev
   ```

## 🛠️ Available commands (package.json)

- `npm run dev` – Start server on development mode
- `npm run build` – Build project to production.
- `npm run test` – Execute all automated tests
- `npm run lint` – Check code with ESLint.
- `npm typeorm-dev-run` - Execute all pending migrations
- `npm typeorm-dev-revert` - Revert last migration round
- `yarn typeorm migration:create src/infra/database/migrations/<MIGRATION_NAME>` - Create a migration file
