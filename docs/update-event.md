# PATCH /api/admin/events/:id - Update Event

**Description:** Update an existing event by ID. This is an admin-only endpoint and supports updating event details and replacing the associated image.

**Authentication:** Required (Bearer token in `Authorization` header)

---

## Use Case: Update an event by ID

### Request

```bash
curl -X PATCH http://localhost:3005/api/admin/events/<EVENT_ID> \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Updated Event Title" \
  -F "description=Updated description for the event." \
  -F "categoryId=696154267fdba0e6636c2376" \
  -F "file=@/new-image.png" \
  | jq .
```

- Path parameter: `id` (string) — MongoDB ObjectId of the event to update

Notes on image handling:

- If you provide a `file` (multipart file) the server will upload it to Cloudinary and replace the existing image (old Cloudinary asset deleted).
- If you don't upload a `file` but supply `imageUrl` (string) the server will accept that URL and keep/use it (no upload performed).

**Note:** This endpoint currently expects a full update. The `title`, `description`, and `categoryId` fields must always be provided. In addition, at least one of `file` or `imageUrl` is required (the request must include a new file upload or an image URL). When including a file, the request must use `multipart/form-data`.

### Successful Response (200)

Returns the updated event object.

```json
{
  "success": true,
  "data": {
    "id": "6969358f21f99ca534e90656",
    "title": "Updated Event Title",
    "description": "Updated description for the event.",
    "imageUrl": "https://res.cloudinary.com/.../events/new-image.webp",
    "publicId": "events/new-image",
    "categoryId": "696154267fdba0e6636c2376",
    "createdAt": "2026-01-15T18:44:31.054Z",
    "updatedAt": "2026-01-18T12:00:00.000Z"
  },
  "status": 200
}
```

---

## Error Cases

### 401 Unauthorized — Missing or invalid token

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

or

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

### 400 Invalid input — Malformed event ID or invalid fields

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid input",
    "details": {
      "fieldErrors": {
        "title": ["Title must be a string"],
        "description": ["Description must be a string"],
        "categoryId": ["Invalid category ID"]
      }
    }
  }
}
```

### 404 Not Found — Event does not exist

```json
{
  "success": false,
  "status": 404,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found"
  }
}
```

### 413 Payload Too Large — File size exceeded

```json
{
  "success": false,
  "status": 413,
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "File size too large. Maximum 10MB allowed"
  }
}
```

### 429 Quota Exceeded — Cloudinary storage limit reached

```json
{
  "success": false,
  "status": 429,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Storage quota exceeded. Please contact support."
  }
}
```

### 500 Internal Server Error — Unexpected failures

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

| Parameter     | Type   | Required    | Constraints                                                   | Example                       |
| ------------- | ------ | ----------- | ------------------------------------------------------------- | ----------------------------- |
| `title`       | string | Yes         | 1-200 characters                                              | "Updated Event Title"         |
| `description` | string | Yes         | 1-1000 characters                                             | "Updated description"         |
| `categoryId`  | string | Yes         | Valid ObjectId                                                | "696154267fdba0e6636c2376"    |
| `file`        | file   | Conditional | Image file; required if no `imageUrl` is provided             | "new-image.png"               |
| `imageUrl`    | string | Conditional | URL or existing image path; required if no `file` is provided | "https://example.com/img.png" |

**Note:** This endpoint currently expects a full update. The `title`, `description`, and `categoryId` fields must always be provided. In addition, at least one of `file` or `imageUrl` is required (the request must include a new file upload or an image URL). When including a file, the request must use `multipart/form-data`.

---

## Response Status Codes

| Code | Meaning           | Scenario                                             |
| ---- | ----------------- | ---------------------------------------------------- |
| 200  | OK                | Event successfully updated                           |
| 400  | Bad Request       | Validation error (missing field, invalid data, etc.) |
| 401  | Unauthorized      | Missing or invalid authentication token              |
| 404  | Not Found         | Event with specified ID does not exist               |
| 413  | Payload Too Large | File size exceeds limit                              |
| 429  | Quota Exceeded    | Cloudinary storage limit reached                     |
| 500  | Server Error      | Database failure or other server error               |

---

## Implementation Notes

- **Authentication:** JWT token in `Authorization: Bearer <token>` header (required)
- **Content-Type:** multipart/form-data
- **Validation:** All fields validated with Zod schema before processing
- **Cloudinary Integration:**
  - If a new `file` is provided, the old image is deleted from Cloudinary and the new file is uploaded.
  - If `imageUrl` is provided (and no `file`), the server will use that URL and will not upload to Cloudinary.
  - If `removeImage=1` is supplied, the server will delete the old Cloudinary asset (if any) and clear the stored `imageUrl`/`publicId`.
  - Cloudinary errors are handled gracefully and logged.
- **Response Format:** Consistent with API standard (success/data/status structure)
- **Timestamps:** ISO 8601 format for createdAt and updatedAt
