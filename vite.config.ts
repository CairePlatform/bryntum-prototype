import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@bryntum/schedulerpro", "@bryntum/schedulerpro-react"],
  },
  base: "/",
  build: {
    // Suppress warning for chunk size
    chunkSizeWarningLimit: 10000,

    // Turn warnings into errors. For build testing purposes
    // https://rollupjs.org/configuration-options/#onlog
    rollupOptions: {
      onLog(level, log, handler) {
        if (level === "warn") {
          handler("error", log);
        } else {
          handler(level, log);
        }
      },
    },
  },
});
