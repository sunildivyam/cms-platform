import { ContentType } from "@cms/shared";

export function validateEntry(schema: ContentType, data: Record<string, any>) {
  for (const field of schema.fields) {
    if (field.required && data[field.id] == null) {
      throw new Error(`Missing required field: ${field.id}`);
    }
  }
}
