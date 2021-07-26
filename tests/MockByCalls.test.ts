import { describe, expect, test } from '@jest/globals';
import ArgumentCallback from '../src/Argument/ArgumentCallback';
import ArgumentInstanceOf from '../src/Argument/ArgumentInstanceOf';
import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';

describe('MockByCalls', () => {
    describe('create', () => {
        describe('Mock a class', () => {
            test('default', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format')
                        .with(new ArgumentInstanceOf(Date), 'c')
                        .willReturn('2004-02-12T15:19:21+00:00'),
                    Call.create('format')
                        .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                        .willReturn('2008-05-23T08:12:55+00:00'),
                ]);

                expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');
                expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');

                expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
            });

            test('without calls', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService);

                expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
            });

            test('with missing call', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format')
                        .with(new ArgumentInstanceOf(Date), 'c')
                        .willReturn('2004-02-12T15:19:21+00:00'),
                ]);

                expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

                expect(() => {
                    dateTimeService.format(new Date(), 'c');
                }).toThrow('Missing call: {"class":"DateTimeService","callIndex":1,"actualMethod":"format"}');
            });

            test('with method mismatch', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format')
                        .with(new ArgumentInstanceOf(Date), 'c')
                        .willReturn('2004-02-12T15:19:21+00:00'),
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

            test('with arguments count mismatch', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format')
                        .with(new ArgumentInstanceOf(Date), 'c')
                        .willReturn('2004-02-12T15:19:21+00:00'),
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

            test('with argument mismatch', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format')
                        .with(new ArgumentInstanceOf(Date), 'c')
                        .willReturn('2004-02-12T15:19:21+00:00'),
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

            test('and validate it methods count', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService);

                expect(Object.getOwnPropertyNames(dateTimeService).length).toBe(13);
            });

            test('with properties', () => {
                class DateTimeService {
                    private timezone = 'UTC';
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService);

                expect(dateTimeService['timezone']).toBeUndefined();
            });

            test('with empty with', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format').with(),
                ]);

                // @ts-ignore
                dateTimeService.format();
            });

            test('without a return', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [Call.create('format')]);

                dateTimeService.format(new Date(), 'c');
            });

            test('with error', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const error = new Error('test');

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format').willThrowError(error),
                ]);

                expect(() => {
                    dateTimeService.format(new Date(), 'c');
                }).toThrow(error);
            });

            test('with return self', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format').willReturnSelf(),
                ]);

                expect(dateTimeService.format(new Date(), 'c')).toBe(dateTimeService);
            });

            test('with return', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format').willReturn('test2'),
                ]);

                expect(dateTimeService.format(new Date(), 'c')).toBe('test2');
            });

            test('with return callback', () => {
                class DateTimeService {
                    public format(date: Date, format: string): string {
                        return 'test';
                    }
                }

                const callback = () => 'test';

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
                    Call.create('format').willReturnCallback(callback),
                ]);

                expect(dateTimeService.format(new Date(), 'c')).toBe('test');
            });
        });

        describe('Mock an interface', () => {
            test('default', () => {
                interface DateTimeServiceInterface {
                    format(date: Date, format: string): string;
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeServiceInterface>(
                    class DateTimeService implements DateTimeServiceInterface {
                        format(date: Date, format: string): string {
                            return 'test';
                        }
                    },
                    [
                        Call.create('format')
                            .with(new ArgumentInstanceOf(Date), 'c')
                            .willReturn('2004-02-12T15:19:21+00:00'),
                        Call.create('format')
                            .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                            .willReturn('2008-05-23T08:12:55+00:00'),
                    ],
                );

                expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');
                expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');

                // if you want to be sure, that the mocked calls and the method call matches
                expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
            });

            test('with missing call', () => {
                interface DateTimeServiceInterface {
                    format(date: Date, format: string): string;
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<DateTimeServiceInterface>(
                    class DateTimeService implements DateTimeServiceInterface {
                        format(date: Date, format: string): string {
                            return 'test';
                        }
                    },
                );

                expect(() => {
                    dateTimeService.format(new Date(), 'c');
                }).toThrow('Missing call: {"class":"DateTimeService","callIndex":0,"actualMethod":"format"}');
            });
        });

        describe('Mock a function', () => {
            test('Mock an instantiable function', () => {
                function DateTimeService() {
                    // @ts-ignore
                    this.format = (date: Date, format: string): string => {
                        return 'test';
                    };
                }

                const mockByCalls = new MockByCalls();

                const dateTimeService = mockByCalls.create<typeof DateTimeService>(DateTimeService, [
                    Call.create('format')
                        .with(new ArgumentInstanceOf(Date), 'c')
                        .willReturn('2004-02-12T15:19:21+00:00'),
                    Call.create('format')
                        .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
                        .willReturn('2008-05-23T08:12:55+00:00'),
                ]);

                // @ts-ignore
                expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');

                // @ts-ignore
                expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');

                // if you want to be sure, that the mocked calls and the method call matches
                expect(dateTimeService.__mockByCalls.calls.length).toBe(dateTimeService.__mockByCalls.index);
            });
        });
    });
});
