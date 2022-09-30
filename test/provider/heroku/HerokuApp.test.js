import { describe, it, expect } from "@jest/globals";
import HerokuApp from "../../../src/provider/heroku/HerokuApp.js";

describe('HerokuApp', () => {

  const herokuApp = {
    id: 'abcd-1234',
    name: 'my-app',
    region: {
      name: 'some_region'
    },
    status: 'running',
    url: 'https://my-app.osc-fr1.scalingo.io',
    created_at: '2022-09-28',
    updated_at: '2022-09-29',
    released_at: '2022-09-30',
    force_https: true,
    sticky_session: true,
    git_url: 'git://my-app.osc-fr1.scalingo.io.git'
  };

  const herokuFormation = {}

  const paasApp = new HerokuApp(herokuApp, herokuFormation);

  describe('.provider', () => {

    it('should return "heroku"', () => {
      expect(paasApp.provider).toStrictEqual('heroku');
    });
  });

  describe('.region', () => {

    it('should return app region', () => {
      expect(paasApp.region).toStrictEqual('some_region');
    });
  });

  describe('.id', () => {

    it('should return app ID', () => {
      expect(paasApp.id).toStrictEqual('abcd-1234');
    });
  });

  describe('.key', () => {

    it('should return app name', () => {
      expect(paasApp.key).toStrictEqual('my-app');
    });
  });

  describe('.status', () => {

    it('should return "running"', () => {
      // given
      const formation = [{
        type: 'web',
        size: 'M',
        quantity: '1'
      }];
      const runningApp = new HerokuApp(herokuApp, formation);
      expect(runningApp.status).toStrictEqual('running');
    });

    it('should return "stopped"', () => {
      const formation = [];
      const stoppedApp = new HerokuApp(herokuApp, formation);
      expect(stoppedApp.status).toStrictEqual('stopped');
    });

    it('should return "other"', () => {
      expect(paasApp.status).toStrictEqual('stopped');
    });
  });

  describe('.createdAt', () => {

    it('should return app URL', () => {
      expect(paasApp.createdAt).toStrictEqual('2022-09-28');
    });
  });

  describe('.updatedAt', () => {

    it('should return app URL', () => {
      expect(paasApp.updatedAt).toStrictEqual('2022-09-29');
    });
  });

  describe('.lastDeployedAt', () => {

    it('should return app URL', () => {
      expect(paasApp.lastDeployedAt).toStrictEqual('2022-09-30');
    });
  });

  describe('.forceHttps', () => {

    it('should return app URL', () => {
      expect(paasApp.forceHttps).toStrictEqual(true);
    });
  });

  describe('.stickySessions', () => {

    it('should return app URL', () => {
      expect(paasApp.stickySessions).toStrictEqual(true);
    });
  });

  describe('.gitUrl', () => {

    it('should return app URL', () => {
      expect(paasApp.gitUrl).toStrictEqual('git://my-app.osc-fr1.scalingo.io.git');
    });
  });
});
