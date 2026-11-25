import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "build",
    rolldownOptions: {
      // The dependencies share code with React Server Components. This app builds only for browsers.
      checks: { moduleLevelDirective: false },
    },
  },
});
