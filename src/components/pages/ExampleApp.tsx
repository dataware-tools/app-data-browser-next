import { PageWrapper } from "@dataware-tools/app-common";
import { Sample } from "components/molecules/Sample";
import Container from "@material-ui/core/Container";

const ExampleApp = (): JSX.Element => {
  return (
    <PageWrapper>
      <Container>
        <Sample />
      </Container>
    </PageWrapper>
  );
};

export { ExampleApp };
