/**
 * @type {import('vite').UserConfig}
 */
import baseConfig from "@dataware-tools/dev-tools-for-react/configs/vite.config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-anonymous-default-export
export default defineConfig({
  ...baseConfig,
});
