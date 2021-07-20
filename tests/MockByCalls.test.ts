import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';
import { expect, test } from '@jest/globals';

test('mocked methods', () => {
    class BaseSample {
        public a(name: string): string {
            return name;
        }
    }

    class Sample extends BaseSample {
        public constructor(private defaultName: string) {
            super();
        }

        public b(name: string): string {
            return name;
        }

        public c(name: string): string {
            return name;
        }
    }

    const sample = MockByCalls<Sample>(Sample, [
        Call.create('a').with('name1').willReturn('name1'),
        Call.create('b').with('name2').willReturn('name2'),
    ]);

    expect(sample.a('name1')).toBe('name1');
    expect(sample.b('name2')).toBe('name2');
});
