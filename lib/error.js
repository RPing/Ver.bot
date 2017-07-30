const dynamoDBError = [
    /* exception that aws-sdk won't auto-retry. */
    'AccessDeniedException',
    'ConditionalCheckFailedException',
    'IncompleteSignatureException',
    'MissingAuthenticationTokenException',
    'ResourceInUseException',
    'ResourceNotFoundException',
    'ValidationException',
]

exports.getErrorType = function (error) {
    /* return error msg key in flow/message.js */

    if (dynamoDBError.indexOf(error.name) !== -1) {
        return 'DATABASE_ERROR'
    }
    if (error.name === 'PingError') {
        return 'PING_ERROR'
    }

    return null
}

exports.PingError = class PingError extends Error {
    constructor(message) {
        super(message)

        Error.captureStackTrace(this, this.constructor)
        this.name = this.constructor.name
    }
}
