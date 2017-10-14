const telegramTemplate = require('claudia-bot-builder').telegramTemplate
const constant = require('./constants')
const supportedPlatform = constant.supportedPlatform

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
        return constant.COMMAND_LIST
    }
    if (isCommand && text.startsWith('/help')) {
        return constant.COMMAND_LIST
    }
    if (isCommand && text.startsWith('/about')) {
        // TODO
    }
    if (isCommand && text.startsWith('/notify')) {
        return new telegramTemplate.Text(constant.ASK_PLATFORM)
            .addInlineKeyboard([
                supportedPlatform.map((platform) => {
                    return {
                        text: platform.name,
                        callback_data: platform.name
                    }
                })
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
            case constant.ASK_PLATFORM:
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

                for (var i = supportedPlatform.length - 1; i >= 0; i--) {
                    if (answer === supportedPlatform[i].name) {
                        return [
                            callbackQuery,
                            sendMsg(constant.ASK_URL + `\ne.g. ` + supportedPlatform[i].exampleUrl)
                        ]
                    }
                }
            case constant.ASK_URL:
                if (!origMsg.hasOwnProperty('entities') || origMsg.entities[0].type !== 'url') {
                    return [
                        constant.URL_NOTFOUND,
                        constant.COMMAND_LIST
                    ]
                }
                var url = answer.substr(origMsg.entities[0].offset, origMsg.entities[0].length)
                // ping the site
                // save answer in DynamoDB!!
                return constant.REGISTER_FINISHED
            default:
                return ``
        }

    }

    return [
        constant.UNKNOWN_MESSAGE,
        constant.COMMAND_LIST
    ]
}

module.exports = flow

