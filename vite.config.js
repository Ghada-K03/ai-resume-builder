import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Local Analyze Server
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },

      "/cv": {
        target: "https://smart-store.devamer.online",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
