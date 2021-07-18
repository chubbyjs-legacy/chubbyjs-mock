import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';
import { expect, test } from '@jest/globals';

test('mocked methods', () => {
    class Sample {
        public a(name: string): string {
            return name;
        }

        public b(name: string): string {
            return name;
        }
    }

    const sample = MockByCalls<Sample>([
        Call.create('a').with('name1').willReturn('name1'),
        Call.create('b').with('name2').willReturn('name2'),
    ]);

    expect(sample.a('name1')).toBe('name1');
    expect(sample.b('name2')).toBe('name2');
});
