import { ContentType } from "@cms/shared";

export function filterReadableFields(
  schema: ContentType,
  data: Record<string, any>,
  role: string
) {
  const result: Record<string, any> = {};

  for (const field of schema.fields) {
    if (field.permissions?.read && !field.permissions.read.includes(role)) {
      continue;
    }

    result[field.name] = data[field.name];
  }

  return result;
}
