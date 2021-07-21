import { describe, expect, test } from '@jest/globals';
import ArgumentCallback from '../src/Argument/ArgumentCallback';
import ArgumentInstanceOf from '../src/Argument/ArgumentInstanceOf';
import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';

describe('MockByCalls', () => {
    test('create', () => {
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
    });
});
