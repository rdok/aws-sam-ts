global.console = {
  ...global.console,
  log: jest.fn(),
};

beforeEach(() => {
  process.env.AC_LIGULA = "mocked_ac_ligula";
});
