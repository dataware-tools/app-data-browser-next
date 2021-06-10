type SpecType = {
  extensions: string[];
  contentTypes: string[];
};

type ContainerProps = {
  url: string;
};

type ContainerWithSpecType = {
  spec: SpecType;
  render: (props: ContainerProps) => JSX.Element;
}[];

export type { SpecType, ContainerProps, ContainerWithSpecType };
