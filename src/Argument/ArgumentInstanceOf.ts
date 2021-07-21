import AbstractArgument from './AbstractArgument';

class ArgumentInstanceOf extends AbstractArgument {
    constructor(private type: string | Function) {
        super();
    }

    public assert(argument: any): void {
        if (typeof this.type === 'function') {
            // function
            if (typeof argument === 'function') {
                if (argument.name !== this.type.name) {
                    throw new Error(`Expected type ${this.type.name}, given type ${argument.name}`);
                }
            }
            // class based object
            else {
                if (!(argument instanceof this.type)) {
                    throw new Error(`Expected type ${this.type.name}, given type ${argument.constructor.name}`);
                }
            }
        } else {
            if (typeof argument !== this.type) {
                throw new Error(`Expected type ${this.type}, given type ${typeof argument}`);
            }
        }
    }
}

export default ArgumentInstanceOf;
