import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Em produção o site é publicado no GitHub Pages em /mariniLP/
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/mariniLP/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
