# POST /api/admin/events - Create Event

**Description:** Create a new event. Only accessible to authenticated administrators.

**Authentication:** Required (Bearer token in Authorization header)

---

## Use Case 1: Create Event with File Upload (multipart/form-data)

Create a new event with all required fields and an image file upload.

### Request

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Annual Gala Night" \
  -F "description=A night of celebration and awards." \
  -F "categoryId=696154267fdba0e6636c2376" \
  -F "file=@/image.png" \
  | jq .
```

**Method:** POST

**URL:** `http://localhost:3005/api/admin/events`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**

- `title` (string, required)
- `description` (string, required)
- `categoryId` (string, required)
- `file` (file, required) — image file to upload

### Response Success (201)

```json
{
  "success": true,
  "data": {
    "id": "697000000000000000000001",
    "title": "Annual Gala Night",
    "description": "A night of celebration and awards.",
    "categoryId": "696154267fdba0e6636c2376",
    "imageUrl": "https://example.com/uploaded-image.webp",
    "createdAt": "2026-01-15T18:00:00.000Z",
    "updatedAt": "2026-01-15T18:00:00.000Z"
  },
  "status": 201
}
```

**Response Fields:**

- `id` - MongoDB ObjectId of created event
- `title` - Event title
- `description` - Event description
- `categoryId` - Linked category ID
- `imageUrl` - URL of the uploaded image
- `createdAt` - Event creation timestamp
- `updatedAt` - Last update timestamp

---

## Error Cases

### Error 401: Unauthorized - Missing Token

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Gala Night"
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
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer invalid.token.here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Gala Night"
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

### Error 400: Bad Request - Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": ""
  }'
```

_(Missing required fields)_

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
        "title": ["Title is required"],
        "description": ["Description is required"],
        "categoryId": ["Category ID is required"]
      }
    }
  }
}
```

---

### Error 413: Payload Too Large - File Size Exceeded

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Annual Gala Night" \
  -F "description=A night of celebration and awards." \
  -F "categoryId=696154267fdba0e6636c2376" \
  -F "file=@/path/to/large-image.jpg" \
  | jq .
```

_(File exceeds 4MB limit)_

**Response:**

```json
{
  "success": false,
  "status": 413,
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "File size too large. Maximum 4MB allowed"
  }
}
```

---

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Gala Night",
    "description": "A night of celebration and awards.",
    "categoryId": "invalid-id"
  }'
```

_(Invalid categoryId)_

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

### Error 404: Not Found - Category Does Not Exist

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Gala Night",
    "description": "A night of celebration and awards.",
    "categoryId": "507f1f77bcf86cd799439011"
  }'
```

_(Non-existent categoryId)_

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

### Error 409: Conflict - Duplicate Event Title

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Gala Night",
    "description": "A night of celebration and awards.",
    "categoryId": "696154267fdba0e6636c2376"
  }'
```

_(Event with this title already exists)_

**Response:**

```json
{
  "success": false,
  "status": 409,
  "error": {
    "code": "DUPLICATE_EVENT",
    "message": "Event with this title already exists"
  }
}
```

---

### Error 500: Internal Server Error - Database Failure

**Request:**

```bash
curl -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Gala Night",
    "description": "A night of celebration and awards.",
    "categoryId": "696154267fdba0e6636c2376"
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

| Parameter     | Type   | Required | Constraints       | Example                    |
| ------------- | ------ | -------- | ----------------- | -------------------------- |
| `title`       | string | Yes      | 1-200 characters  | "Annual Gala Night"        |
| `description` | string | Yes      | 1-1000 characters | "A night of celebration"   |
| `categoryId`  | string | Yes      | Valid ObjectId    | "696154267fdba0e6636c2376" |
| `file`        | file   | Yes      | Image file        | "/image.png"               |

**Note:** The request must use `multipart/form-data` and include the image file as `file`.

---

## Response Status Codes

| Code | Meaning      | Scenario                                             |
| ---- | ------------ | ---------------------------------------------------- |
| 201  | Created      | Event successfully created                           |
| 400  | Bad Request  | Validation error (missing field, invalid data, etc.) |
| 401  | Unauthorized | Missing or invalid authentication token              |
| 404  | Not Found    | Category with specified ID does not exist            |
| 409  | Conflict     | Event with same title already exists                 |
| 500  | Server Error | Database failure or other server error               |

---

## Implementation Notes

- **Authentication:** JWT token in `Authorization: Bearer <token>` header (required)
- **Content-Type:** multipart/form-data
- **Validation:** All fields validated with Zod schema before processing
- **Duplicate Check:** Event title must be unique
- **Category Check:** categoryId must reference an existing category
- **Response Format:** Consistent with API standard (success/data/status structure)
- **Timestamps:** ISO 8601 format for createdAt and updatedAt
