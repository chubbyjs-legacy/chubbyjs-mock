import ArgumentInterface from "./ArgumentInterface";
import { expect } from '@jest/globals';

class ArgumentInstanceOf implements ArgumentInterface {
    discriminator = 'ArgumentInstanceOf';

    constructor(private func: Function) { }

    public assert(argument: unknown): void {
        expect(argument).toBeInstanceOf(this.func);
    }
}

export default ArgumentInstanceOf;
