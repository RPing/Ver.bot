const telegramTemplate = require('claudia-bot-builder').telegramTemplate
const site = require('../lib/site-utils')
const db = require('../lib/db')
const msg = require('./message')
const error = require('../lib/error')

const projectPlatforms = Object.keys(msg.EXAMPLE_URL)

function promiseErrorHandler(err) {
    console.error(err)

    const errorMsgKey = error.getErrorType(err)
    return [
        msg[errorMsgKey] || msg.UNKNOWN_ERROR,
        msg.COMMAND_LIST
    ]
}

function flow(message) {
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
        const rowChoice = []

        projectPlatforms.forEach((name) => {
            rowChoice.push({
                text: name,
                callback_data: name
            })
        })

        return new telegramTemplate.Text(msg.ASK_PLATFORM)
                    .addInlineKeyboard([rowChoice]).get()
    }
    if (isCommand && text.startsWith('/unsubscribe')) {
        return db.listSubscriptionPromise(message.sender, 'telegram')
            .then((data) => {
                if (data.Items.length === 0) {
                    return msg.NO_SUBSCRIBED_PROJECT
                }

                const wholeArray = []
                data.Items.forEach((item) => {
                    wholeArray.push([{
                        text: item.project_name,
                        callback_data: item.project_name
                    }])
                })

                return new telegramTemplate.Text(msg.ASK_UNSUBSCRIBE)
                            .addInlineKeyboard(wholeArray).get()
            })
            .catch(err => promiseErrorHandler(err))
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

        // send to notify Telegram server that inline-keyboard is done.
        const callbackQuery = {
            method: 'answerCallbackQuery',
            body: {
                callback_query_id
            }
        }

        switch (question) {
            case msg.ASK_PLATFORM: {
                // eslint-disable-next-line no-shadow
                const sendMsg = text => ({
                    text,
                    disable_web_page_preview: true,
                    reply_markup: {
                        force_reply: true
                    }
                })
                const askURL = exampleUrl => [
                    callbackQuery,
                    sendMsg(msg.ASK_URL + '\ne.g. ' + exampleUrl)
                ]

                return askURL(msg.EXAMPLE_URL[text])
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
                const platform = site.getPlatformByUrl(url)
                if (!platform) {
                    return [
                        msg.URL_NOTCORRECT,
                        msg.COMMAND_LIST
                    ]
                }

                return site.pingSitePromise(url)
                    .then(() => db.storeProjectPromise(message.sender, 'telegram', platform))
                    .then(() => msg.REGISTER_FINISHED)
                    .catch(err => promiseErrorHandler(err))
            }
            case msg.ASK_UNSUBSCRIBE: {
                return db.deleteSubscriptionPromise(text, message.sender, 'telegram')
                    .then(() => [
                        callbackQuery,
                        msg.UNSUBSCRIBE_FINISHED
                    ])
                    .catch(err => promiseErrorHandler(err))
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

