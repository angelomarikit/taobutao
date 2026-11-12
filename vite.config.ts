import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

function shareImage() {
  return {
    name: "share-image",
    transformIndexHtml(html: string) {
      const origin = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
      const image = origin.startsWith("https://") ? `${origin}/og.jpg` : "/og.jpg";
      return html.replaceAll("%OG_IMAGE%", image);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), shareImage()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
