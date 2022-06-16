import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { StylesProvider } from "@mui/styles";
import { theme } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { SwrOptions } from "../src/utils";
import { userActionsState } from "../src/globalStates";
import { databaseConfigState } from "../src/components/organisms/DatabaseConfigModal/DatabaseConfigState";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import baseConfig from "@dataware-tools/dev-tools-for-react/configs/.storybook/preview"

export const parameters = {
  ...baseConfig.parameters
};

const initialDatabaseConfig = {
  columns: [
    {
      name: "record_name",
      display_name: "Record Name",
      necessity: "required",
      order_of_input: 0,
      dtype: "string",
      aggregation: "first",
      is_search_target: true,
      is_display_field: true,
      is_record_title: true,
      is_secret: false,
    },
    {
      name: "description",
      display_name: "Description",
      necessity: "recommended",
      order_of_input: 1,
      dtype: "string",
      aggregation: "first",
      is_display_field: true,
      is_record_title: false,
      is_secret: false,
      is_search_target: false,
    },
    {
      name: "contents",
      dtype: "dict",
      aggregation: "mergeObjects",
      display_name: "Contents",
      is_display_field: false,
      is_record_title: false,
      necessity: "unnecessary",
      is_search_target: false,
      is_secret: true,
    },
    {
      name: "record_id",
      dtype: "string",
      aggregation: "first",
      display_name: "Record ID",
      is_display_field: false,
      is_record_title: false,
      necessity: "unnecessary",
      is_search_target: false,
      is_secret: false,
    },
  ],
  index_columns: ["record_id", "path"],
};

export const decorators = [
  (Story, context) => {
    return (
      <>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SWRConfig value={SwrOptions}>
              <RecoilRoot
                initializeState={({ set }) => {
                  set(userActionsState, ["databases", "metadata"]);
                  set(databaseConfigState, initialDatabaseConfig);
                }}
              >
                <BrowserRouter>
                  <Story {...context} />
                </BrowserRouter>
              </RecoilRoot>
            </SWRConfig>
          </ThemeProvider>
        </StylesProvider>
      </>
    );
  },
];
