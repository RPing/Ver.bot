const telegramTemplate = require('claudia-bot-builder').telegramTemplate

function commandList() {
    return `Here are available commands:\n` +
           `/ask can ask Vbot whether a project has any new version since a picked date\n` +
           `/notify can choose the project that Vbot can automatically inform you when they release new version\n` +
           `/help to show command list\n` +
           `/about can tell you some information about Vbot`
}

function flow(message, originalApiRequest) {
    var text = message.text
    var isCommand = message.originalRequest.message.entities
                  && message.originalRequest.message.entities[0].type === 'bot_command'
    var isGroup = message.originalRequest.message.chat.type === 'group'

    if (isGroup && text === '') {
        return ``
    }

    if (text === '/start') {
        return commandList()
    }
    if (isCommand && text.startsWith('/help')) {
        return commandList()
    }
    if (isCommand && text.startsWith('/about')) {
        // TODO
    }
    if (isCommand && text.startsWith('/ask')) {
        // TODO
    }
    if (isCommand && text.startsWith('/notify')) {
        // TODO
    }

    return [
        `sorry, I don't understand what you mean.`,
        commandList()
    ]
}

module.exports = flow
