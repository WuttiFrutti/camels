class HttpError extends Error {
    constructor(message, httpErrorCode) {
        super(message);
        this.code = httpErrorCode;
    }

    toJson() {
        return ({
            message: this.message,
            errorcode: this.code,
        });
    }
}

module.exports = HttpError;
