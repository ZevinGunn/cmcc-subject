import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || "http://localhost:3010";

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ["zevingunn.dns.army", 'home.1008086.xyz'],
    open: true,
    host: "0.0.0.0",
    port: 5174,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true
      }
    }
  }
});
