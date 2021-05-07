/* eslint  */
// health check URL
function Ping(): void {
  console.log("foo");
}

// This gets called on every request
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any): Promise<any> {
  context.res.end("OK");
  return { props: {} };
}

export default Ping;
