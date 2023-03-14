import solid from "solid-start/vite";
import { defineConfig } from "vite";
import cloudflare from "solid-start-cloudflare-pages";


export default defineConfig({
  plugins: [solid({
    adapter: cloudflare({
      compatibilityFlags: ["streams_enable_constructors"]
    })
  })],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
