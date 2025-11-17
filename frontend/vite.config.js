import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Compressão de arquivos estáticos (gzip)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024, // Comprime apenas arquivos maiores que 1KB
    }),
    // Compressão Brotli (melhor compressão que gzip)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
    }),
  ],
  build: {
    // Otimizações de build para compressão
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Chunking otimizado para melhor compressão
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
