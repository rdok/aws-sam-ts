global.console = {
  ...global.console,
  log: jest.fn(),
};

beforeEach(() => {
  process.env.ENV_EXAMPLE = "mocked_env_example";
});
