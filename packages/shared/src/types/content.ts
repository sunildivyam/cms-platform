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
  type: FieldType;
  required?: boolean;
  options?: string[];
}

export interface ContentType {
  id: string;
  name: string;
  slug: string;
  fields: ContentField[];
  versioned: boolean;
}

export interface ContentEntry<T = any> {
  id: string;
  type: string;
  status: "draft" | "published";
  data: T;
  version: number;
}
