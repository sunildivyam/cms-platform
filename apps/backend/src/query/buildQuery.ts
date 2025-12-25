import * as admin from "firebase-admin";

export function buildPaginatedQuery(
  base: FirebaseFirestore.Query,
  options: {
    pageSize?: number;
    cursor?: string;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  let q = base;

  const sortField = options.sort || "updatedAt";
  const sortOrder = options.order === "asc" ? "asc" : "desc";

  q = q.orderBy(sortField, sortOrder);

  if (options.cursor) {
    q = q.startAfter(admin.firestore().doc(options.cursor));
  }

  q = q.limit(options.pageSize || 20);

  return q;
}
