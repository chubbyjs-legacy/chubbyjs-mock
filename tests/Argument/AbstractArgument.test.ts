import { expect, test } from '@jest/globals';
import AbstractArgument from '../../src/Argument/AbstractArgument';

test('assert', () => {
    const argument = new (class extends AbstractArgument {})();

    expect(() => {
        argument.assert('test');
    }).toThrow('Implement method: assert');
});
