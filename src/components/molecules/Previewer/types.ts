type SpecType = {
  extensions: string[];
  contentTypes: string[];
};

type ContainerWithSpecType = {
  spec: SpecType;
  render: (url: string) => JSX.Element;
}[];

export type { SpecType, ContainerWithSpecType };
