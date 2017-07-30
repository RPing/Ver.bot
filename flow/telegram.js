/* eslint-disable comma-dangle */
const telegramTemplate = require('claudia-bot-builder').telegramTemplate
const site = require('../lib/site-utils')
const db = require('../lib/db')
const msg = require('./message')
const error = require('../lib/error')

const supportedPlatform = msg.supportedPlatform

function flow(message, originalApiRequest) {
    const text = message.text
    const origMsg = message.originalRequest.message
    /* refer to Telegram doc:
       callback_query is for inline-keyboard, reply_to_message is for force-reply */
    const isReply = message.originalRequest.hasOwnProperty('callback_query')
                || origMsg.hasOwnProperty('reply_to_message')

    const isCommand = !isReply
                  && origMsg.hasOwnProperty('entities')
                  && origMsg.entities[0].type === 'bot_command'

    /* when Vbot is in a group, any member join/remove message should be ignored. */
    if (text === '') {
        return ''
    }

    if (text === '/start') {
        return msg.COMMAND_LIST
    }
    if (isCommand && text.startsWith('/help')) {
        return msg.COMMAND_LIST
    }
    if (isCommand && text.startsWith('/about')) {
        // TODO
    }
    if (isCommand && text.startsWith('/subscribe')) {
        return new telegramTemplate.Text(msg.ASK_PLATFORM)
            .addInlineKeyboard([
                supportedPlatform.map(platform => ({
                    text: platform.name,
                    callback_data: platform.name
                }))
            ]).get()
    }

    if (isReply) {
        let lastAsk,
            callback_query_id

        if (message.originalRequest.hasOwnProperty('callback_query')) {
            lastAsk = message.originalRequest.callback_query.message.text
            callback_query_id = message.originalRequest.callback_query.id
        } else if (origMsg.hasOwnProperty('reply_to_message')) {
            lastAsk = origMsg.reply_to_message.text
        }
        const question = lastAsk.split('\ne.g. ')[0]

        switch (question) {
            case msg.ASK_PLATFORM: {
                // send to notify Telegram server that inline-keyboard is done.
                const callbackQuery = {
                    method: 'answerCallbackQuery',
                    body: {
                        callback_query_id
                    }
                }
                const sendMsg = text => ({
                    text,
                    disable_web_page_preview: true,
                    reply_markup: {
                        force_reply: true
                    }
                })
                const askURL = platform => [
                    callbackQuery,
                    // eslint-disable-next-line prefer-template
                    sendMsg(msg.ASK_URL + '\ne.g. ' + platform.exampleUrl)
                ]

                return askURL(supportedPlatform.find(el => text === el.name))
            }
            case msg.ASK_URL: {
                // Telegram provided basic check
                if (!origMsg.hasOwnProperty('entities') || origMsg.entities[0].type !== 'url') {
                    return [
                        msg.URL_NOTFOUND,
                        msg.COMMAND_LIST
                    ]
                }
                const url = text.substr(origMsg.entities[0].offset, origMsg.entities[0].length)
                const projectName = /(?:.+)\/(.*?)(?:\/|$)/.exec(url)[1]
                /* I don't want to store tmp state to dynamoDB,
                   so ... just check platform by example url */
                const exampleUrl = lastAsk.split('\ne.g. ')[1]
                const platform = supportedPlatform.find(el => exampleUrl === el.exampleUrl).name

                if (!site.isMatchUrlPattern(url, platform)) {
                    return [
                        msg.URL_NOTCORRECT,
                        msg.COMMAND_LIST
                    ]
                }

                return site.pingSitePromise(url, platform)
                    .then(() => db.storeProjectPromise(projectName, message.sender, 'telegram', platform))
                    .then(() => msg.REGISTER_FINISHED)
                    .catch((err) => {
                        console.error(err)

                        const errorMsgKey = error.getErrorType(err)
                        return [
                            msg[errorMsgKey] || msg.UNKNOWN_ERROR,
                            msg.COMMAND_LIST
                        ]
                    })
            }
            default:
                return ''
        }
    }

    return [
        msg.UNKNOWN_MESSAGE,
        msg.COMMAND_LIST
    ]
}

module.exports = flow

