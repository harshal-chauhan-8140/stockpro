export class HttpError extends Error {
    public readonly statusCode: number;
    public readonly message: string;
    public readonly context?: any;
    public readonly logging: boolean;

    constructor(
        statusCode: number,
        message: string,
        logging?: boolean,
        context?: any
    ) {
        super(message);
        Object.setPrototypeOf(this, HttpError.prototype);

        this.statusCode = statusCode;
        this.message = message;
        this.context = context ?? undefined;
        this.logging = logging ?? false;
    }
}
