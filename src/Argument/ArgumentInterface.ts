interface ArgumentInterface {
    assert(argument: unknown): void;
}

export const isArgument = (argument: unknown): argument is ArgumentInterface => {
    return typeof argument === 'object' && null !== argument && argument.hasOwnProperty('ArgumentInterface');
};

export default ArgumentInterface;
