# POST /api/admin/categories - Create Category

**Description:** Create a new event category. Only accessible to authenticated administrators.

**Authentication:** Required (Bearer token in Authorization header)

---

## Use Case 1: Create Category with Name and Description

Create a new category for event organization.

### Request

```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corporate Events",
    "description": "Professional corporate gatherings and conferences"
  }'
```

**Method:** POST

**URL:** `http://localhost:3005/api/admin/categories`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Corporate Events",
  "description": "Professional corporate gatherings and conferences"
}
```

### Response Success (201)

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "696154267fdba0e6636c2376",
    "name": "Corporate Events",
    "description": "Professional corporate gatherings and conferences",
    "createdAt": "2026-01-15T12:45:30.123Z",
    "updatedAt": "2026-01-15T12:45:30.123Z"
  }
}
```

**Response Fields:**
- `id` - MongoDB ObjectId of created category
- `name` - Category name
- `description` - Category description
- `createdAt` - Category creation timestamp
- `updatedAt` - Last update timestamp

---

## Use Case 2: Create Minimal Category (Name Only)

Create a category with just a name (description optional).

### Request

```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Virtual Events"
  }'
```

**Body (JSON):**
```json
{
  "name": "Virtual Events"
}
```

### Response Success (201)

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "696157417fdba0e6636c238f",
    "name": "Virtual Events",
    "description": "",
    "createdAt": "2026-01-15T12:46:15.456Z",
    "updatedAt": "2026-01-15T12:46:15.456Z"
  }
}
```

---

## Error Cases

### Error 401: Unauthorized - Missing Token

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Description"
  }'
```
*(No Authorization header)*

**Response:**
```json
{
  "success": false,
  "status": 401,
  "error": "Unauthorized - No token provided"
}
```

---

### Error 401: Unauthorized - Invalid Token

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer invalid.token.here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Description"
  }'
```

**Response:**
```json
{
  "success": false,
  "status": 401,
  "error": "Unauthorized - Invalid or expired token"
}
```

---

### Error 401: Unauthorized - Expired Token

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTQyZmZhMTliZTNlZGVkMWZhMzYzNWEiLCJlbWFpbCI6ImFpcmFldmVudHMwMDFAZ21haWwuY29tIiwiaWF0IjoxNzY4NDc1NTA4LCJleHAiOjE3Njg0NzYxMDh9.2w6QNfUDsaFvgjs7eT8oEvvGyPExEzOMgHzgQklVE9g" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Description"
  }'
```
*(Token expired)*

**Response:**
```json
{
  "success": false,
  "status": 401,
  "error": "Unauthorized - Token expired"
}
```

---

### Error 400: Bad Request - Missing Name

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Description without name"
  }'
```
*(name field missing)*

**Response:**
```json
{
  "success": false,
  "status": 400,
  "error": "INVALID_INPUT",
  "details": {
    "fieldErrors": {
      "name": [
        "Required"
      ]
    }
  }
}
```

---

### Error 400: Bad Request - Invalid Name (Empty String)

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "description": "Description"
  }'
```
*(Empty name)*

**Response:**
```json
{
  "success": false,
  "status": 400,
  "error": "INVALID_INPUT",
  "details": {
    "fieldErrors": {
      "name": [
        "String must contain at least 1 character(s)"
      ]
    }
  }
}
```

---

### Error 400: Bad Request - Name Too Long

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "This is a very long category name that exceeds the maximum allowed length of one hundred characters and should fail validation",
    "description": "Description"
  }'
```
*(Name > 100 characters)*

**Response:**
```json
{
  "success": false,
  "status": 400,
  "error": "INVALID_INPUT",
  "details": {
    "fieldErrors": {
      "name": [
        "String must contain at most 100 character(s)"
      ]
    }
  }
}
```

---

### Error 400: Bad Request - Description Too Long

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Category",
    "description": "This description is extremely long and exceeds the maximum allowed length of five hundred characters which should cause validation to fail and return an error message indicating that the description is too long for this field..."
  }'
```
*(Description > 500 characters)*

**Response:**
```json
{
  "success": false,
  "status": 400,
  "error": "INVALID_INPUT",
  "details": {
    "fieldErrors": {
      "description": [
        "String must contain at most 500 character(s)"
      ]
    }
  }
}
```

---

### Error 409: Conflict - Duplicate Category Name

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wedding",
    "description": "Wedding events"
  }'
```
*(Category "Wedding" already exists)*

**Response:**
```json
{
  "success": false,
  "status": 409,
  "error": "DUPLICATE_CATEGORY",
  "message": "Category with name 'Wedding' already exists"
}
```

---

### Error 500: Internal Server Error - Database Failure

**Request:**
```bash
curl -X POST http://localhost:3005/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "Description"
  }'
```
*(MongoDB connection lost)*

**Response:**
```json
{
  "success": false,
  "status": 500,
  "error": "INTERNAL_ERROR",
  "message": "Internal server error"
}
```

---

## Request Parameters Reference

| Parameter | Type | Required | Constraints | Example |
|-----------|------|----------|-------------|---------|
| `name` | string | Yes | 1-100 characters | "Wedding" |
| `description` | string | No | 0-500 characters | "Wedding celebrations" |

---

## Response Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 201 | Created | Category successfully created |
| 400 | Bad Request | Validation error (missing field, invalid data, etc.) |
| 401 | Unauthorized | Missing or invalid authentication token |
| 409 | Conflict | Category with same name already exists |
| 500 | Server Error | Database failure or other server error |

---

## Implementation Notes

- **Authentication:** JWT token in `Authorization: Bearer <token>` header (required)
- **Content-Type:** application/json
- **Validation:** All fields validated with Zod schema before processing
- **Duplicate Check:** Category name must be unique
- **Response Format:** Consistent with API standard (success/status/data structure)
- **Timestamps:** ISO 8601 format for createdAt and updatedAt

