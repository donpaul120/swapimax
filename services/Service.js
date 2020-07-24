class Service {
    static rejectResponse(error, code = 500) {
        return {error, code};
    }

    static successResponse(data, total, code = 200) {
        const payload = {payload: {data}, code};
        if (total) payload.payload.total = total;
        return payload;
    }

    static handleClientError(exception, extras) {
        switch (exception.status) {
            case 404:
                return this.rejectResponse("The specified resource was not found", exception.status);
            case 400:
                return this.rejectResponse(extras, exception.status);
            default:
                return exception;
        }
    }
}

module.exports = Service;
