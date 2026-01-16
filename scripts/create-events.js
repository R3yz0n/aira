const fs = require("fs");
const http = require("http");
const FormData = require("form-data");
const dotenv = require("dotenv");

// provide ur token
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTQyZmZhMTliZTNlZGVkMWZhMzYzNWEiLCJlbWFpbCI6ImFpcmFldmVudHMwMDFAZ21haWwuY29tIiwiaWF0IjoxNzY4NDc2MzkyLCJleHAiOjE3Njg0NzY5OTJ9.zHjYH5xNStIc6jcpAxbPbvOSqLT_W8clrn0Iw8SWkBQ";
const BASE_URL = "http://localhost:3005/api/admin/events";

dotenv.config();

const categories = JSON.parse(process.env.CATEGORIES || "{}");
const counts = JSON.parse(process.env.COUNTS || "{}");

if (Object.keys(categories).length === 0 || Object.keys(counts).length === 0) {
  console.error("CATEGORIES or COUNTS environment variables are not set or invalid.");
  process.exit(1);
}

let totalCreated = 0;

async function createEvent(category, index, categoryId) {
  return new Promise((resolve) => {
    const form = new FormData();
    // file path
    form.append("file", fs.createReadStream("./.github/a.webp"));
    form.append("title", `${category}_${index}`);
    form.append("description", `Amazing ${category.toLowerCase()} event number ${index}`);
    form.append("categoryId", categoryId);

    const url = new URL(BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          ...form.getHeaders(),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.success) {
              console.log(`  ✓ ${category}_${index} created`);
              totalCreated++;
            } else {
              console.log(`  ✗ ${category}_${index} failed:\n${JSON.stringify(parsed, null, 2)}`);
            }
          } catch (e) {
            console.log(`  ✗ ${category}_${index} failed (parse error): ${e.message}`);
            console.log(`     Response: ${data.substring(0, 200)}`);
          }
          resolve();
        });
      }
    );

    req.on("error", (err) => {
      console.log(`  ✗ ${category}_${index} failed (connection error): ${err.message}`);
      resolve();
    });

    form.pipe(req);
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  for (const [category, count] of Object.entries(counts)) {
    console.log(`\n📌 Creating ${count} ${category} Events...`);
    const categoryId = categories[category];

    for (let i = 1; i <= count; i++) {
      await createEvent(category, i, categoryId);
      await delay(500); // 500ms delay between requests
    }
  }

  console.log(`\n✅ Total events created: ${totalCreated}`);
  process.exit(0);
})();
