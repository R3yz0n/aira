const fs = require("fs");
const http = require("http");
const FormData = require("form-data");

// Paste your categories array below
const categories = [
  {
    id: "696154267fdba0e6636c2376",
    name: "Wedding Planning",
    description: "Updated description",
    createdAt: "2026-01-09T19:16:54.081Z",
    updatedAt: "2026-01-29T11:23:31.970Z",
    totalEvents: 0,
  },
  {
    id: "696157417fdba0e6636c238f",
    name: "Guest Flow Management",
    description: "a",
    createdAt: "2026-01-09T19:30:09.319Z",
    updatedAt: "2026-01-29T11:23:47.722Z",
    totalEvents: 0,
  },
  {
    id: "696157697fdba0e6636c23b0",
    name: "Decor Planning & Execution",
    description: "a",
    createdAt: "2026-01-09T19:30:49.340Z",
    updatedAt: "2026-01-29T11:24:06.018Z",
    totalEvents: 0,
  },
  {
    id: "696157997fdba0e6636c23b5",
    name: "Food & Beverage",
    description: "adfsa",
    createdAt: "2026-01-09T19:31:37.713Z",
    updatedAt: "2026-01-29T11:24:22.535Z",
    totalEvents: 0,
  },
  {
    id: "69679bbe77341ca0c44625f7",
    name: "Transport & Logistics",
    description: "sdfsadfsa",
    createdAt: "2026-01-14T13:35:58.423Z",
    updatedAt: "2026-01-29T11:24:42.541Z",
    totalEvents: 0,
  },
  {
    id: "69691bb521f99ca534e90595",
    name: "Makeup Mehndi Artist",
    description: "Professional business gatherings and meetings",
    createdAt: "2026-01-15T16:54:13.737Z",
    updatedAt: "2026-01-29T11:25:03.672Z",
    totalEvents: 0,
  },
  {
    id: "69691e9121f99ca534e905a5",
    name: "Tent",
    description: "Wedding celebrations",
    createdAt: "2026-01-15T17:06:25.645Z",
    updatedAt: "2026-01-29T11:25:17.248Z",
    totalEvents: 0,
  },
  {
    id: "69776f106c67ee6bf1e0a6d9",
    name: "Photography & Videography",
    description: "This is a test category.",
    createdAt: "2026-01-26T13:41:36.289Z",
    updatedAt: "2026-01-29T11:25:37.296Z",
    totalEvents: 0,
  },
  {
    id: "697b43c948b34aaaa9b9a20d",
    name: "Bar setup",
    description: "Bar setup",
    createdAt: "2026-01-29T11:26:01.975Z",
    updatedAt: "2026-01-29T11:26:01.975Z",
    totalEvents: 0,
  },
  {
    id: "697b43d248b34aaaa9b9a210",
    name: "Anchor",
    description: "Anchor",
    createdAt: "2026-01-29T11:26:10.844Z",
    updatedAt: "2026-01-29T11:26:10.844Z",
    totalEvents: 0,
  },
  {
    id: "697b43da48b34aaaa9b9a213",
    name: "Bridal Entry",
    description: "Bridal",
    createdAt: "2026-01-29T11:26:18.350Z",
    updatedAt: "2026-01-29T11:26:18.350Z",
    totalEvents: 0,
  },
];

const EVENTS_PER_CATEGORY = 10; // Change as needed
const ADMIN_TOKEN = process.argv[2];
if (!ADMIN_TOKEN) {
  console.error("Usage: node scripts/create-events.js <JWT_TOKEN>");
  process.exit(1);
}
const BASE_URL = "http://localhost:3005/api/admin/events";

let totalCreated = 0;

async function createEvent(category, index, categoryId, imagePath) {
  return new Promise((resolve) => {
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));
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
      },
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

const IMAGE_COUNT = 10;
const IMAGE_DIR = "./scripts/images";

(async () => {
  for (const category of categories) {
    console.log(`\n📌 Creating ${EVENTS_PER_CATEGORY} ${category.name} Events...`);
    for (let i = 1; i <= EVENTS_PER_CATEGORY; i++) {
      const imageIndex = Math.floor(Math.random() * IMAGE_COUNT) + 1;
      const imagePath = `${IMAGE_DIR}/image${imageIndex}.jpg`;
      await createEvent(category.name, i, category.id, imagePath);
      await delay(500);
    }
  }
  console.log(`\n✅ Total events created: ${totalCreated}`);
  process.exit(0);
})();
