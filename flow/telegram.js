const telegramTemplate = require('claudia-bot-builder').telegramTemplate

const askNameMsg = `What's the project name?`
const askPlatformMsg = `Which platform the project release?`

function commandList() {
    return `Here are available commands:\n` +
           `/ask can ask Vbot whether a project has any new version since a picked date\n` +
           `/notify can choose the project that Vbot can automatically inform you when they release new version\n` +
           `/help to show command list\n` +
           `/about can tell you some information about Vbot`
}

function flow(message, originalApiRequest) {
    var text = message.text
    var origMsg = message.originalRequest.message
    var isReply = message.originalRequest.hasOwnProperty('callback_query')
                || origMsg.hasOwnProperty('reply_to_message')

    var isCommand = !isReply
                  && origMsg.hasOwnProperty('entities')
                  && origMsg.entities[0].type === 'bot_command'

    /* when Vbot is in a group, any member join/remove message should be ignored. */
    if (text === '') {
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
        return new telegramTemplate.Text(askNameMsg).forceReply().get()
    }

    if (isReply) {
        var question, callback_query_id
        if (message.originalRequest.hasOwnProperty('callback_query')) {
            question = message.originalRequest['callback_query'].message.text
            callback_query_id = message.originalRequest['callback_query'].id
        } else if (origMsg.hasOwnProperty('reply_to_message')) {
            question = origMsg['reply_to_message'].text
        }
        var answer = message.text

        switch (question) {
            case askNameMsg:
                // check answer first.
                // save answer in DynamoDB!!
                return new telegramTemplate.Text(askPlatformMsg)
                    .addInlineKeyboard([
                        [{ text: 'GitHub', callback_data: 'GitHub' },
                          { text: 'PyPI', callback_data: 'PyPI' },
                          { text: 'npm', callback_data: 'npm' }]
                    ]).get()
            case askPlatformMsg:
                // check answer first.
                // read name from DynamoDB, and ping the site
                // save answer in DynamoDB!!
                return {
                    method: 'answerCallbackQuery',
                    body: {
                        callback_query_id: callback_query_id
                    }
                }
            default:
                return ``
        }

    }

    return [
        `sorry, I don't understand what you mean.`,
        commandList()
    ]
}

module.exports = flow
