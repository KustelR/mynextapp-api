export default class MalformedTokenError extends Error {
    constructor(...params: any) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MalformedTokenError);
        }

        this.name = "MalformedTokenError"
    }
}