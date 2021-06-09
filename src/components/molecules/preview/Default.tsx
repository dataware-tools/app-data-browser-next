import { SpecType } from "./types";

const spec: SpecType = {
  extensions: [".*"],
  contentTypes: [".*"],
};

const Container = (url: string): JSX.Element => {
  return <>Default Preview: {url}</>;
};

const containerWithSpec = {
  spec: spec,
  container: Container,
};

export { spec, Container };

export default containerWithSpec;
