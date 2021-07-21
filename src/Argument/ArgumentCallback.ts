import AbstractArgument from './AbstractArgument';

class ArgumentCallback extends AbstractArgument {
    constructor(private callback: Function) {
        super();
    }

    public assert(argument: unknown): void {
        this.callback(argument);
    }
}

export default ArgumentCallback;
