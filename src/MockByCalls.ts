import AbstractArgument from './Argument/AbstractArgument';
import Call from './Call';

class MockByCalls {
    public create<T extends Object>(classDefinition: any, calls: Array<Call>): T {
        const className = classDefinition.name;

        let callIndex = 0;

        const mock = {
            ...Object.fromEntries(
                this.getMethods(new classDefinition()).map((method: string) => {
                    return [
                        method,
                        (...args: Array<unknown>): unknown => {
                            return mock.__mockByCalls(method, args);
                        },
                    ];
                }),
            ),
            ...{
                __mockByCalls: (givenMethod: string, givenArgs: Array<unknown>) => {
                    const call = calls[callIndex];

                    if (!call) {
                        throw new Error(`Missing call: ${JSON.stringify({ class: className, callIndex })}`);
                    }

                    this.matchMethod(call.getMethod(), givenMethod, className, callIndex);

                    if (call.hasWith()) {
                        const expectedArgs = call.getWith() as Array<unknown>;

                        this.matchArguments(expectedArgs, givenArgs, className, callIndex, givenMethod);
                    }

                    callIndex++;

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
            },
        };

        return (mock as unknown) as T;
    }

    private getMethods(givenObject: any): Array<string> {
        const props: Array<string> = [];

        let object = givenObject;
        do {
            props.push(...Object.getOwnPropertyNames(object));
        } while ((object = Object.getPrototypeOf(object)));

        return props.filter((prop) => typeof givenObject[prop] == 'function');
    }

    private matchMethod(expectedMethod: string, givenMethod: string, className: string, callIndex: number): void {
        if (givenMethod !== expectedMethod) {
            throw new Error(
                `Method mismatch: ${JSON.stringify({
                    class: className,
                    callIndex,
                    expectedMethod,
                    givenMethod,
                })}`,
            );
        }
    }

    private matchArguments(
        expectedArgs: Array<unknown>,
        givenArgs: Array<unknown>,
        className: string,
        callIndex: number,
        method: string,
    ): void {
        if (givenArgs.length !== expectedArgs.length) {
            throw new Error(
                `Arguments count mismatch: ${JSON.stringify({
                    class: className,
                    callIndex,
                    method,
                    expectedArgsLength: expectedArgs.length,
                    givenArgsLength: givenArgs.length,
                })}`,
            );
        }

        expectedArgs.forEach((expectedArg: unknown, argIndex) => {
            const givenArg = givenArgs[argIndex];

            if (expectedArg instanceof AbstractArgument) {
                expectedArg.assert(givenArg);

                return;
            }

            if (givenArg !== expectedArg) {
                throw new Error(
                    `Argument mismatch: ${JSON.stringify({
                        class: className,
                        callIndex,
                        method,
                        argIndex,
                        expectedArg,
                        givenArg,
                    })}`,
                );
            }
        });
    }
}

export default MockByCalls;
