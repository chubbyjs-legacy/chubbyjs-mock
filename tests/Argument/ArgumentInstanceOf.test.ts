import { describe, expect, test } from '@jest/globals';
import ArgumentInstanceOf from '../../src/Argument/ArgumentInstanceOf';

describe('assert', () => {
    test('string matches string', () => {
        const argument = new ArgumentInstanceOf('string');
        argument.assert('test');
    });

    test('string matches number', () => {
        const t = () => {
            const argument = new ArgumentInstanceOf('number');
            argument.assert('test');
        };
        expect(t).toThrow('Expected type number, given type string');
    });

    test('class based object matches class based object ', () => {
        const Sample1 = class {
            getName() {
                return 'name';
            }
        };

        const argument = new ArgumentInstanceOf(Sample1);
        argument.assert(new Sample1());
    });

    test('class based object does not matches different class based object ', () => {
        const t = () => {
            const Sample1 = class {
                getName() {
                    return 'name';
                }
            };

            const Sample2 = class {
                getName() {
                    return 'name';
                }
            };

            const argument = new ArgumentInstanceOf(Sample1);
            argument.assert(new Sample2());
        };
        expect(t).toThrow('Expected type Sample1, given type Sample2');
    });

    test('Function matches Function ', () => {
        const Sample1 = () => {};

        const argument = new ArgumentInstanceOf(Sample1);
        argument.assert(Sample1);
    });

    test('Function does not matches Function ', () => {
        const t = () => {
            const Sample1 = () => {};
            const Sample2 = () => {};

            const argument = new ArgumentInstanceOf(Sample1);
            argument.assert(Sample2);
        };
        expect(t).toThrow('Expected type Sample1, given type Sample2');
    });
});
