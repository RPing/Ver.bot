const msg = require('./message')
const skypeTemplate = require('claudia-bot-builder').skypeTemplate

function flow(message, originalApiRequest) {
    const text = message.text

    if (text === 'help') {
        return new skypeTemplate.Text(msg.SKYPE_COMMAND_LIST, 'markdown').get()
    }
    if (text === 'about') {
        // TODO
    }

    return msg.UNKNOWN_MESSAGE
}

module.exports = flow
