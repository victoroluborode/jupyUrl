# JupyUrl - URL Shortener

A simple REST API for creating, managing, and tracking shortened URLs, built with Express, TypeScript, and PostgreSQL.

## Setup

1. Clone the repo and install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your database credentials:
   ```
   cp .env.example .env
   ```

3. Create the database in Postgres, then run the migration:
   ```
   npx ts-node-dev src/db/runMigration.ts migrations/001_create_urls.sql
   ```

4. Start the dev server:
   ```
   npm run dev
   ```

## Endpoints

| Method | Path                     | Description                                   |
|--------|--------------------------|------------------------------------------------|
| POST   | `/url`                   | Create a new short URL                         |
| GET    | `/url/:shortCode`        | Redirect to the original URL (tracks visits)   |
| PUT    | `/url/:shortCode`        | Update the original URL for a short code       |
| DELETE | `/url/:shortCode`        | Delete a short URL                              |
| GET    | `/url/:shortCode/stats`  | Get visit stats for a short URL                |

### Example: Create a short URL

**Request**
```
POST /url
Content-Type: application/json

{
  "url": "https://example.com/some/long/url"
}
```

**Response** `201 Created`
```json
{
  "id": 1,
  "url": "https://example.com/some/long/url",
  "shortcode": "a1b2c3",
  "createdAt": "2026-10-02T17:12:56.767Z",
  "updatedAt": "2026-10-02T17:12:56.767Z"
}
```
