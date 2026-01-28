# AIRA Events API Documentation

## Base URL

```
http://localhost:3005
```

---

## ️ Categories Domain

- `POST /api/admin/categories` **(Private)** - Create event category
- `PUT /api/admin/categories/:id` **(Private)** - Update event category
- `GET /api/public/categories` **(Public)** - List all event categories
- `POST /api/admin/events` **(Private)** - Create event
- `GET /api/public/events` **(Public)** - List all events with pagination and filtering
- `POST /api/admin/bookings` **(Private)** - Create booking

📖 **[View Create Documentation](./create-category.md)**  
📖 **[View Update Documentation](./update-category.md)**  
📖 **[View List Documentation](./read-categories.md)**  
📖 **[View Create Event Documentation](./create-event.md)**  
📖 **[View Read Events Documentation](./read-events.md)**  
📖 **[View Create Booking Documentation](./create-booking.md)**  
📖 **[View Read Bookings Documentation](./read-bookings.md)**
