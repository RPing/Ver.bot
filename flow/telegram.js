const telegramTemplate = require('claudia-bot-builder').telegramTemplate

const askUrlMsg = `What's the project url?`
const askPlatformMsg = `Which platform the project release?`

const supportedPlatform = [
    { text: 'GitHub', callback_data: 'GitHub' },
    { text: 'PyPI', callback_data: 'PyPI' },
    { text: 'npm', callback_data: 'npm' }
]

const githubExampleUrl = `https://github.com/torvalds/linux`
const pypiExampleUrl = `https://pypi.python.org/pypi/Django`
const npmExampleUrl = `https://www.npmjs.com/package/express`

const commandList =
    `Here are available commands:\n` +
    `/notify can choose the project that Vbot can automatically inform you when they release new version\n` +
    `/help to show command list\n` +
    `/about can tell you some information about Vbot`

function flow(message, originalApiRequest) {
    var text = message.text
    var origMsg = message.originalRequest.message
    /* refer to Telegram doc: callback_query is for inline-keyboard, reply_to_message is for force-reply */
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
        return commandList
    }
    if (isCommand && text.startsWith('/help')) {
        return commandList
    }
    if (isCommand && text.startsWith('/about')) {
        // TODO
    }
    if (isCommand && text.startsWith('/notify')) {
        return new telegramTemplate.Text(askPlatformMsg)
            .addInlineKeyboard([
                supportedPlatform
            ]).get()
    }

    if (isReply) {
        var question, callback_query_id
        if (message.originalRequest.hasOwnProperty('callback_query')) {
            question = message.originalRequest['callback_query'].message.text
            callback_query_id = message.originalRequest['callback_query'].id
        } else if (origMsg.hasOwnProperty('reply_to_message')) {
            question = origMsg['reply_to_message'].text
        }
        question = question.split('\n')[0]
        var answer = message.text

        switch (question) {
            case askPlatformMsg:
                // send to notify Telegram server that inline-keyboard is done.
                const callbackQuery = {
                    method: 'answerCallbackQuery',
                    body: {
                        callback_query_id: callback_query_id
                    }
                }
                const sendMsg = (text) => {
                    return {
                        text: text,
                        disable_web_page_preview: true,
                        reply_markup: {
                            force_reply: true
                        }
                    }
                }

                if (answer === 'GitHub') {
                    return [
                        callbackQuery,
                        sendMsg(askUrlMsg + `\ne.g. ` + githubExampleUrl)
                    ]
                } else if (answer === 'PyPI') {
                    return [
                        callbackQuery,
                        sendMsg(askUrlMsg + `\ne.g. ` + pypiExampleUrl)
                    ]
                } else if (answer === 'npm') {
                    return [
                        callbackQuery,
                        sendMsg(askUrlMsg + `\ne.g. ` + npmExampleUrl)
                    ]
                } else {
                    return [
                        `This platform is not supported by Vbot currently.`,
                        commandList
                    ]
                }
            case askUrlMsg:
                if (!origMsg.hasOwnProperty('entities') || origMsg.entities[0].type !== 'url') {
                    return [
                        `no project url found.`,
                        commandList
                    ]
                }
                var url = answer.substr(origMsg.entities[0].offset, origMsg.entities[0].length)
                // ping the site
                // save answer in DynamoDB!!
                return 'OK. Vbot will check this project every several days.'
            default:
                return ``
        }

    }

    return [
        `sorry, I don't understand what you mean.`,
        commandList
    ]
}

module.exports = flow
