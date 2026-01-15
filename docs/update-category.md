# PUT /api/admin/categories/:id - Update Category

**Description:** Update an existing event category. Only accessible to authenticated administrators.

**Authentication:** Required (Bearer token in Authorization header)

---

## Use Case 1: Update Category Name and Description

Update both the name and description of an existing category.

### Request

```bash
curl -X PUT http://localhost:3005/api/admin/categories/696154267fdba0e6636c2376 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Business Events",
    "description": "Professional business gatherings and meetings"
  }'
```

**Method:** PUT

**URL:** `http://localhost:3005/api/admin/categories/:id`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "name": "Business Events",
  "description": "Professional business gatherings and meetings"
}
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": "696154267fdba0e6636c2376",
    "name": "Business Events",
    "description": "Professional business gatherings and meetings",
    "createdAt": "2026-01-15T12:45:30.123Z",
    "updatedAt": "2026-01-15T16:56:00.000Z"
  },
  "status": 200
}
```

**Response Fields:**

- `id` - MongoDB ObjectId of updated category
- `name` - Updated category name
- `description` - Updated category description
- `createdAt` - Category creation timestamp
- `updatedAt` - Last update timestamp

---

## Error Cases

### Error 401: Unauthorized - Missing Token

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/696154267fdba0e6636c2376 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

_(No Authorization header)_

**Response:**

```json
{
  "success": false,
  "status": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing authorization token"
  }
}
```

---

### Error 401: Unauthorized - Invalid Token

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/696154267fdba0e6636c2376 \
  -H "Authorization: Bearer invalid.token.here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

**Response:**

```json
{
  "success": false,
  "status": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authorization token"
  }
}
```

---

### Error 400: Bad Request - Invalid Category ID

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/invalid-id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

_(Invalid MongoDB ObjectId)_

**Response:**

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid category ID format"
  }
}
```

---

### Error 400: Bad Request - Invalid Update Data

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/696154267fdba0e6636c2376 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": ""
  }'
```

_(Empty name)_

**Response:**

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid input",
    "details": {
      "fieldErrors": {
        "name": ["Name is required"]
      }
    }
  }
}
```

---

### Error 404: Not Found - Category Does Not Exist

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

_(Non-existent category ID)_

**Response:**

```json
{
  "success": false,
  "status": 404,
  "error": {
    "code": "NOT_FOUND",
    "message": "Category not found"
  }
}
```

---

### Error 409: Conflict - Duplicate Category Name

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/696154267fdba0e6636c2376 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wedding"
  }'
```

_(Category "Wedding" already exists)_

**Response:**

```json
{
  "success": false,
  "status": 409,
  "error": {
    "code": "DUPLICATE_CATEGORY",
    "message": "Category with this name already exists"
  }
}
```

---

### Error 500: Internal Server Error - Database Failure

**Request:**

```bash
curl -X PUT http://localhost:3005/api/admin/categories/696154267fdba0e6636c2376 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

_(MongoDB connection lost)_

**Response:**

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

---

## Request Parameters Reference

| Parameter     | Type   | Required | Constraints      | Example                    |
| ------------- | ------ | -------- | ---------------- | -------------------------- |
| `id`          | string | Yes      | Valid ObjectId   | "696154267fdba0e6636c2376" |
| `name`        | string | Yes      | 1-100 characters | "Wedding"                  |
| `description` | string | Yes      | 1-500 characters | "Wedding celebrations"     |

**Note:** Both `name` and `description` are required for update operations.

---

## Response Status Codes

| Code | Meaning      | Scenario                                                           |
| ---- | ------------ | ------------------------------------------------------------------ |
| 200  | OK           | Category successfully updated                                      |
| 400  | Bad Request  | Invalid ID or validation error (missing field, invalid data, etc.) |
| 401  | Unauthorized | Missing or invalid authentication token                            |
| 404  | Not Found    | Category with specified ID does not exist                          |
| 409  | Conflict     | Category with same name already exists                             |
| 500  | Server Error | Database failure or other server error                             |

---

## Implementation Notes

- **Authentication:** JWT token in `Authorization: Bearer <token>` header (required)
- **Content-Type:** application/json
- **Validation:** All fields validated with Zod schema before processing
- **Partial Update:** Only provided fields are updated; others remain unchanged
- **Duplicate Check:** Category name must be unique across all categories
- **Response Format:** Consistent with API standard (success/data/status structure)
- **Timestamps:** ISO 8601 format for createdAt and updatedAt
