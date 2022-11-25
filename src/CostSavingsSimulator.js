export default class CostSavingsSimulator {

  _provider;
  _eventStore;

  constructor(provider, eventStore) {
    this._provider = provider;
    this._eventStore = eventStore;
  }

  async estimate() {

    const events = await this._eventStore.listEvents();

    const eventsByApp = events.reduce((map, event) => {
      let appEvents = map.get(event.appKey);
      if (!appEvents) {
        appEvents = [];
        map.set(event.appKey, appEvents);
      }
      appEvents.push(event);
      return map;
    }, new Map());

    const activityPeriodsByApp = eventsByApp.forEach((appEvents) => {
      appEvents.reduce((result, event) => {
        if (event.name === 'app_detected' || event.name === 'app_resumed') {
          // start
        }
        if (event.name === 'app_paused' || event.name === 'app_removed') {
          // stop
        }
      }, []);
    });

    const result = {
      total: {
        startDate: new Date('2022-09-01'),
        endDate: new Date('2022-11-11'),
        amount: 2000
      }
    }

    return result;


    /*
        return {
          total: {
            startDate: new Date('2022-09-01'),
            endDate: new Date('2022-11-11'),
            amount: 2000
          },
          periods: [{
            startDate: new Date('2022-09-01'),
            endDate: new Date('2022-09-30'),
            amount: 900
          }, {
            startDate: new Date('2022-10-01'),
            endDate: new Date('2022-10-31'),
            amount: 1000
          }, {
            startDate: new Date('2022-11-01'),
            endDate: new Date('2022-11-11'),
            amount: 1100
          }],
        };
    */
  }
}
