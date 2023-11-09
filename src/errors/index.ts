import MalformedTokenError from "./MalformedTokenError.ts";


class AccessDeniedError extends Error {
    constructor(...params: [any]
) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Error);
        }

        this.name = "AccessDeniedError"
    }
}


export {
    AccessDeniedError,
    MalformedTokenError
}