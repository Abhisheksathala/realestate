import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://realestate-mern-server.onrender.com",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""), // Comment this out for now
      },
    },
  },
  plugins: [react()],
});
