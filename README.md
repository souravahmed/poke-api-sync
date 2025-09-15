# Pokémon Sync Service

A NestJS backend service that fetches Pokémon data from the [PokéAPI](https://pokeapi.co/), stores it in MySQL, and caches results in Redis. Includes a cron job to refresh data every 15 minutes and idempotent writes to prevent duplicates.

## Features

- ✅ Fetch Pokémon list and details from external API
- ✅ Store data in MySQL using TypeORM
- ✅ Cache Pokémon data in Redis with TTL
- ✅ Background cron job every 15 minutes for automatic data refresh
- ✅ Idempotent database writes to prevent duplicates
- ✅ Retry with exponential backoff on API failures
- ✅ Dockerized infrastructure (MySQL + Redis)
- ✅ Environment-based configuration
- ✅ Logging
- ✅ Health checks

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Cache**: Redis
- **API Client**: Axios with retry logic
- **Scheduling**: NestJS Cron
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript

## Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- npm

## Quick Start

### 1. Clone and setup

```bash
# Clone the repository
git clone <repository-url>
cd pokemon-sync-service

# Create environment file
npm run create:env

# Install dependencies
npm install
```

### 2. Start Infrastructure

```
# Start MySQL and Redis containers
npm run docker:up

# Stop containers
npm run docker:down

# Remove containers and volumes (clean slate)
npm run docker:clean
```

### 3. Environment Configuration

Create a .env file in the root directory:

```
npm run create:env
```

### 4. Run the Application

```
# Development mode (hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Watch mode
npm run start:debug
```

### 5. Test the Application

```
npm run test
```

### 6. Health Checks

```
http://localhost:3000/api/v1/health

```
