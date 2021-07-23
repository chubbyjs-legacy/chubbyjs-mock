import { describe, expect, test } from '@jest/globals';
import ArgumentCallback from '../src/Argument/ArgumentCallback';
import ArgumentInstanceOf from '../src/Argument/ArgumentInstanceOf';
import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';

describe('MockByCalls', () => {
    describe('create', () => {
        test('success', () => {
            class DateTimeService {
                private timezone = 'UTC';
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
                Call.create('format')
                    .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                    .willReturn('2008-05-23T08:12:55+00:00'),
            ]);

            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');
            expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');

            expect(dateTimeService['timezone']).toBeUndefined(); // validate property doesn't get mocked
        });

        test('Missing call', () => {
            class DateTimeService {
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
            ]);

            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

            expect(() => {
                dateTimeService.format(new Date(), 'c');
            }).toThrow('Missing call: {"class":"DateTimeService","callIndex":1}');
        });

        test('Method mismatch', () => {
            class DateTimeService {
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
                Call.create('format')
                    .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                    .willReturn('2008-05-23T08:12:55+00:00'),
            ]);

            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

            expect(() => {
                dateTimeService.toString();
            }).toThrow(
                'Method mismatch: {"class":"DateTimeService","callIndex":1,"expectedMethod":"format","givenMethod":"toString"}',
            );
        });

        test('Arguments count mismatch', () => {
            class DateTimeService {
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
                Call.create('format')
                    .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)))
                    .willReturn('2008-05-23T08:12:55+00:00'),
            ]);

            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

            expect(() => {
                dateTimeService.format(new Date(), 'c');
            }).toThrow(
                'Arguments count mismatch: {"class":"DateTimeService","callIndex":1,"method":"format","expectedArgsLength":1,"givenArgsLength":2}',
            );
        });

        test('Argument mismatch', () => {
            class DateTimeService {
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
                Call.create('format')
                    .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                    .willReturn('2008-05-23T08:12:55+00:00'),
            ]);

            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

            expect(() => {
                dateTimeService.format(new Date(), 'z');
            }).toThrow(
                'Argument mismatch: {"class":"DateTimeService","callIndex":1,"method":"format","argIndex":1,"expectedArg":"c","givenArg":"z"}',
            );
        });

        test('With with', () => {
            class Dummy {
                public test() {}
            }

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, [Call.create('test').with()]);

            dummy.test();
        });

        test('Without with and without any return', () => {
            class Dummy {
                public test() {}
            }

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, [Call.create('test')]);

            dummy.test();
        });

        test('With error', () => {
            class Dummy {
                public test() {}
            }

            const error = new Error('test');

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, [Call.create('test').willThrowError(error)]);

            expect(() => {
                dummy.test();
            }).toThrow(error);
        });

        test('With return self', () => {
            class Dummy {
                public test() {}
            }

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, [Call.create('test').willReturnSelf()]);

            expect(dummy.test()).toBe(dummy);
        });

        test('With return', () => {
            class Dummy {
                public test() {}
            }

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, [Call.create('test').willReturn('test')]);

            expect(dummy.test()).toBe('test');
        });

        test('With return callback', () => {
            class Dummy {
                public test() {}
            }

            const callback = () => 'test';

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, [Call.create('test').willReturnCallback(callback)]);

            expect(dummy.test()).toBe('test');
        });
    });
});
