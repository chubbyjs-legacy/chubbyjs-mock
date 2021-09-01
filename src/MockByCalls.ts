import AbstractArgument from './Argument/AbstractArgument';
import Call from './Call';

type Mock = {
    __mockByCalls: {
        calls: Array<Call>;
        index: number;
    };
};

export const mockByCallsUsed = (mock: Mock) => mock.__mockByCalls.calls.length === mock.__mockByCalls.index;

class MockByCalls {
    public create<T extends Object>(classDefinition: any, calls: Array<Call> = []): T & Mock {
        const mock = {
            ...Object.fromEntries(
                this.getMethods(new classDefinition()).map((method: string) => {
                    return [
                        method,
                        (...args: Array<unknown>): unknown => {
                            return mock.__mockByCalls.mock(method, args);
                        },
                    ];
                }),
            ),
            ...{
                __mockByCalls: {
                    calls,
                    index: 0,
                    mock: (actualMethod: string, actualArgs: Array<unknown>): unknown => {
                        const call = mock.__mockByCalls.calls[mock.__mockByCalls.index];

                        if (!call) {
                            throw new Error(
                                `Missing call: ${JSON.stringify({
                                    class: classDefinition.name,
                                    callIndex: mock.__mockByCalls.index,
                                    actualMethod,
                                })}`,
                            );
                        }

                        this.matchMethod(
                            call.getMethod(),
                            actualMethod,
                            classDefinition.name,
                            mock.__mockByCalls.index,
                        );

                        if (call.hasWith()) {
                            const expectedArgs = call.getWith() as Array<unknown>;

                            this.matchArguments(
                                expectedArgs,
                                actualArgs,
                                classDefinition.name,
                                mock.__mockByCalls.index,
                                actualMethod,
                            );
                        }

                        mock.__mockByCalls.index++;

                        const error = call.getError();

                        if (error) {
                            throw error;
                        }

                        if (call.hasReturnSelf()) {
                            return mock;
                        }

                        if (call.hasReturn()) {
                            return call.getReturn();
                        }

                        const returnCallback = call.getReturnCallback();

                        if (returnCallback) {
                            return returnCallback(actualArgs);
                        }
                    },
                },
            },
        };

        // @ts-ignore
        return mock;
    }

    private getMethods(actualObject: any): Array<string> {
        const props: Array<string> = [];

        let object = actualObject;
        do {
            props.push(...Object.getOwnPropertyNames(object));
        } while ((object = Object.getPrototypeOf(object)));

        return props.filter((prop) => typeof actualObject[prop] == 'function');
    }

    private matchMethod(expectedMethod: string, actualMethod: string, className: string, callIndex: number): void {
        if (actualMethod !== expectedMethod) {
            throw new Error(
                `Method mismatch: ${JSON.stringify({
                    class: className,
                    callIndex,
                    actualMethod,
                    expectedMethod,
                })}`,
            );
        }
    }

    private matchArguments(
        expectedArgs: Array<unknown>,
        actualArgs: Array<unknown>,
        className: string,
        callIndex: number,
        actualMethod: string,
    ): void {
        if (actualArgs.length !== expectedArgs.length) {
            throw new Error(
                `Arguments count mismatch: ${JSON.stringify({
                    class: className,
                    callIndex,
                    actualMethod,
                    actualArgsLength: actualArgs.length,
                    expectedArgsLength: expectedArgs.length,
                })}`,
            );
        }

        expectedArgs.forEach((expectedArg: unknown, argIndex) => {
            const actualArg = actualArgs[argIndex];

            if (expectedArg instanceof AbstractArgument) {
                expectedArg.assert(actualArg);

                return;
            }

            if (actualArg !== expectedArg) {
                throw new Error(
                    `Argument mismatch: ${JSON.stringify({
                        class: className,
                        callIndex,
                        actualMethod,
                        argIndex,
                        actualArg,
                        expectedArg,
                    })}`,
                );
            }
        });
    }
}

export default MockByCalls;
