import { jest, describe, beforeAll, it, expect } from '@jest/globals';
import RunningAppRegistry from "../../src/registry/RunningAppRegistry.js";
import InMemoryRunningAppStore from "../../src/registry/stores/InMemoryRunningAppStore.js";
import RunningAppFactory from "../../src/registry/RunningAppFactory.js";
import RunningApp from "../../src/registry/RunningApp.js";
import yaml from "js-yaml";
import fs from "fs";

describe('RunningAppRegistry', function() {

  describe('#registerApp', function() {

    beforeAll(() => {
      // Lock Time
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() =>
          new Date('2022-09-27T00:25:00.000Z').valueOf()
        );
    });

    it('should add to the registry a simple app when it has not yet been registered', async () => {
      // given
      const store = new InMemoryRunningAppStore();
      const factory = new RunningAppFactory();
      const registry = new RunningAppRegistry(store, factory);
      const appKey = 'my-app-pr123-back';

      // when
      await registry.registerApp(appKey);

      // then
      const registeredApp = await store.get(appKey);
      expect(registeredApp).toBeDefined();
      expect(registeredApp.lastAccessedAt).toStrictEqual(new Date('2022-09-27T00:25:00.000Z'));
      expect((await store.all()).length).toStrictEqual(1);
    });

    it('should add to the registry a simple app when it has been already registered', async () => {
      // given
      const store = new InMemoryRunningAppStore();
      const factory = new RunningAppFactory();
      const registry = new RunningAppRegistry(store, factory);
      const appKey = 'my-app-pr456-back';
      const createdAt = new Date('2022-09-26T00:00:00.000Z');
      const alreadyRegisteredApp = new RunningApp('scalingo', 'osc-fr1', 'my-app-pr456-back', 15, createdAt, createdAt);
      await store.set(appKey, alreadyRegisteredApp);

      // when
      await registry.registerApp(appKey);

      // then
      const registeredApp = await store.get(appKey);
      expect(registeredApp).toBeDefined();
      expect(registeredApp.lastAccessedAt).toStrictEqual(new Date('2022-09-27T00:25:00.000Z'));
      expect((await store.all()).length).toStrictEqual(1);
    });

    it('should add to the registry an app with linked apps', async () => {
      // given
      const store = new InMemoryRunningAppStore();
      const rules = yaml.load(fs.readFileSync(process.cwd() + '/test/registry/config.test.yml', 'utf8'));
      const factory = new RunningAppFactory(rules);
      const registry = new RunningAppRegistry(store, factory);
      const appKey = 'my-app-pr123-front'; // my-app-review-pr(\d+)-front

      // when
      const registeredAppNames = await registry.registerApp(appKey);

      // then
      const registeredApp = await store.get(appKey);
      expect(registeredApp).toBeDefined();
      expect(registeredApp.lastAccessedAt).toStrictEqual(new Date('2022-09-27T00:25:00.000Z'));
      expect((await store.all()).length).toStrictEqual(2);
      expect((await store.get('my-app-pr123-back'))).toBeDefined();
      expect(registeredAppNames).toStrictEqual(['my-app-pr123-front', 'my-app-pr123-back']);
    });

    it.skip('should add to the registry an app with linked apps which some of them were already registered', async () => {
      // given

      // when

      // then
    });

    it.skip('should not loop infinitely', async () => {
      // given

      // when

      // then
    });
  });
});
