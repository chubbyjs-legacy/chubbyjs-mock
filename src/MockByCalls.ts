import { isArgument } from './Argument/ArgumentInterface';
import Call from './Call';
import { expect } from '@jest/globals';

const MockByCalls = <T>(calls: Array<Call>): T => {
    const mock = {
        __mockedCall: (method: string, args: Array<unknown>) => {
            const call = calls.shift();

            if (!call) {
                fail('Additional call');
            }

            if (method !== call.getMethod()) {
                fail(`Method expected "${call.getMethod()}, "${method}" given.`);
            }

            if (call.hasWith()) {
                const withArgs = call.getWith() as Array<unknown>;

                if (args.length !== withArgs.length) {
                    fail(`Argument count doesn't match, expected ${withArgs.length}, ${args.length} given.`);
                }

                withArgs.forEach((withArg: unknown, i) => {
                    const arg = args[i];

                    if (isArgument(withArg)) {
                        withArg.assert(arg);

                        return;
                    }

                    expect(arg).toBe(withArg);
                });
            }

            const error = call.getError();

            if (error) {
                throw error;
            }

            if (call.hasReturnSelf()) {
                return this;
            }

            if (call.hasReturn()) {
                return call.getReturn();
            }

            if (call.hasReturnCallback()) {
                const callback = call.getReturnCallback() as Function;

                return callback(args);
            }
        },
    };

    calls.forEach((call: Call) => {
        const method = call.getMethod();
        // @ts-expect-error TS7053
        if (mock[method] == undefined) {
            // @ts-expect-error TS7053
            mock[method] = (...args: Array<unknown>): unknown => {
                return mock.__mockedCall(method, args);
            };
        }
    });

    return (mock as unknown) as T;
};

export default MockByCalls;
