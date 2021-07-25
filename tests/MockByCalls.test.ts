import { describe, expect, test } from '@jest/globals';
import ArgumentCallback from '../src/Argument/ArgumentCallback';
import ArgumentInstanceOf from '../src/Argument/ArgumentInstanceOf';
import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';

describe('MockByCalls', () => {
    describe('create', () => {
        test('With successfull calls', () => {
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
            expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');

            expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
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
            }).toThrow('Missing call: {"class":"DateTimeService","callIndex":1,"actualMethod":"format"}');
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
                'Method mismatch: {"class":"DateTimeService","callIndex":1,"actualMethod":"toString","expectedMethod":"format"}',
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
                'Arguments count mismatch: {"class":"DateTimeService","callIndex":1,"actualMethod":"format","actualArgsLength":2,"expectedArgsLength":1}',
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
                'Argument mismatch: {"class":"DateTimeService","callIndex":1,"actualMethod":"format","argIndex":1,"actualArg":"z","expectedArg":"c"}',
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

        test('Mocked method count', () => {
            class Dummy {
                public test() {}
            }

            const mockByCalls = new MockByCalls();

            const dummy = mockByCalls.create<Dummy>(Dummy, []);

            expect(Object.getOwnPropertyNames(dummy).length).toBe(13);
        });

        test('No mocked properties', () => {
            class DateTimeService {
                private timezone = 'UTC';
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, []);

            expect(dateTimeService['timezone']).toBeUndefined();
        });

        test('With function instead of class', () => {
            function DateTimeService() {
                // @ts-ignore
                this.format = (date: Date, format: string) => {};
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<typeof DateTimeService>(DateTimeService, [
                Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
                Call.create('format')
                    .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                    .willReturn('2008-05-23T08:12:55+00:00'),
            ]);

            // @ts-ignore
            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

            // @ts-ignore
            expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');

            expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
        });

        test('No calls', () => {
            class DateTimeService {
                public format(date: Date, format: string) {}
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService);

            expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
        });

        test('With interface', () => {
            interface DateTimeService {
                format(date: Date, format: string): string;
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(
                class {
                    format(date: Date, format: string) {}
                },
                [Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00')],
            );

            expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

            expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
        });

        test('With interface and missing call', () => {
            interface DateTimeService {
                format(date: Date, format: string): string;
            }

            const mockByCalls = new MockByCalls();

            const dateTimeService = mockByCalls.create<DateTimeService>(
                class {
                    format(date: Date, format: string) {}
                },
            );

            expect(() => {
                dateTimeService.format(new Date(), 'c');
            }).toThrow('Missing call: {"class":"","callIndex":0,"actualMethod":"format"}');
        });
    });
});
