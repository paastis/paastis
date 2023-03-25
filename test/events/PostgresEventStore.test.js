import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import pool from '../../src/postgres.js';
import { AppRegistered, AppStarted, AppStopped, AppUnregistered } from '../../src/events/Event';
import PostgresEventStore from '../../src/events/PostgresEventStore';

describe('PostgresEventStore', () => {

    const eventStore = new PostgresEventStore();

    beforeEach(async () => {
        await pool.query('DELETE FROM "Events"');
    });

    describe('.save', () => {

        it('should save an event in the database', async () => {
            // given
            const countBefore = parseInt((await pool.query('SELECT COUNT(*) FROM "Events"')).rows[0].count);

            const eventAppRegistered = new AppRegistered('my-app');
            const eventAppStarted = new AppStarted('my-app');
            const eventAppStopped = new AppStopped('my-app');
            const eventAppUnregistered = new AppUnregistered('my-app');

            // when
            await eventStore.save(eventAppRegistered);
            await eventStore.save(eventAppStarted);
            await eventStore.save(eventAppStopped);
            await eventStore.save(eventAppUnregistered);

            // then
            const countAfter = parseInt((await pool.query('SELECT COUNT(*) FROM "Events"')).rows[0].count);

            expect(countAfter).toBe(countBefore + 4);
        });

        it('should rollback the transaction if an error occurs', async () => {
        });
    });

    describe('.find', () => {
        it('should return all events from the database', async () => {
            // given
            const eventAppRegistered = new AppRegistered('my-app');
            const eventAppStarted = new AppStarted('my-app');
            const eventAppStopped = new AppStopped('my-app');
            const eventAppUnregistered = new AppUnregistered('my-app');

            await eventStore.save(eventAppRegistered);
            await eventStore.save(eventAppStarted);
            await eventStore.save(eventAppStopped);
            await eventStore.save(eventAppUnregistered);

            // when
            const events = await eventStore.find();

            // then
            expect(events.length).toBe(4);

            const firstEvent = events[0];
            expect(firstEvent).toBeInstanceOf(AppRegistered);
            expect(firstEvent.oid).toBe('my-app');
            expect(firstEvent.name).toBe('APP_REGISTERED');
            expect(firstEvent.date).toBeInstanceOf(Date);
        });
    });

    describe('.get', () => {
        it('should return a specific event by its oid from the database', async () => {
            // given
            const eventOfApp1 = new AppRegistered('app-1');
            const eventOfApp2 = new AppRegistered('app-2');
            const eventOfApp3 = new AppRegistered('app-3');
            const eventOfApp4 = new AppRegistered('app-4');

            await eventStore.save(eventOfApp1);
            await eventStore.save(eventOfApp2);
            await eventStore.save(eventOfApp3);
            await eventStore.save(eventOfApp4);

            // when
            const event = await eventStore.get('app-3');

            // then
            expect(event).toBeDefined;

            expect(event).toBeInstanceOf(AppRegistered);
            expect(event.oid).toBe('app-3');
            expect(event.name).toBe('APP_REGISTERED');
            expect(event.date).toBeInstanceOf(Date);
        });
    });
});

