const msg = require('./message')
const site = require('../lib/site-utils')
const db = require('../lib/db')
const error = require('../lib/error')
const SlackTemplate = require('claudia-bot-builder').slackTemplate

const projectPlatforms = Object.keys(msg.EXAMPLE_URL)

function promiseErrorHandler(err) {
    console.error(err)

    const errorMsgKey = error.getErrorType(err)
    return [
        msg[errorMsgKey] || msg.UNKNOWN_ERROR,
        msg.COMMAND_LIST
    ]
}

function flow(message, originalApiRequest) {
    const command = message.originalRequest.command
    const text = message.text

    if (command === '/helpv') {
        return msg.SLACK_COMMAND_LIST
    }
    if (command === '/about') {
        // TODO
    }
    if (command === '/subscribe') {
        const ask = new SlackTemplate('Subscribe project!')
            .replaceOriginal(true)
            .addAttachment('ask_platform')

        projectPlatforms.forEach((name) => {
            ask.addAction(name, 'button', name)
        })

        return ask.get()
    }

    const callback_id = message.originalRequest.callback_id
    if (callback_id === 'ask_platform') {
        const answer = message.originalRequest.actions[0].value
        return msg.ASK_PLATFORM + '\ne.g. ' + msg.EXAMPLE_URL[answer]
    }

    if (text.startsWith('<')) {
        const url = text.slice(1, -1)
        const platform = site.getPlatformByUrl(url)
        if (!platform) {
            return msg.URL_NOTCORRECT
        }
        const projectName = /(?:.+)\/(.*?)(?:\/|$)/.exec(url)[1]

        return site.pingSitePromise(url, platform)
            .then(() => db.storeProjectPromise(projectName, message.sender, 'slack', platform))
            .then(() => msg.REGISTER_FINISHED)
            .catch(err => promiseErrorHandler(err))
    }

    return msg.UNKNOWN_MESSAGE
}

module.exports = flow
