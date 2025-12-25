import { Response } from "express";
import { AuthedRequest } from "../auth/requireAuth";
import { createEntry, getEntries } from "../lib";

export async function createEntryHandler(req: AuthedRequest, res: Response) {
  const { contentType, data, status = "draft" } = req.body;
  const tenantId = req.auth!.tenantId;
  const entry = await createEntry(data, tenantId, contentType, status);
  return res.status(201).json(entry);
}

export async function getEntriesHandler(req: AuthedRequest, res: Response) {
  const { contentType, limit = 20 } = req.query;

  if (!contentType) {
    return res.status(400).json({ error: "Missing contentType" });
  }

  const tenantId = req.auth!.tenantId;

  const entries = await getEntries(
    tenantId,
    contentType as string,
    limit as number
  );

  return res.status(201).json(entries);
}
