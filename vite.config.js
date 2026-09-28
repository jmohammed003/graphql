import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // This is a project Pages site at /graphql/. Dev remains available at /.
  base: command === "build" ? "/graphql/" : "/",
  plugins: [react()],
}));
