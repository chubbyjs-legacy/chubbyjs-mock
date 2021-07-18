interface ArgumentInterface {
    assert(argument: unknown): void;
}

export const isArgument = (argument: unknown): argument is ArgumentInterface => {
    // @ts-expect-error TS2551
    return argument.hasOwnProperty('assert') && typeof argument.assert === 'function';
};

export default ArgumentInterface;
