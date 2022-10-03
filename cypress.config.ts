/* eslint-disable import/no-anonymous-default-export */
import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.development.local" });

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on) {
      // See: https://obel.hatenablog.jp/entry/20220601/1654025400
      on("task", {
        log(message) {
          console.log(`[cy.log] ${message}`);

          return null;
        },
      });
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    screenshotsFolder: "./.reg/actual",
  },
  env: {
    auth0Username: process.env.AUTH0_CYPRESS_USERNAME,
    auth0Password: process.env.AUTH0_CYPRESS_PASSWORD,
    auth0Domain: process.env.DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN,
    auth0Audience: process.env.DATAWARE_TOOLS_AUTH_CONFIG_API_URL,
    auth0ClientId: process.env.DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID,
    auth0ClientSecret: process.env.DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_SECRET,
  },
  chromeWebSecurity: false,
});

/* eslint-enable import/no-anonymous-default-export */
