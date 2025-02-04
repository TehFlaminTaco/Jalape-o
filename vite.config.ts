import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  preview: {
    allowedHosts: ["ztwsdw-4173.csb.app"]
  },
  server: {
    allowedHosts: ["ztwsdw-5173.csb.app"]
  }
});
