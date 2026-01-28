const http = require("http");

const args = process.argv.slice(2);
const ADMIN_TOKEN = args[0];
const BASE_URL = "http://localhost:3005/api/admin/bookings";

if (!ADMIN_TOKEN) {
  console.error("Usage: node scripts/create-booking.js <admin_token>");
  process.exit(1);
}

const bookings = Array.from({ length: 50 }, (_, i) => {
  const baseDate = new Date(2026, 1, 28); // Start from February 1, 2026
  baseDate.setDate(baseDate.getDate() + i); // Increment days properly

  return {
    fullName: `Test User ${i + 1}`,
    phone: `123456789${i % 10}`,
    email: `testuser${i + 1}@example.com`,
    eventDate: baseDate.toISOString(),
    budgetRange: `$${1000 + i * 100}-$${1500 + i * 100}`,
    message: `This is a test booking message for user ${i + 1}`,
    eventType: "example-event-type",
  };
});

let totalCreated = 0;

async function createBooking(booking) {
  return new Promise((resolve) => {
    const data = JSON.stringify(booking);

    const url = new URL(BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => (responseData += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(responseData);
            if (parsed.success) {
              console.log(`  ✓ Booking for ${booking.fullName} created`);
              totalCreated++;
            } else {
              console.log(
                `  ✗ Booking for ${booking.fullName} failed:\n${JSON.stringify(parsed, null, 2)}`,
              );
            }
          } catch (e) {
            console.log(`  ✗ Booking for ${booking.fullName} failed (parse error): ${e.message}`);
            console.log(`     Response: ${responseData.substring(0, 200)}`);
          }
          resolve();
        });
      },
    );

    req.on("error", (err) => {
      console.error(`  ✗ Booking for ${booking.fullName} failed (request error): ${err.message}`);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

(async () => {
  for (const booking of bookings) {
    await createBooking(booking);
  }
  console.log(`Total bookings created: ${totalCreated}`);
})();
