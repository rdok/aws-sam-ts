export class DolorSit {
  async find(): Promise<string> {
    const response = process.env.AC_LIGULA;
    if (response === undefined) throw Error("Environment AC_LIGULA not set");
    return Promise.resolve(response);
  }
}
