import { describe, expect, it } from '@jest/globals';
import { Container } from '../src/ioc.js';

describe('ioc', () => {
  describe('.lookup', () => {
    it('should be ok', async () => {
      // given
      const container = new Container();

      class NotificationService {}

      container.register(new NotificationService(), 'notificationService');

      // when
      const notificationService = container.lookup('notificationService');

      // then
      expect(notificationService).toBeDefined;
      expect(notificationService).toBeInstanceOf(NotificationService);
    });

    it('should throw an error if no service is registered with the given name', () => {
      // given
      const container = new Container();

      // when / then
      expect(() => container.lookup('undefinedService')).toThrow(
        /^Service not registered in IoC container$/
      );
    });
  });
});
