# Read Bookings API Documentation

## Endpoint

```
GET /api/admin/bookings
```

**Authentication:** Required (admin-only endpoint)

---

## Overview

Retrieves a paginated list of all bookings with optional search and date filtering. Authentication is required.

---

## Query Parameters

| Parameter   | Type    | Default | Required | Description                                               |
| ----------- | ------- | ------- | -------- | --------------------------------------------------------- |
| `page`      | integer | 1       | No       | Page number for pagination (min: 1)                       |
| `limit`     | integer | 10      | No       | Number of results per page (min: 1, max: 100)             |
| `search`    | string  | —       | No       | Search term (searches fullName and email)                 |
| `startDate` | string  | —       | No       | Filter bookings starting from this date (ISO 8601 format) |
| `endDate`   | string  | —       | No       | Filter bookings up to this date (ISO 8601 format)         |

---

## URL Edge Cases

### 1. **Invalid Pagination Parameters**

**URL:**

```
GET /api/admin/bookings?page=0&limit=200
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
      /* bookings array */
    ],
    "total": 150,
    "page": 1,
    "limit": 100,
    "pages": 2
  }
}
```

---

### 2. **Search with No Matches**

**URL:**

```
GET /api/admin/bookings?search=nonexistent-keyword
```

**Behavior:** Search term doesn't match any bookings. Returns empty results.

**Response:** 200 OK with empty data array.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 0
  }
}
```

---

### 3. **Negative or Zero Page Number**

**URL:**

```
GET /api/admin/bookings?page=-5
```

**Behavior:** Page is auto-corrected to 1 (minimum valid page).

**Response:** 200 OK, returns first page results.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      /* first 10 bookings */
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 4. **Page Number Beyond Available Pages**

**URL:**

```
GET /api/admin/bookings?page=999
```

**Behavior:** Valid page number but exceeds total pages. Returns empty array (no documents to skip/return).

**Response:** 200 OK with empty data array and correct pagination metadata.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "total": 50,
    "page": 999,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 5. **Combining Multiple Filters**

**URL:**

```
GET /api/admin/bookings?page=2&limit=5&search=john&startDate=2026-01-01
```

**Behavior:** Filters are combined (AND logic). Returns bookings matching all criteria: page 2, 5 results per page, containing "john" in fullName/email, AND starting from the specified date.

**Response:** 200 OK with filtered, paginated results.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      {
        "id": "6969227221f99ca534e905b0",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "eventDate": "2026-01-15T10:00:00.000Z",
        "budgetRange": "$1000-$2000",
        "message": "Looking forward to the event",
        "createdAt": "2026-01-15T10:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z"
      }
    ],
    "total": 12,
    "page": 2,
    "limit": 5,
    "pages": 3
  }
}
```

---

### 6. **Empty Database**

**URL:**

```
GET /api/admin/bookings
```

**Behavior:** No bookings exist in the database. Returns empty array and zero pagination metadata.

**Response:** 200 OK with empty results.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [],
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 0
  }
}
```

---

### 7. **Malformed Query String (e.g., Special Characters)**

**URL:**

```
GET /api/admin/bookings?search=hello%20world&page=abc
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
      /* bookings matching "hello world" */
    ],
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 8. **Missing Query Parameters (Use Defaults)**

**URL:**

```
GET /api/admin/bookings
```

**Behavior:** All parameters use defaults (page=1, limit=10, no search, no date filter).

**Response:** 200 OK with first 10 bookings.

```json
{
  "success": true,
  "status": 200,
  "data": {
    "data": [
      /* first 10 bookings */
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
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
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "eventDate": "2026-01-15T10:00:00.000Z",
        "budgetRange": "$1000-$2000",
        "message": "Looking forward to the event",
        "createdAt": "2026-01-15T10:00:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

## Example cURL Requests

### Fetch first 10 bookings

```bash
curl -X GET http://localhost:3005/api/admin/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" | jq .
```

### Fetch bookings with pagination (page 2, 5 results)

```bash
curl -X GET http://localhost:3005/api/admin/bookings?page=2&limit=5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" | jq .
```

### Search bookings by keyword

```bash
curl -X GET "http://localhost:3005/api/admin/bookings?search=john" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" | jq .
```

### Fetch bookings within a date range

```bash
curl -X GET "http://localhost:3005/api/admin/bookings?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" | jq .
```

### Fetch bookings starting from a specific date

```bash
curl -X GET "http://localhost:3005/api/admin/bookings?startDate=2026-01-01" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" | jq .
```

### Fetch bookings up to a specific date

```bash
curl -X GET "http://localhost:3005/api/admin/bookings?endDate=2026-01-31" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ADMIN_TOKEN>" | jq .
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

- ✅ **Admin-only endpoint** — requires valid admin authentication
- ✅ **Defensive pagination handling** — invalid or out-of-range pagination values are auto-corrected
- ✅ **Graceful handling of search and date filters** — invalid date strings are ignored (filters omitted) and unmatched search terms simply return empty results
- ✅ **Combinable filters** — search and date filters work together (AND logic)
- ✅ **Clear status codes** — returns 200 OK for valid queries (including empty results) and 400 Bad Request for invalid date ranges
