import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), "");
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL,
  };
});
