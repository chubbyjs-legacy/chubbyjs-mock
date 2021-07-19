import ArgumentInterface from './ArgumentInterface';

class ArgumentCallback implements ArgumentInterface {
    ArgumentInterface = true;

    constructor(private callback: Function) {}

    public assert(argument: unknown): void {
        this.callback(argument);
    }
}

export default ArgumentCallback;
