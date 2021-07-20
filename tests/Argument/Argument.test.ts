import { describe, expect, test } from '@jest/globals';
import ArgumentCallback from '../../src/Argument/ArgumentCallback';
import ArgumentInstanceOf from '../../src/Argument/ArgumentInstanceOf';
import { isArgument } from '../../src/Argument/ArgumentInterface';

describe('isArgument', () => {
    test('ArgumentInstanceOf is Argument', () => {
        expect(isArgument(new ArgumentInstanceOf('test'))).toBe(true);
    });

    test('ArgumentCallback is Argument', () => {
        expect(isArgument(new ArgumentCallback(() => {}))).toBe(true);
    });

    test('{} is not Argument', () => {
        expect(isArgument({})).toBe(false);
    });
});
