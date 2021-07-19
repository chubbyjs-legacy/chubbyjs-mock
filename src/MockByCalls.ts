import { expect } from '@jest/globals';
import { isArgument } from './Argument/ArgumentInterface';
import Call from './Call';

const getMethods = (givenObject: any) => {
    const props: Array<string> = [];
    let object = givenObject;
    do {
        props.push(...Object.getOwnPropertyNames(object));
    } while ((object = Object.getPrototypeOf(object)));

    return props.filter((prop) => typeof givenObject[prop] == 'function');
};

const defaultMethods = getMethods(new Object());

const MockByCalls = <T extends Object>(classDefinition: any, calls: Array<Call>): T => {
    let callIndex = 0;

    const mock = {
        __mockedMethod: (givenMethod: string, givenArgs: Array<unknown>) => {
            callIndex++;

            const prefix = `Mock "${classDefinition.name}":`;
            const suffix = `at call ${callIndex}`;

            const call = calls[callIndex - 1];

            if (!call) {
                throw new Error(`${prefix} Missing defintion ${suffix}`);
            }

            const expectedMethod = call.getMethod();

            if (givenMethod !== expectedMethod) {
                throw new Error(`${prefix} Expected method "${expectedMethod}", given "${givenMethod}" ${suffix}`);
            }

            if (call.hasWith()) {
                const expectedArgs = call.getWith() as Array<unknown>;

                if (givenArgs.length !== expectedArgs.length) {
                    throw new Error(
                        `${prefix} Expected argument count ${expectedArgs.length}, given ${givenArgs.length} ${suffix}`,
                    );
                }

                expectedArgs.forEach((expectedArg: unknown, i) => {
                    const arg = givenArgs[i];

                    if (isArgument(expectedArg)) {
                        expectedArg.assert(arg);

                        return;
                    }

                    expect(arg).toBe(expectedArg);
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

                return callback(givenArgs);
            }
        },
    };

    const methods = getMethods(new classDefinition()).filter((method) => !defaultMethods.includes(method));

    methods.forEach((method: string) => {
        // @ts-expect-error TS7053
        if (mock[method] == undefined) {
            // @ts-expect-error TS7053
            mock[method] = (...args: Array<unknown>): unknown => {
                return mock.__mockedMethod(method, args);
            };
        }
    });

    return (mock as unknown) as T;
};

export default MockByCalls;
