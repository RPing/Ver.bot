const telegramTemplate = require('claudia-bot-builder').telegramTemplate

function commandList() {
    return `Here are available commands:\n` +
           `/ask can ask Vbot whether a project has any new version since a picked date\n` +
           `/notify can choose the project that Vbot can automatically inform you when they release new version\n` +
           `/help to show command list\n` +
           `/about can tell you some information about Vbot`
}

function flow(message, originalApiRequest) {
    if (message.text === '/start' || message.text === '/start start') {
        return commandList()
    }
    if (message.text === '/help') {
        return commandList()
    }
    if (message.text === '/about') {
        // TODO
    }
    if (message.text === '/ask') {
        // TODO
    }
    if (message.text === '/notify') {
        // TODO
    }

    return [
        `sorry, I don't understand what you mean.`,
        commandList()
    ]
}

module.exports = flow
