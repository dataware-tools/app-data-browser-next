import Container from "@mui/material/Container";
import { Sample } from "components/molecules/Sample";

const Page = (): JSX.Element => {
  return (
    <Container>
      <Sample sample="sample" />
    </Container>
  );
};

export { Page as SamplePage };
