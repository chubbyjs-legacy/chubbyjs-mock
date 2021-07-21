import { describe, expect, test } from '@jest/globals';
import Call from '../src/Call';

describe('Call', () => {
    test('wihtout with', () => {
        const call = Call.create('method');

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(false);
        expect(call.hasReturnSelf()).toBe(false);
        expect(call.hasReturn()).toBe(false);
        expect(call.hasReturnCallback()).toBe(false);
        expect(call.getWith()).toEqual(undefined);
        expect(call.getError()).toBe(undefined);
        expect(call.getReturn()).toBe(undefined);
        expect(call.getReturnCallback()).toBe(undefined);
    });

    test('empty with', () => {
        const call = Call.create('method').with();

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(true);
        expect(call.hasReturnSelf()).toBe(false);
        expect(call.hasReturn()).toBe(false);
        expect(call.hasReturnCallback()).toBe(false);
        expect(call.getWith()).toEqual([]);
        expect(call.getError()).toBe(undefined);
        expect(call.getReturn()).toBe(undefined);
        expect(call.getReturnCallback()).toBe(undefined);
    });

    test('with', () => {
        const call = Call.create('method').with('argument');

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(true);
        expect(call.hasReturnSelf()).toBe(false);
        expect(call.hasReturn()).toBe(false);
        expect(call.hasReturnCallback()).toBe(false);
        expect(call.getWith()).toEqual(['argument']);
        expect(call.getError()).toBe(undefined);
        expect(call.getReturn()).toBe(undefined);
        expect(call.getReturnCallback()).toBe(undefined);
    });

    test('error', () => {
        const error = new Error();

        const call = Call.create('method').willThrowError(error);

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(false);
        expect(call.hasReturnSelf()).toBe(false);
        expect(call.hasReturn()).toBe(false);
        expect(call.hasReturnCallback()).toBe(false);
        expect(call.getWith()).toEqual(undefined);
        expect(call.getError()).toBe(error);
        expect(call.getReturn()).toBe(undefined);
        expect(call.getReturnCallback()).toBe(undefined);
    });

    test('return self', () => {
        const call = Call.create('method').willReturnSelf();

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(false);
        expect(call.hasReturnSelf()).toBe(true);
        expect(call.hasReturn()).toBe(false);
        expect(call.hasReturnCallback()).toBe(false);
        expect(call.getWith()).toEqual(undefined);
        expect(call.getError()).toBe(undefined);
        expect(call.getReturn()).toBe(undefined);
        expect(call.getReturnCallback()).toBe(undefined);
    });

    test('return', () => {
        const value = 'test';

        const call = Call.create('method').willReturn(value);

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(false);
        expect(call.hasReturnSelf()).toBe(false);
        expect(call.hasReturn()).toBe(true);
        expect(call.hasReturnCallback()).toBe(false);
        expect(call.getWith()).toEqual(undefined);
        expect(call.getError()).toBe(undefined);
        expect(call.getReturn()).toBe(value);
        expect(call.getReturnCallback()).toBe(undefined);
    });

    test('return callback', () => {
        const callback = () => {};

        const call = Call.create('method').willReturnCallback(callback);

        expect(call.getMethod()).toBe('method');
        expect(call.hasWith()).toBe(false);
        expect(call.hasReturnSelf()).toBe(false);
        expect(call.hasReturn()).toBe(false);
        expect(call.hasReturnCallback()).toBe(true);
        expect(call.getWith()).toEqual(undefined);
        expect(call.getError()).toBe(undefined);
        expect(call.getReturn()).toBe(undefined);
        expect(call.getReturnCallback()).toBe(callback);
    });

    test('try error and return self', () => {
        expect(() => {
            Call.create('method').willThrowError(new Error()).willReturnSelf();
        }).toThrow('willReturnSelf: There is already a error');
    });

    test('try error and return', () => {
        expect(() => {
            Call.create('method').willThrowError(new Error()).willReturn('test');
        }).toThrow('willReturn: There is already a error');
    });

    test('try error and return callback', () => {
        expect(() => {
            Call.create('method')
                .willThrowError(new Error())
                .willReturnCallback(() => {});
        }).toThrow('willReturnCallback: There is already a error');
    });

    test('try return self and error', () => {
        expect(() => {
            Call.create('method').willReturnSelf().willThrowError(new Error());
        }).toThrow('willThrowError: There is already a return self');
    });

    test('try return self and return', () => {
        expect(() => {
            Call.create('method').willReturnSelf().willReturn('test');
        }).toThrow('willReturn: There is already a return self');
    });

    test('try return self and return callback', () => {
        expect(() => {
            Call.create('method')
                .willReturnSelf()
                .willReturnCallback(() => {});
        }).toThrow('willReturnCallback: There is already a return self');
    });

    test('try return and error', () => {
        expect(() => {
            Call.create('method').willReturn('test').willThrowError(new Error());
        }).toThrow('willThrowError: There is already a return');
    });

    test('try return and return self', () => {
        expect(() => {
            Call.create('method').willReturn('test').willReturnSelf();
        }).toThrow('willReturnSelf: There is already a return');
    });

    test('try return and return callback', () => {
        expect(() => {
            Call.create('method')
                .willReturn('test')
                .willReturnCallback(() => {});
        }).toThrow('willReturnCallback: There is already a return');
    });

    test('try return callback and error', () => {
        expect(() => {
            Call.create('method')
                .willReturnCallback(() => {})
                .willThrowError(new Error());
        }).toThrow('willThrowError: There is already a return callback');
    });

    test('try return callback and return self', () => {
        expect(() => {
            Call.create('method')
                .willReturnCallback(() => {})
                .willReturnSelf();
        }).toThrow('willReturnSelf: There is already a return callback');
    });

    test('try return callback and return', () => {
        expect(() => {
            Call.create('method')
                .willReturnCallback(() => {})
                .willReturn('test');
        }).toThrow('willReturn: There is already a return callback');
    });
});
