it("errors having missing ENV_EXAMPLE value", async () => {
  delete process.env.ENV_EXAMPLE;
  const { classExample } = await makeExampleClass();
  await expect(classExample.functionExample()).rejects.toThrowError(
    "Environment ENV_EXAMPLE not set"
  );
});

it("responds with ENV_EXAMPLE value", async () => {
  process.env.ENV_EXAMPLE = "env-example-value";
  const { classExample } = await makeExampleClass();
  await expect(classExample.functionExample()).resolves.toEqual(
    "env-example-value"
  );
});

async function makeExampleClass() {
  const { ClassExample } = await import("../class-example");
  const classExample = new ClassExample();
  return { classExample };
}
