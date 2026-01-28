# POST /api/public/bookings - Create Booking

**Description:** Create a new booking. Accessible to public users with abuse protections.

**Authentication:** Not required

---

## Use Case 1: Create Booking with Valid Data

Create a new booking with all required fields.

### Request

```bash
curl -X POST http://localhost:3005/api/public/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com",
    "eventType": "Wedding",
    "eventDate": "2026-02-15T18:00:00.000Z",
    "budgetRange": "$1000-$2000",
    "message": "Looking forward to this event."
  }' | jq .
```

**Method:** POST

**URL:** `http://localhost:3005/api/public/bookings`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

- `fullName` (string, required)
- `phone` (string, required)
- `email` (string, required)
- `eventType` (string, required)
- `eventDate` (ISO 8601 string, required)
- `budgetRange` (string, required)
- `message` (string, optional)

### Response Success (201)

```json
{
  "success": true,
  "data": {
    "id": "697000000000000000000001",
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com",
    "eventType": "Wedding",
    "eventDate": "2026-02-15T18:00:00.000Z",
    "budgetRange": "$1000-$2000",
    "message": "Looking forward to this event.",
    "createdAt": "2026-01-26T18:00:00.000Z",
    "updatedAt": "2026-01-26T18:00:00.000Z"
  },
  "status": 201
}
```

**Response Fields:**

- `id` - MongoDB ObjectId of created booking
- `fullName` - Full name of the person booking
- `phone` - Phone number
- `email` - Email address
- `eventType` - Type of event
- `eventDate` - Event date (ISO 8601 format)
- `budgetRange` - Budget range for the event
- `message` - Optional message
- `createdAt` - Booking creation timestamp
- `updatedAt` - Last update timestamp

---

## Error Cases

### Error 400: Bad Request - Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3005/api/public/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": ""
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
        "fullName": ["Full name is required"],
        "phone": ["Phone number is required"],
        "email": ["Email is required"],
        "eventType": ["Event type is required"],
        "eventDate": ["Event date is required"],
        "budgetRange": ["Budget range is required"]
      }
    }
  }
}
```

---

### Error 500: Internal Server Error - Database Failure

**Request:**

```bash
curl -X POST http://localhost:3005/api/public/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com",
    "eventType": "Wedding",
    "eventDate": "2026-02-15T18:00:00.000Z",
    "budgetRange": "$1000-$2000",
    "message": "Looking forward to this event."
  }' | jq .
```

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

| Parameter     | Type   | Required | Constraints       | Example                          |
| ------------- | ------ | -------- | ----------------- | -------------------------------- |
| `fullName`    | string | Yes      | 1-100 characters  | "John Doe"                       |
| `phone`       | string | Yes      | 8-20 characters   | "1234567890"                     |
| `email`       | string | Yes      | Valid email       | "john.doe@example.com"           |
| `eventType`   | string | Yes      | 1-100 characters  | "Wedding"                        |
| `eventDate`   | string | Yes      | ISO 8601 format   | "2026-02-15T18:00:00.000Z"       |
| `budgetRange` | string | Yes      | 1+ characters     | "$1000-$2000"                    |
| `message`     | string | No       | 1-1000 characters | "Looking forward to this event." |

**Note:** The request must use `application/json`.

---

## Response Status Codes

| Code | Meaning      | Scenario                                             |
| ---- | ------------ | ---------------------------------------------------- |
| 201  | Created      | Booking successfully created                         |
| 400  | Bad Request  | Validation error (missing field, invalid data, etc.) |
| 500  | Server Error | Database failure or other server error               |

---

## Implementation Notes

- **Authentication:** Not required
- **Content-Type:** application/json
- **Validation:** All fields validated with Zod schema before processing
- **Response Format:** Consistent with API standard (success/status/data structure)
- **Timestamps:** ISO 8601 format for createdAt and updatedAt
