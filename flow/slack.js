const msg = require('./message')

function flow(message, originalApiRequest) {
    const command = message.originalRequest.command

    if (command === '/helpv') {
        return msg.SLACK_COMMAND_LIST
    }
    if (command === '/about') {
        // TODO
    }

    return msg.UNKNOWN_MESSAGE
}

module.exports = flow
