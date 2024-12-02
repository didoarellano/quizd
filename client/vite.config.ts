import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), "");
  return {
    plugins: [react(), tsconfigPaths()],
    base: env.VITE_BASE_URL,
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    test: {
      environment: "jsdom",
      globals: true,
      exclude: [...configDefaults.exclude, "**/firebase/functions/lib/**"],
      setupFiles: "./vitest.setup.ts",
    },
  };
});
