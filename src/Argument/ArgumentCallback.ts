import ArgumentInterface from "./ArgumentInterface";

class ArgumentCallback implements ArgumentInterface {
    constructor(private callback: Function) { }

    public assert(argument: unknown): void {
        this.callback(argument);
    }
}

export default ArgumentCallback;
