export class ClassExample {
  async functionExample(): Promise<string> {
    const response = process.env.ENV_EXAMPLE;
    if (response === undefined) throw Error("Environment ENV_EXAMPLE not set.");
    return Promise.resolve(response);
  }
}
