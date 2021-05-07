import "@testing-library/jest-dom/extend-expect";
import { cache } from "swr";

afterEach(() => {
  cache.clear();
});

beforeEach(() => {
  // @ts-expect-error need for testing component using auth0
  window.crypto = {
    subtle: {},
  };
});
