import "@testing-library/jest-dom/extend-expect";

beforeEach(() => {
  // @ts-expect-error need for testing component using auth0
  window.crypto = {
    subtle: {},
  };
});
