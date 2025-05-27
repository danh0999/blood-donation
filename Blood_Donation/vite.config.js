import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), sassDts()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "src/components"),
      "@styles": resolve(__dirname, "src/assets/styles"),
      "@icon": resolve(__dirname, "src/assets/Icons"),
      "@pages": resolve(__dirname, "src/pages"),
      "@context": resolve(__dirname, "src/context"),
    },
  },
});
