import "@testing-library/jest-dom/extend-expect";

beforeEach(() => {
  window.crypto = {
    // @ts-expect-error need for testing component using auth0
    subtle: {},
  };
});
