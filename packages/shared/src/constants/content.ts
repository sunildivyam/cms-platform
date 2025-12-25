// Allowed Where filters for queries
export const ALLOWED_FILTERS = ["status", "isDeleted"];

/*  ✔ Browser: 1 min
    ✔ CDN: 10 min
    ✔ SWR enabled
*/
export const PUBLIC_ENTRIES_CACHE =
  "public, max-age=60, s-maxage=600, stale-while-revalidate=60";
