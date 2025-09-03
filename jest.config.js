/** @type {import('jest').Config} */
const config = {
  verbose: true,
  collectCoverage: true,
  detectOpenHandles: true,
  globalTeardown: './test/global-teardown.js',
};

export default config;
