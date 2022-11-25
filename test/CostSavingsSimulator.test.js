import { describe, expect, it } from "@jest/globals";
import CostSavingsSimulator from "../src/CostSavingsSimulator.js";
import PaasProvider from "../src/provider/PaasProvider.js";
import EventStore from "../src/events/EventStore.js";
import AppDetected from "../src/events/AppDetected.js";
import AppPaused from "../src/events/AppPaused.js";
import AppResumed from "../src/events/AppResumed.js";
import AppAccessed from "../src/events/AppAccessed.js";
import AppRemoved from "../src/events/AppRemoved.js";

class TestingProvider extends PaasProvider {
  constructor() {
    super('testing');
  }

  getSimulatorPricing() {
    return {
      size: 'M',
      pricePerHour: 0.034,
      maxPricePerMonth: null
    }
  }
}

describe('CostSavingsSimulator', function() {
  describe('#estimate', () => {
    it('should return the total cost savings for period from first event to now', async () => {
      // given
      const provider = new TestingProvider();
      const eventStore = new EventStore();
      const simulator = new CostSavingsSimulator(provider, eventStore);

      // we consider
      // - scheduler delay is 1mn
      // - idle time is 5mn

      // ▶️ scenario : app was created at 11:59:59

      await eventStore.saveEvent(new AppDetected('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:00:00')));
      await eventStore.saveEvent(new AppPaused('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:02:00'))); // idle time is 1mn but we paused strictly over 1mn

      await eventStore.saveEvent(new AppResumed('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:03:00')));
      await eventStore.saveEvent(new AppAccessed('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:03:25')));
      await eventStore.saveEvent(new AppAccessed('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:03:45')));
      await eventStore.saveEvent(new AppPaused('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:05:00')));

      await eventStore.saveEvent(new AppResumed('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:05:15')));
      await eventStore.saveEvent(new AppRemoved('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:07:00')));

      await eventStore.saveEvent(new AppDetected('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:09:00')));
      await eventStore.saveEvent(new AppPaused('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:11:00')));

      // Here, we simulate that the app was manually reactivated then deleted from the admin of Scalingo at 2022-11-11T12:14:55
      // Thus we will not be able to track this time

      await eventStore.saveEvent(new AppRemoved('scalingo:osc-fr1:app-web-1', new Date('2022-11-11T12:15:00')));

      // cost with paastis = 2 * 0.034 + 2 * 0.034 + 2 * 0.034 + 2 * 0.034 = 0.272
      // cost without paastis = 15 * 0.034 = 0.51

      // when
      const actual = await simulator.estimate();

      // then
      const expected = {
        total: {
          startDate: new Date('2022-11-11'),
          endDate: new Date('2022-11-11'),
          amount: 0.238,
          maxPrice: 14.69
        }
      };
      expect(actual).toStrictEqual(expected);
    });

    it('should return a result even when there is no events', async () => {

    });

    it('should return cost savings for multiple apps', async () => {

    });

    it('should return cost savings for multiple days', async () => {

    });

    it('should return cost savings for multiple apps and days', async () => {

    });
  });
});
