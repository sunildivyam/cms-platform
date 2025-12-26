import dotenv from "dotenv";
dotenv.config({
  path: "./.env.seed",
  override: true,
  encoding: "utf-8",
});

// const API = process.env.CMS_API!;
// const TOKEN = process.env.CMS_TOKEN!;
// const TENANT = process.env.TENANT!;
const API = "https://api-uptyu2shrq-uc.a.run.app";
const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk4OGQ1YTM3OWI3OGJkZjFlNTBhNDA5MTEzZjJiMGM3NWU0NTJlNDciLCJ0eXAiOiJKV1QifQ.eyJ0ZW5hbnRJZCI6Ik5iRFVjUFZCM09JbzBYSGU2TDJEIiwicm9sZSI6Im93bmVyIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Ntcy1kZXYtcHJvaiIsImF1ZCI6ImNtcy1kZXYtcHJvaiIsImF1dGhfdGltZSI6MTc2NjczODU1NSwidXNlcl9pZCI6IjU4a3FTOEpqYm5PaFhPT0VWRzlvdEpVNkdadzIiLCJzdWIiOiI1OGtxUzhKamJuT2hYT09FVkc5b3RKVTZHWncyIiwiaWF0IjoxNzY2NzM4NTU1LCJleHAiOjE3NjY3NDIxNTUsImVtYWlsIjoidGVzdEBjbXMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3RAY21zLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.hZAcyvM7xpWKLq96FbvAKqvIgT8niAVqcjDM6txyHDHalnibE8vXPI87J4HoUoTFaHMNCIAB5NM5svIzegra4UlsUvEl1AenPjPL2CPkgNJdVe6zFNCB_MjXkpHJDYn-fK1YVJXaUh7IxLd99KeSuHFbm4OKcSDHaNPrsFC1hK3sozx1r-gKioiiobwk6cysak56VGGx18gDhrbO7PIry6DSKWlpV3oIXyIsXRHj2gvOjFJtpZG7_4RYLNcOS7nZSYtXKAH2Z_Oc2O767gZQkd5KyXjlH_pQZ11MtYrs_H2vv4XTpS4Yq0R_zEI03NIJUki-1ii5gxVzsub0lLZN4w";
const TENANT = "demo";

if (!API || !TOKEN) {
  throw new Error("Missing CMS_API or CMS_TOKEN");
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${method}] ${path} → ${res.status} ${text}`);
  }

  return res.json();
}

/* -------------------------------------------------- */
/* CONTENT TYPES */
/* -------------------------------------------------- */

async function createContentTypes() {
  const types = [
    {
      name: "Category",
      slug: "category",
      tenant: TENANT,
      fields: [
        { name: "name", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "description", type: "text" },
        {
          name: "parentCategory",
          type: "reference",
          ref: "category",
        },
      ],
    },
    {
      name: "Tag",
      slug: "tag",
      tenant: TENANT,
      fields: [
        { name: "name", type: "string", required: true },
        { name: "slug", type: "string", required: true },
      ],
    },
    {
      name: "Blog Post",
      slug: "blog-post",
      tenant: TENANT,
      fields: [
        { name: "title", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "excerpt", type: "text" },
        { name: "heroImage", type: "string" },
        { name: "content", type: "json", required: true },
        { name: "seoMeta", type: "json" },
        {
          name: "category",
          type: "reference",
          ref: "category",
          required: true,
        },
        {
          name: "tags",
          type: "reference",
          ref: "tag",
          multiple: true,
        },
      ],
    },
  ];

  for (const type of types) {
    await request("POST", "/content-types", type);
  }

  console.log("✅ Content Types created");
}

/* -------------------------------------------------- */
/* ENTRIES */
/* -------------------------------------------------- */

async function createCategories() {
  const tech = await request("POST", "/entries", {
    tenant: TENANT,
    type: "category",
    data: {
      name: "Technology",
      slug: "technology",
      description: "Technology & engineering",
    },
  });

  const web = await request("POST", "/entries", {
    tenant: TENANT,
    type: "category",
    data: {
      name: "Web Development",
      slug: "web-development",
      description: "Frontend & backend",
      parentCategory: tech.id,
    },
  });

  return web;
}

async function createTags() {
  const names = [
    "Next.js",
    "Firebase",
    "Headless CMS",
    "Scalability",
    "Architecture",
  ];

  const tags = [];

  for (const name of names) {
    const tag = await request("POST", "/entries", {
      tenant: TENANT,
      type: "tag",
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
    tags.push(tag);
  }

  return tags;
}

async function createBlogs(categoryId: string, tagIds: string[]) {
  const entries = [];

  for (let i = 1; i <= 10; i++) {
    const entry = await request("POST", "/entries", {
      tenant: TENANT,
      type: "blog-post",
      data: {
        title: `Building a Production Headless CMS – Part ${i}`,
        slug: `production-headless-cms-part-${i}`,
        excerpt: "A real-world guide to building a scalable Headless CMS.",
        heroImage:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        content: {
          blocks: [
            {
              type: "paragraph",
              text: "This article covers architecture and scale considerations for a modern CMS.",
            },
          ],
        },
        seoMeta: {
          title: `Headless CMS – Part ${i}`,
          description: "Learn how real CMS platforms are architected.",
        },
        category: categoryId,
        tags: tagIds.slice(0, 3),
      },
    });

    entries.push(entry);
  }

  // Publish first 7
  for (let i = 0; i < 7; i++) {
    await request("POST", `/entries/blog-post/${entries[i].id}/publish`);
  }

  console.log("✅ Blog entries created (7 published, 3 drafts)");
}

/* -------------------------------------------------- */
/* RUN */
/* -------------------------------------------------- */

(async () => {
  console.log("🌱 Seeding CMS for tenant:", TENANT);

  await createContentTypes();
  const category = await createCategories();
  const tags = await createTags();

  await createBlogs(
    category.id,
    tags.map((t) => t.id)
  );

  console.log("🎉 CMS seeding completed successfully");
})();
