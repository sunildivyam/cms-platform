import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Your entry point
  format: ["cjs"], // Firebase Functions require CommonJS
  clean: true, // Clean dist folder before build
  minify: true, // Optional: smaller file size
  noExternal: [
    // IMPORTANT: Bundle local workspace packages
    "@cms/shared",
    // "@cms/ui",
  ],
  // Keep firebase-admin and functions as external (standard node_modules)
  external: ["firebase-admin", "firebase-functions"],
});
