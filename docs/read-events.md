# Read Events API Documentation

## Endpoint

```
GET /api/public/events
```

**Authentication:** Not required (public endpoint)

---

## Overview

Retrieves a paginated list of all events with optional search and category filtering. No authentication required.

---

## Query Parameters

| Parameter    | Type    | Default | Required | Description                                                   |
| ------------ | ------- | ------- | -------- | ------------------------------------------------------------- |
| `page`       | integer | 1       | No       | Page number for pagination (min: 1)                           |
| `limit`      | integer | 10      | No       | Number of results per page (min: 1, max: 100)                 |
| `search`     | string  | —       | No       | Search term (searches event title and description)            |
| `categoryId` | string  | —       | No       | Filter events by category ID (must be valid MongoDB ObjectId) |

---

## URL Edge Cases

### 1. **Invalid Pagination Parameters**

**URL:**

```
GET /api/public/events?page=0&limit=200
```

**Behavior:** Parameters are auto-corrected to safe defaults.

- `page=0` → corrected to `page=1` (minimum 1)
- `limit=200` → capped to `limit=100` (maximum 100)

**Response:** 200 OK with corrected pagination applied.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      /* events array */
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 150,
      "pages": 2
    }
  }
}
```

---

### 2. **Invalid Category ID Format**

**URL:**

```
GET /api/public/events?categoryId=invalid-id-format
```

**Behavior:** MongoDB query filter will not match any documents (invalid ObjectId). Returns empty results, not an error.

**Response:** 200 OK with empty data array.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

---

### 3. **Non-Existent Category ID**

**URL:**

```
GET /api/public/events?categoryId=507f1f77bcf86cd799439011
```

**Behavior:** Valid ObjectId format but category doesn't exist. No events match this category. Returns empty results.

**Response:** 200 OK with empty data array.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

---

### 4. **Search with No Matches**

**URL:**

```
GET /api/public/events?search=nonexistent-keyword
```

**Behavior:** Search term doesn't match any event titles or descriptions. Returns empty results.

**Response:** 200 OK with empty data array.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

---

### 5. **Negative or Zero Page Number**

**URL:**

```
GET /api/public/events?page=-5
```

**Behavior:** Page is auto-corrected to 1 (minimum valid page).

**Response:** 200 OK, returns first page results.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      /* first 10 events */
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### 6. **Page Number Beyond Available Pages**

**URL:**

```
GET /api/public/events?page=999
```

**Behavior:** Valid page number but exceeds total pages. Returns empty array (no documents to skip/return).

**Response:** 200 OK with empty data array and correct pagination metadata.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "pagination": {
      "page": 999,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### 7. **Combining Multiple Filters**

**URL:**

```
GET /api/public/events?page=2&limit=5&search=gala&categoryId=696154267fdba0e6636c2376
```

**Behavior:** Filters are combined (AND logic). Returns events matching all criteria: page 2, 5 results per page, containing "gala" in title/description, AND belonging to the specified category.

**Response:** 200 OK with filtered, paginated results.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      {
        "id": "6969227221f99ca534e905b0",
        "title": "Gala Night Event",
        "description": "Annual corporate gala night",
        "imageUrl": "https://res.cloudinary.com/.../events/image.webp",
        "categoryId": "696154267fdba0e6636c2376",
        "createdAt": "2026-01-15T10:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 2,
      "limit": 5,
      "total": 12,
      "pages": 3
    }
  }
}
```

---

### 8. **Empty Database**

**URL:**

```
GET /api/public/events
```

**Behavior:** No events exist in the database. Returns empty array and zero pagination metadata.

**Response:** 200 OK with empty results.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

---

### 9. **Malformed Query String (e.g., Special Characters)**

**URL:**

```
GET /api/public/events?search=hello%20world&page=abc
```

**Behavior:**

- `search=hello%20world` → decoded to "hello world", used in search
- `page=abc` → `parseInt("abc", 10)` returns `NaN`, defaults to 1

**Response:** 200 OK, returns first page with search applied.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      /* events matching "hello world" */
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### 10. **Missing Query Parameters (Use Defaults)**

**URL:**

```
GET /api/public/events
```

**Behavior:** All parameters use defaults (page=1, limit=10, no search, no category filter).

**Response:** 200 OK with first 10 events.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      /* first 10 events */
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

## Successful Response

**Status:** `200 OK`

**Body:**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      {
        "id": "6969227221f99ca534e905b0",
        "title": "Annual Gala Night",
        "description": "A prestigious annual gala event",
        "imageUrl": "https://res.cloudinary.com/.../events/gala.webp",
        "categoryId": "696154267fdba0e6636c2376",
        "createdAt": "2026-01-15T10:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

## Example cURL Requests

### Fetch first 10 events

```bash
curl -X GET http://localhost:3005/api/public/events \
  -H "Content-Type: application/json" | jq .
```

### Fetch events with pagination (page 2, 5 results)

```bash
curl -X GET http://localhost:3005/api/public/events?page=2&limit=5 \
  -H "Content-Type: application/json" | jq .
```

### Search events by keyword

```bash
curl -X GET "http://localhost:3005/api/public/events?search=gala" \
  -H "Content-Type: application/json" | jq .
```

### Filter events by category

```bash
curl -X GET "http://localhost:3005/api/public/events?categoryId=696154267fdba0e6636c2376" \
  -H "Content-Type: application/json" | jq .
```

### Combine search and category filter

```bash
curl -X GET "http://localhost:3005/api/public/events?search=gala&categoryId=696154267fdba0e6636c2376&page=1&limit=5" \
  -H "Content-Type: application/json" | jq .
```

---

## Error Handling

**Internal Server Error:**

**Status:** `500 Internal Server Error`

**Body:**

```json
{
  "success": false,
  "status": 500,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error"
  }
}
```

This is rare and only occurs if there's a database connection issue or unexpected server error. Check server logs for details.

---

## Key Points

- ✅ **Public endpoint** — no authentication required
- ✅ **Defensive parameter handling** — invalid or out-of-range pagination values are auto-corrected
- ✅ **Graceful filtering** — invalid category IDs return empty results, not errors
- ✅ **Combinable filters** — search and category filters work together (AND logic)
- ✅ **Always 200 OK** — this endpoint returns 200 for all valid queries, even if results are empty
