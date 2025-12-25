import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

import { requireAuth } from "../auth/requireAuth";
import { requireRole } from "../auth/requireRole";
import { createContentTypeHandler } from "./contentTypesHandlers";
import { createEntryHandler } from "./entryHandlers";

admin.initializeApp();

const app = express();
app.use(express.json());

app.post(
  "/content-types",
  requireAuth,
  requireRole(["admin", "owner", "editor"]),
  createContentTypeHandler
);

app.post(
  "/entries",
  requireAuth,
  requireRole(["admin", "owner", "editor"]),
  createEntryHandler
);

export const api = functions.https.onRequest(app);
