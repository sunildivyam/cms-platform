import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

import { requireAuth } from "../auth/requireAuth";
import { requireRole } from "../auth/requireRole";
import { createEntryHandler } from "./entryHandlers";
import { createContentType } from "contentTypes/createContentType";
import { listContentTypes } from "contentTypes/listContentTypes";
import { updateContentType } from "contentTypes/updateContentType";
import { deleteContentType } from "contentTypes/deleteContentType";
import { deleteEntry } from "entries/deleteEntry";
import { updateEntry } from "entries/updateEntry";
import { getEntry } from "entries/getEntry";
import { listEntries } from "entries/listEntries";
import { createEntry } from "entries/createEntry";

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

export const api = functions.https.onRequest(app);
