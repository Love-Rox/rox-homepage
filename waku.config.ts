import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "waku/config";
import path from "path";
import { fileURLToPath } from "url";
import { generateSEOFiles } from "./scripts/generate-seo-files.js"; // Use .js for TS resolution in Vite dev if needed, or .ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple Vite plugin for SEO file generation
const seoPlugin = () => {
  let generated = false;
  return {
    name: "generate-seo",
    buildStart() {
      if (!generated) {
        generateSEOFiles();
        generated = true;
      }
    },
    handleHotUpdate({ file }: { file: string }) {
      if (file.includes("private/contents")) {
        console.log("Markdown change detected, regenerating SEO files...");
        generateSEOFiles();
      }
    },
  };
};


export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      seoPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@private": path.resolve(__dirname, "private"),
        "@content": path.resolve(__dirname, "private/contents"),
      },
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "EVAL" && warning.id?.includes("gray-matter")) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
