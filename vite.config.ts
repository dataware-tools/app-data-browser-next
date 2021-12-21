/**
 * @type {import('vite').UserConfig}
 */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import env from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import packageInfo from "./package.json";

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-anonymous-default-export
export default defineConfig({
  plugins: [
    react({
      exclude: /\.stories\.(t|j)sx?$/,
    }),
    tsconfigPaths(),
    env({ prefix: "DATAWARE_TOOLS" }),
  ],
  base: packageInfo.basePath,
  cacheDir: "./.vite",
  assetsInclude: ["robots.txt"],
  build: { outDir: "./dist" + packageInfo.basePath },
  resolve: {
    preserveSymlinks: true,
    // this option should be same with app-common peerDependencies
    dedupe: [
      "@auth0/auth0-react",
      "@emotion/react",
      "@emotion/styled",
      "@mui/icons-material",
      "@mui/lab",
      "@mui/material",
      "@mui/styles",
      "oidc-react",
      "react",
      "react-dom",
    ],
  },
});
