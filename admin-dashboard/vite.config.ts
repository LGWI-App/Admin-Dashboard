import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("jspdf") || id.includes("jspdf-autotable")) {
            return "pdf-export";
          }

          const nodeModulesPath = id.split("node_modules/")[1];
          if (!nodeModulesPath) return "vendor";

          const packageName = nodeModulesPath.startsWith("@")
            ? nodeModulesPath.split("/").slice(0, 2).join("/")
            : nodeModulesPath.split("/")[0];

          return `vendor-${packageName.replace("@", "").replace("/", "-")}`;
        },
      },
    },
  },
});
