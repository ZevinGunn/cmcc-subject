import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ["zevingunn.dns.army"],
    open: true,
    host: "0.0.0.0",
    port: 4812,
    proxy: {
      "/api": {
        target: "http://localhost:7607",
        changeOrigin: true,
      },
    },
  },
});

