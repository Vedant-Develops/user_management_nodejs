class apiSuccessResponse {
    constructor(
        data,
        code = 200,
        message = 'success',
        success = true,
        error = false
    ) {
        this.code = code;
        this.message = message;
        this.success = success;
        this.error = error;
        this.data = data;

    }
}

module.exports = apiSuccessResponse;