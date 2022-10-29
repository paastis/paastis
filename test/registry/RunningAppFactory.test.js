import fs from "fs";
import { jest, describe, it, expect } from '@jest/globals';
import yaml from "js-yaml";
import RunningAppFactory from '../../src/registry/RunningAppFactory.js';
import RunningApp from "../../src/registry/RunningApp.js";

jest.useFakeTimers();

describe('RunningAppFactory#createRunningAppForRegistration', () => {

  it('should create an App', () => {
    // given
    const config = { "rules": [] };
    const factory = new RunningAppFactory(config);

    const providerName = 'scalingo';
    const providerZone = 'to_be_defined';
    const appKey = 'hello-fastify-pr123-front';
    const startedAt = new Date();
    const lastAccessedAt = new Date();

    // when
    console.log('userConfig');
    console.log(config);
    const app = factory.createRunningAppForRegistration(appKey);

    // then
    expect(app).toBeInstanceOf(RunningApp);
    expect(app.provider).toBe(providerName);
    expect(app.region).toBe(providerZone);
    expect(app.name).toBe(appKey);
    expect(app.linkedApps).toStrictEqual([]);
    expect(app.maxIdleTime).toStrictEqual(1);
    expect(app.startedAt).toStrictEqual(startedAt);
    expect(app.lastAccessedAt).toStrictEqual(lastAccessedAt);
  });

  it('should take into account Paastis config file', () => {
    // given
    const config = yaml.load(fs.readFileSync(process.cwd() + '/test/registry/config.test.yml', 'utf8'));
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
    expect(app.region).toBe('to_be_defined');
    expect(app.name).toBe('renamed-app-pr123-back');
    expect(app.linkedApps).toStrictEqual(['app-review-pr123-front']);
    expect(app.maxIdleTime).toStrictEqual(30);
    expect(app.startedAt).toStrictEqual(startedAt);
    expect(app.lastAccessedAt).toStrictEqual(lastAccessedAt);
  });

});
