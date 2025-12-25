import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";
import { createEntry } from "../lib";

export async function createEntryHandler(req: AuthedRequest, res: Response) {
  const { contentType, data, status = "draft" } = req.body;
  const tenantId = req.auth!.tenantId;
  const entry = await createEntry(data, tenantId, contentType, status);
  res.status(201).json(entry);
}
