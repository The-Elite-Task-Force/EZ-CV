import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  // @ts-ignore
  test: {
    globals: true,
    coverage: {
      reporters: ["html"],
      provider: "v8",
      ignoreEmptyLines: true,
      reportsDirectory: "./VitestCoverage",
      exclude: [
        "**/apps/client/**",
        "**/node_modules/**",
        "**/tools/**",
        "**/dist/**",
        "**/apps/artboard/**",
        "**/libs/hooks/**",
        "**/.nx/**",
        "**/*.config.*",
        "**/*.config.ts",
        "**/*.config.js",
        "**/*.preset.js",
        "**/ui/**",
      ],
    },
    environment: "jsdom",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@/artboard": fileURLToPath(new URL("./apps/artboard/src", import.meta.url)),
      "@/client": fileURLToPath(new URL("./apps/client/src", import.meta.url)),
      "@/server": fileURLToPath(new URL("./apps/server/src", import.meta.url)),
      "@reactive-resume/dto": fileURLToPath(new URL("./libs/dto/src", import.meta.url)),
      "@reactive-resume/utils": fileURLToPath(new URL("./libs/utils/src", import.meta.url)),
      "@reactive-resume/schema": fileURLToPath(new URL("./libs/schema/src", import.meta.url)),
      "@/server/user/decorators/user.decorator": fileURLToPath(
        new URL("./apps/server/src/user/decorators/user.decorator", import.meta.url),
      ),
      "@reactive-resume/hooks": fileURLToPath(new URL("./libs/hooks/src", import.meta.url)),
      "@reactive-resume/parser": fileURLToPath(new URL("./libs/parser/src", import.meta.url)),
      "@reactive-resume/ui": fileURLToPath(new URL("./libs/ui/src", import.meta.url)),
    },
  },
});
