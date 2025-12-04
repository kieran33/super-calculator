import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg}"],
      },
      manifest: {
        name: "PWA",
        short_name: "PWA",
        description: "PWA",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#42b883",
        icons: [
          { src: "/vite.svg", sizes: "192x192", type: "image/png" },
          { src: "/vite.svg", sizes: "512x512", type: "image/png" },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
