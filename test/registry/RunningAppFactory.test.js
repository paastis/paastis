import fs from 'fs';
import { describe, expect, it, jest, afterAll } from '@jest/globals';
import yaml from 'js-yaml';
import RunningAppFactory from '../../src/registry/RunningAppFactory.js';
import RunningApp from '../../src/registry/RunningApp.js';

// Freeze Date for deterministic timestamps and avoid faking `performance`
jest.useFakeTimers({
  now: new Date('2022-09-27T00:25:00.000Z'),
  doNotFake: ['performance'],
});

afterAll(() => {
  jest.useRealTimers();
});

describe('RunningAppFactory#createRunningAppForRegistration', () => {
  it('should create an App', () => {
    // given
    const config = { rules: [] };
    const factory = new RunningAppFactory(config);

    const providerName = 'scalingo';
    const providerZone = 'osc-fr-1';
    const appKey = 'hello-fastify-pr123-front';
    const startedAt = new Date();
    const lastAccessedAt = new Date();

    // when
    const app = factory.createRunningAppForRegistration(appKey);

    // then
    expect(app).toBeInstanceOf(RunningApp);
    expect(app.provider).toBe(providerName);
    expect(app.region).toBe(providerZone);
    expect(app.name).toBe(appKey);
    expect(app.linkedApps).toStrictEqual([]);
    expect(app.maxIdleTime).toStrictEqual(15);
    expect(app.startedAt).toStrictEqual(startedAt);
    expect(app.lastAccessedAt).toStrictEqual(lastAccessedAt);
  });

  it('should take into account Paastis config file', () => {
    // given
    const config = yaml.load(
      fs.readFileSync(process.cwd() + '/test/registry/config.test.yml', 'utf8')
    );
    const factory = new RunningAppFactory(config);

    const appKey = 'app-review-pr123-back';
    const linkedApps = null;
    const startedAt = new Date();
    const lastAccessedAt = new Date();

    // when
    const app = factory.createRunningAppForRegistration(appKey, linkedApps);

    // then
    expect(app).toBeInstanceOf(RunningApp);
    expect(app.provider).toBe('scalingo');
    expect(app.region).toBe('osc-fr-1');
    expect(app.name).toBe('renamed-app-pr123-back');
    expect(app.linkedApps).toStrictEqual(['app-review-pr123-front']);
    expect(app.maxIdleTime).toStrictEqual(30);
    expect(app.startedAt).toStrictEqual(startedAt);
    expect(app.lastAccessedAt).toStrictEqual(lastAccessedAt);
  });
});
