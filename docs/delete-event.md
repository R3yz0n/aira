# DELETE /api/admin/events/:id - Delete Event

**Description:** Delete an existing event by ID. This is an admin-only endpoint and will attempt to delete the associated Cloudinary image when a `publicId` is available.

**Authentication:** Required (Bearer token in `Authorization` header)

---

## Use Case: Delete an event by ID

### Request

```bash
curl -X DELETE http://localhost:3005/api/admin/events/<EVENT_ID> \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" | jq .
```

- Path parameter: `id` (string) — MongoDB ObjectId of the event to delete

### Successful Response (200)

Returns the deleted event object (including `publicId` when present).

```json
{
  "success": true,
  "data": {
    "id": "6969358f21f99ca534e90656",
    "title": "Event Using Public JPG",
    "description": "Test upload using public/hero-wedding.jpg",
    "imageUrl": "https://res.cloudinary.com/.../events/fcfv88bq5m7zlnh7zgh8.jpg",
    "publicId": "events/fcfv88bq5m7zlnh7zgh8",
    "categoryId": "696154267fdba0e6636c2376",
    "createdAt": "2026-01-15T18:44:31.054Z",
    "updatedAt": "2026-01-15T18:44:31.054Z"
  },
  "status": 200
}
```

> Note: If `publicId` exists the server will call Cloudinary to delete the image. Cloudinary deletion errors are logged but do not block the API response (the event is removed from the DB regardless).

---

## Error cases

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

### 400 Invalid input — Malformed event ID

Requesting with an invalid ObjectId format returns 400:

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid event ID format"
  }
}
```

### 404 Not Found — Event does not exist

If the provided ID is well-formed but doesn't match an event:

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

## Important Notes

- **Cloudinary Image Deletion**: The associated Cloudinary image is deleted after the database record. If the Cloudinary deletion fails, the database record will still be removed, leaving the image orphaned. Consider implementing a cleanup job to handle orphaned images.

---

## Edge cases & behaviour (✅ tested)

- Invalid ObjectId format (e.g. `abc`) → 400 `INVALID_INPUT` (route-level validation).
- Well-formed but non-existent ID → 404 `EVENT_NOT_FOUND`.
- Event has no `publicId` (older events) → event deleted, no Cloudinary call is made.
- `publicId` exists but Cloudinary delete fails → API still returns 200; deletion failure is logged for investigation.
- Malformed Authorization header or missing Bearer → 401 `UNAUTHORIZED`.

---

## Convenience snippets

Create-then-delete (useful for tests):

```bash
# Create and capture ID
ID=$(curl -s -X POST http://localhost:3005/api/admin/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Temp Event" \
  -F "description=Auto-delete test" \
  -F "categoryId=696154267fdba0e6636c2376" \
  -F "file=@./.github/image.webp" | jq -r '.data.id')

# Delete the created event
if [ -n "$ID" ] && [ "$ID" != "null" ]; then
  curl -X DELETE http://localhost:3005/api/admin/events/$ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" | jq .
else
  echo "Create failed: no ID returned"
fi
```

---

## Implementation notes

- Route handler validates `id` using Zod (`eventIdSchema`).
- Service layer deletes the event and returns the deleted entity. If present, `publicId` is extracted and passed to the Cloudinary service for deletion.
- Cloudinary deletion is attempted synchronously but errors are caught and logged — they do not change the API result.

---

**Author:** API Docs
**References:** `docs/create-event.md` (request format examples)
