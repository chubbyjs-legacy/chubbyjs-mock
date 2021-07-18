import Call from '../src/Call';
import MockByCalls from '../src/MockByCalls';

test('factory', () => {
    class Sample {
        public a(name: string): string {
            return name;
        }

        public b(name: string): string {
            return name;
        }
    }

    const sample = MockByCalls<Sample>([Call.create('a').with('name1').willReturn('name1')]);

    expect(sample.a('name1')).toBe('name1');
});
