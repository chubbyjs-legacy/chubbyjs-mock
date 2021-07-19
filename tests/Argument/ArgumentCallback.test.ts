import { expect, test } from '@jest/globals';
import ArgumentCallback from '../../src/Argument/ArgumentCallback';

test('assert', () => {
    let result: string = '';

    const argument = new ArgumentCallback((input: string) => {
        result = input;
    });

    argument.assert('test');

    expect(result).toBe('test');
});
