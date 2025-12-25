export type FieldType =
  | "string"
  | "text"
  | "richtext"
  | "number"
  | "boolean"
  | "media"
  | "reference"
  | "enum"
  | "datetime"
  | "slug";

export interface ContentField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  localized?: boolean;
}

export interface ContentType {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  fields: ContentField[];
  status: "draft" | "published";
  version: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Entry<T = any> {
  id: string;
  contetType: string;
  status: "draft" | "published";
  data: T;
  version: number;
  deleted: boolean;
}

export interface ContentEntry {
  id: string;
  tenantId: string;
  contentType: string;
  data: Record<string, any>;
  status: "draft";
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
}
