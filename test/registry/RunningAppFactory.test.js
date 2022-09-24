import { jest } from '@jest/globals';
import RunningAppFactory from '../../src/registry/RunningAppFactory.js';
import RunningApp from "../../src/registry/RunningApp.js";
import yaml from "js-yaml";
import fs from "fs";

jest.useFakeTimers();

describe('RunningAppFactory#createRunningAppForRegistration', () => {

  it('should create an App', () => {
    // given
    const factory = new RunningAppFactory();

    const providerName = 'scalingo';
    const providerZone = 'osc-secnum-fr1';
    const appKey = 'hello-fastify-pr123-front';
    const appGroup = 'hello-fastify-pr123';
    const startedAt = new Date();
    const lastAccessedAt = new Date();

    // when
    const app = factory.createRunningAppForRegistration(providerName, providerZone, appKey, appGroup);

    // then
    expect(app).toBeInstanceOf(RunningApp);
    expect(app.provider).toBe(providerName);
    expect(app.region).toBe(providerZone);
    expect(app.name).toBe(appKey);
    expect(app.maxIdleTime).toStrictEqual(1);
    expect(app.startedAt).toStrictEqual(startedAt);
    expect(app.lastAccessedAt).toStrictEqual(lastAccessedAt);
  });

  it('should take into account Paastis config file', () => {
    // given
    const config = yaml.load(fs.readFileSync(process.cwd() + '/test/registry/config.test.yml', 'utf8'));
    const factory = new RunningAppFactory(config);

    const providerName = 'scalingo';
    const providerZone = 'osc-secnum-fr1';
    const appKey = 'pix-app-review-pr123-back';
    const appGroup = 'hello-fastify-pr123';
    const appMaxIdleTime = 15;
    const startedAt = new Date();
    const lastAccessedAt = new Date();

    // when
    const app = factory.createRunningAppForRegistration(providerName, providerZone, appKey, appGroup, appMaxIdleTime);

    // then
    expect(app).toBeInstanceOf(RunningApp);
    expect(app.provider).toBe('clever-cloud');
    expect(app.region).toBe('par');
    expect(app.name).toBe('toto-pr123-back');
    expect(app.maxIdleTime).toStrictEqual(30);
    expect(app.startedAt).toStrictEqual(startedAt);
    expect(app.lastAccessedAt).toStrictEqual(lastAccessedAt);
  });

});
