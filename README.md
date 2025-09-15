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

## Number of orders and total amount per status in the last 30 days

```
SELECT
    status,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM orders
WHERE created_at >= NOW() - INTERVAL 30 DAY
GROUP BY status;
```

## Top 5 customers by total spend

```
SELECT
    customer_id,
    SUM(amount) AS total_spend
FROM orders
WHERE status = 'PAID'
GROUP BY customer_id
ORDER BY total_spend DESC
LIMIT 5;
```

## Assumptions Made

1. Each customer_id is unique per customer and is represented as a UUID string.

2. The status field will always be one of the enum values (PENDING, PAID, CANCELLED) and no invalid values exist.

3. created_at is stored in UTC and can be safely used for date filtering (e.g., “last 30 days”).

## Possible Improvements (with more time)

1. Add more test, logging and monitoring.

2. Code cleanup and refactoring.
