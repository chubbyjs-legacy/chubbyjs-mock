class Call {
    private method: string;
    private hasWithValue: boolean = false;
    private withValue: IArguments|undefined;
    private error: Error|undefined;
    private hasReturnSelfValue: boolean = false;
    private hasReturnValue: boolean = false;
    private hasReturnCallbackValue: boolean = false;
    private returnValue: any;
    private returnCallbackValue: Function|undefined;

    private constructor(method: string) {
        this.method = method;
    }

    public static create(method: string): Call {
        return new Call(method);
    }

    public with(...withValue: any): Call {
        this.hasWithValue = true;
        this.withValue = withValue;

        return this;
    }

    public willThrowError(error: Error): Call {
        if (this.hasReturnSelfValue) {
            throw new Error('willThrowError: There is already a return self');
        }

        if (this.hasReturnValue) {
            throw new Error('willThrowError: There is already a return');
        }

        if (this.hasReturnCallbackValue) {
            throw new Error('willThrowError: There is already a return callback');
        }

        this.error = error;

        return this;
    }

    public willReturnSelf(): Call {
        if (this.error) {
            throw new Error('willReturnSelf: There is already a error');
        }

        if (this.hasReturnValue) {
            throw new Error('willReturnSelf: There is already a return');
        }

        if (this.hasReturnCallbackValue) {
            throw new Error('willReturnSelf: There is already a return callback');
        }

        this.hasReturnSelfValue = true;

        return this;
    }

    public willReturn(returnValue: any): Call {
        if (this.error) {
            throw new Error('willReturn: There is already a error');
        }

        if (this.hasReturnSelfValue) {
            throw new Error('willReturn: There is already a return self');
        }

        if (this.hasReturnCallbackValue) {
            throw new Error('willReturn: There is already a return callback');
        }

        this.hasReturnValue = true;
        this.returnValue = returnValue;

        return this;
    }

    public willReturnCallback(returnCallback: Function): Call {
        if (this.error) {
            throw new Error('willReturnCallback: There is already a error');
        }

        if (this.hasReturnSelfValue) {
            throw new Error('willReturnCallback: There is already a return self');
        }

        if (this.hasReturnValue) {
            throw new Error('willReturnCallback: There is already a return');
        }

        this.hasReturnCallbackValue = true;
        this.returnCallbackValue = returnCallback;

        return this;
    }

    public getMethod(): string {
        return this.method;
    }

    public hasWith(): boolean {
        return this.hasWithValue;
    }

    public hasReturnSelf(): boolean {
        return this.hasReturnSelfValue;
    }

    public hasReturn(): boolean {
        return this.hasReturnValue;
    }

    public hasReturnCallback(): boolean {
        return this.hasReturnCallbackValue;
    }

    public getWith(): IArguments|undefined {
        return this.withValue;
    }

    public getError(): Error|undefined {
        return this.error;
    }

    public getReturn(): any {
        return this.returnValue;
    }

    public getReturnCallback(): Function|undefined {
        return this.returnCallbackValue;
    }
}

export default Call;
