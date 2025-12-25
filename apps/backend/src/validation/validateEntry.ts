import { ContentType } from "@cms/shared";

export function validateEntry(
  schema: ContentType,
  data: Record<string, any>,
  role: string
) {
  for (const field of schema.fields) {
    const value = data[field.name];

    // Required check
    if (field.required && (value === undefined || value === null)) {
      throw new Error(`Field "${field.name}" is required`);
    }

    if (value === undefined) continue;

    // Type validation
    switch (field.type) {
      case "string":
      case "richtext":
        if (typeof value !== "string") {
          throw new Error(`Field "${field.name}" must be string`);
        }
        break;

      case "number":
        if (typeof value !== "number") {
          throw new Error(`Field "${field.name}" must be number`);
        }
        break;

      case "boolean":
        if (typeof value !== "boolean") {
          throw new Error(`Field "${field.name}" must be boolean`);
        }
        break;

      case "reference":
        if (typeof value !== "string") {
          throw new Error(`Field "${field.name}" must be entry ID`);
        }
        break;
    }

    // Field write permission
    if (field.permissions?.write && !field.permissions.write.includes(role)) {
      throw new Error(`No write permission for "${field.name}"`);
    }
  }
}
