# GET /api/public/categories - List Categories

**Description:** Retrieve a list of all event categories. This is a public endpoint and does not require authentication.

**Authentication:** Not required

---

## Use Case 1: List All Categories

Retrieve all categories in the system.

### Request

```bash
curl -X GET http://localhost:3005/api/public/categories | jq .
```

**Method:** GET

**URL:** `http://localhost:3005/api/public/categories`

**Headers:**

```
Content-Type: application/json
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "696154267fdba0e6636c2376",
      "name": "Business Events",
      "description": "Professional business gatherings and meetings",
      "createdAt": "2026-01-15T12:45:30.123Z",
      "updatedAt": "2026-01-15T16:56:00.000Z"
    },
    {
      "id": "69691e9121f99ca534e905a5",
      "name": "Wedding Events",
      "description": "Wedding celebrations",
      "createdAt": "2026-01-15T17:06:25.645Z",
      "updatedAt": "2026-01-15T17:06:25.645Z"
    }
    // ... more categories
  ],
  "status": 200
}
```

**Response Fields:**

- `id` - MongoDB ObjectId of the category
- `name` - Category name
- `description` - Category description
- `createdAt` - Category creation timestamp (ISO 8601)
- `updatedAt` - Last update timestamp (ISO 8601)

---

## Error Cases

### Error 500: Internal Server Error - Database Failure

**Request:**

```bash
curl -X GET http://localhost:3005/api/public/categories | jq .
```

_(Simulate by disconnecting the database)_

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

| Parameter | Type | Required | Description                       |
| --------- | ---- | -------- | --------------------------------- |
| (none)    |      |          | This endpoint takes no parameters |

---

## Response Status Codes

| Code | Meaning      | Scenario                               |
| ---- | ------------ | -------------------------------------- |
| 200  | OK           | Categories successfully listed         |
| 500  | Server Error | Database failure or other server error |

---

## Implementation Notes

- **Authentication:** Not required
- **Content-Type:** application/json
- **Response Format:** Consistent with API standard (success/data/status structure)
- **Timestamps:** ISO 8601 format for createdAt and updatedAt
