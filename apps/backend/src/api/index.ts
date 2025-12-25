import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

import { requireAuth } from "../auth/requireAuth";
import { requireRole } from "../auth/requireRole";
import { createEntryHandler } from "./entryHandlers";
import { createContentType } from "contentTypes/createContentType";
import { listContentTypes } from "contentTypes/listContentTypes";

admin.initializeApp();

const app = express();
app.use(express.json());

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

app.post(
  "/entries",
  requireAuth,
  requireRole(["admin", "owner", "editor"]),
  createEntryHandler
);

export const api = functions.https.onRequest(app);
