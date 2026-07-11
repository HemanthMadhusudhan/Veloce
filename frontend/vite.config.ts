import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8090",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    imagetools(),
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    react(),
  ],
});
