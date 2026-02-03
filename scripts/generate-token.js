const http = require("http");

const BASE_URL = "http://localhost:3005/api/admin/login";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/generate-token.js <email> <password>");
  process.exit(1);
}

const data = JSON.stringify({ email, password });

const url = new URL(BASE_URL);

const req = http.request(
  {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: "POST",
    headers: {
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
        if (parsed.success && parsed.token) {
          console.log(parsed.token);
        } else {
          console.error("Failed to generate token:", parsed);
          process.exit(1);
        }
      } catch (e) {
        console.error("Parse error:", e.message);
        console.error("Response:", responseData.substring(0, 200));
        process.exit(1);
      }
    });
  },
);

req.on("error", (err) => {
  console.error("Request error:", err.message);
  process.exit(1);
});

req.write(data);
req.end();
