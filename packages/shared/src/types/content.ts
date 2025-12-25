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
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  localized?: boolean;
  readOnly?: boolean;
  permissions?: {
    read?: string[];
    write?: string[];
  };
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
  status: "draft" | "published";
  publishedAt?: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  currentVersion: number;
}

export interface ContentVersion {
  version: number;
  data: Record<string, any>;
  status: "draft" | "published";
  createdBy: string;
  createdAt: number;
}
