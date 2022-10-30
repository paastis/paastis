import { describe, expect, it } from '@jest/globals';
import ScalingoApp from '../../../src/provider/scalingo/ScalingoApp.js';

describe('ScalingoApp', () => {
  const app = {
    id: 'abcd-1234',
    name: 'my-app',
    status: 'running',
    url: 'https://my-app.osc-fr1.scalingo.io',
    created_at: '2022-09-28',
    updated_at: '2022-09-29',
    last_deployed_at: '2022-09-30',
    force_https: true,
    sticky_session: true,
    git_url: 'git://my-app.osc-fr1.scalingo.io.git',
  };

  const paasApp = new ScalingoApp(app);

  describe('.provider', () => {
    it('should return "scalingo"', () => {
      expect(paasApp.provider).toStrictEqual('scalingo');
    });
  });

  describe('.region', () => {
    it('should return app region', () => {
      expect(paasApp.region).toStrictEqual('osc-fr1');
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

  describe('.url', () => {
    it('should return app URL', () => {
      expect(paasApp.url).toStrictEqual('https://my-app.osc-fr1.scalingo.io');
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
      expect(paasApp.gitUrl).toStrictEqual(
        'git://my-app.osc-fr1.scalingo.io.git'
      );
    });
  });
});
