import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

import { requireAuth } from "../auth/requireAuth";
import { requireRole } from "../auth/requireRole";
import { createContentType } from "contentTypes/createContentType";
import { listContentTypes } from "contentTypes/listContentTypes";
import { updateContentType } from "contentTypes/updateContentType";
import { deleteContentType } from "contentTypes/deleteContentType";
import { deleteEntry } from "entries/deleteEntry";
import { updateEntry } from "entries/updateEntry";
import { getEntry } from "entries/getEntry";
import { listEntries } from "entries/listEntries";
import { createEntry } from "entries/createEntry";
import { publishEntry } from "entries/publishEntry";
import { unpublishEntry } from "entries/unpublishEntry";
import { listVersions } from "versions/listVersions";
import { rollbackVersion } from "versions/rollbackVersion";
import { listPublicEntries } from "public/listPublicEntries";
import { getPublicEntry } from "public/getPublicEntry";
import { createWebhook } from "webhooks/createWebhook";
import { getWebhooks } from "webhooks/getWebhooks";
import { getWebhookById } from "webhooks/getWebhookById";
import { deleteWebhook } from "webhooks/deleteWebhook";

admin.initializeApp();

const app = express();
app.use(express.json());

// **** contentTypes
app.post(
  "/content-types",
  requireAuth,
  requireRole(["admin", "editor"]),
  createContentType
);

app.get(
  "/content-types",
  requireAuth,
  requireRole(["admin", "editor"]),
  listContentTypes
);

app.patch(
  "/content-types/:id",
  requireAuth,
  requireRole(["admin", "editor"]),
  updateContentType
);

app.delete(
  "/content-types/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteContentType
);

// **** contentEntries

app.post(
  "/entries",
  requireAuth,
  requireRole(["admin", "editor"]),
  createEntry
);

app.get("/entries", requireAuth, listEntries);
app.get("/entries/:type/:id", requireAuth, getEntry);

app.patch(
  "/entries/:type/:id",
  requireAuth,
  requireRole(["admin", "editor"]),
  updateEntry
);

app.delete(
  "/entries/:type/:id",
  requireAuth,
  requireRole(["admin", "editor"]),
  deleteEntry
);

app.post(
  "/entries/:type/:id/publish",
  requireAuth,
  requireRole(["admin", "editor"]),
  publishEntry
);

app.post(
  "/entries/:type/:id/unpublish",
  requireAuth,
  requireRole(["admin", "editor"]),
  unpublishEntry
);

// ******* vesrions
app.get("/entries/:type/:id/versions", requireAuth, listVersions);

app.post(
  "/entries/:type/:id/versions/:version/rollback",
  requireAuth,
  requireRole(["admin", "editor"]),
  rollbackVersion
);

// ******* Webhooks
app.get("/webhooks", requireAuth, getWebhooks);
app.get("/webhooks/:id", requireAuth, getWebhookById);

app.post(
  "/webhooks",
  requireAuth,
  requireRole(["admin", "editor"]),
  createWebhook
);

app.delete(
  "/webhooks/:id",
  requireAuth,
  requireRole(["admin", "editor"]),
  deleteWebhook
);

// ***** public entries
app.get("/public/:tenant/:type", listPublicEntries);
app.get("/public/:tenant/:type/:slug", getPublicEntry);

export const api = functions.https.onRequest(app);
