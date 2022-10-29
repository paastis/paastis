import { describe, expect, it } from '@jest/globals';
import CleverCloudApp from '../../../src/provider/clever-cloud/CleverCloudApp.js';

describe('CleverCloudApp', () => {
  const app = {
    id: 'abcd-1234',
    name: 'my-app',
    zone: 'rbx',
    status: 'running',
    deployment: { url: 'https://my-app.osc-fr1.clever-cloud.io' },
    creationDate: 1664323200000,
    last_deploy: 1664323200000,
    forceHttps: 'ENABLED',
    stickySessions: true,
    deployUrl: 'git://my-app.osc-fr1.CleverCloud.io.git',
  };

  const deployments = [];

  const instances = [];

  const paasApp = new CleverCloudApp(app, deployments, instances);

  describe('.provider', () => {
    it('should return "CleverCloud"', () => {
      expect(paasApp.provider).toStrictEqual('clever-cloud');
    });
  });

  describe('.region', () => {
    it('should return app region', () => {
      expect(paasApp.region).toStrictEqual('rbx');
    });
  });

  describe('.id', () => {
    it('should return app ID', () => {
      expect(paasApp.id).toStrictEqual('abcd-1234');
    });
  });

  describe('.key', () => {
    it('should return app name', () => {
      expect(paasApp.key).toStrictEqual('abcd-1234');
    });
  });

  describe('.url', () => {
    it('should return app URL', () => {
      expect(paasApp.url).toStrictEqual(
        'https://my-app.osc-fr1.clever-cloud.io'
      );
    });
  });

  describe('.createdAt', () => {
    it('should return app creation date', () => {
      expect(paasApp.createdAt).toStrictEqual(
        new Date('2022-09-28T00:00:00.000Z')
      );
    });
  });

  describe('.updatedAt', () => {
    it('should return app last update date', () => {
      expect(paasApp.updatedAt).toStrictEqual(
        new Date('2022-09-28T00:00:00.000Z')
      );
    });
  });

  describe('.lastDeployedAt', () => {
    it('should return app last deployment date', () => {
      expect(paasApp.lastDeployedAt).toStrictEqual(
        new Date('2022-09-28T00:00:00.000Z')
      );
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
      expect(paasApp.gitUrl).toStrictEqual(
        'git://my-app.osc-fr1.CleverCloud.io.git'
      );
    });
  });
});
