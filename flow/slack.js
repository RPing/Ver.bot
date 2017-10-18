const msg = require('./message')
const site = require('../lib/site-utils')
const db = require('../lib/db')
const error = require('../lib/error')
const SlackTemplate = require('claudia-bot-builder').slackTemplate

const COMMAND_LIST =
    'Here are available commands:\n' +
    '/subscribe can choose the project that Ver.bot can automatically inform you when they release new version\n' +
    '/unsubscribe to cancel the project you subscribe\n' +
    '/helpv to show command list\n' +
    '/about can tell you some information about Ver.bot'

const projectPlatforms = Object.keys(msg.EXAMPLE_URL)

function promiseErrorHandler(err) {
    console.error(err)

    const errorMsgKey = error.getErrorType(err)
    return msg[errorMsgKey] || msg.UNKNOWN_ERROR
}

function flow(message) {
    const command = message.originalRequest.command
    const text = message.text

    if (command === '/helpv') {
        return new SlackTemplate(COMMAND_LIST)
            .channelMessage(true)
            .get()
    }
    if (command === '/about') {
        // TODO
    }
    if (command === '/subscribe') {
        const ask = new SlackTemplate(msg.ASK_PLATFORM)
            .channelMessage(true)
            .addAttachment('ask_platform')
            .addColor('#000000')

        projectPlatforms.forEach((name) => {
            ask.addAction(name, 'button', name)
        })

        return ask.get()
    }
    if (command === '/unsubscribe') {
        const channelId = message.originalRequest.channel_id

        return db.listSubscriptionPromise(channelId, 'slack')
            .then((data) => {
                if (data.Items.length === 0) {
                    return new SlackTemplate(msg.NO_SUBSCRIBED_PROJECT)
                        .channelMessage(true)
                        .get()
                }

                const ask = new SlackTemplate(msg.ASK_UNSUBSCRIBE)
                                .channelMessage(true)
                                .addAttachment('ask_unsubscribe')
                                .addColor('#ff0000')

                // TODO: claudia-bot-builder Slack select menu support!
                const actions = ask.getLatestAttachment().actions
                actions.push({
                    name: 'project_list',
                    text: 'Choose a project...',
                    type: 'select',
                    options: []
                })
                const options = actions[0].options

                data.Items.forEach((item) => {
                    options.push({
                        text: item.project_name,
                        value: item.project_name
                    })
                })
                return ask.get()
            })
            .catch(err => promiseErrorHandler(err))
    }

    const callback_id = message.originalRequest.callback_id
    if (callback_id === 'ask_platform') {
        const answer = message.originalRequest.actions[0].value
        return msg.ASK_URL + '\ne.g. ' + msg.EXAMPLE_URL[answer]
    }
    if (callback_id === 'ask_unsubscribe') {
        const answer = message.originalRequest.actions[0].selected_options[0].value
        const channelId = message.originalRequest.channel.id
        return db.deleteSubscriptionPromise(answer, channelId, 'slack')
            .then(() => msg.UNSUBSCRIBE_FINISHED)
            .catch(err => promiseErrorHandler(err))
    }

    // subscribe project by url
    // Slack returns <INPUT_URL>
    if (text.startsWith('<')) {
        const url = text.slice(1, -1)
        const platform = site.getPlatformByUrl(url)
        const channelId = message.originalRequest.event.channel
        if (!platform) {
            return msg.URL_NOTCORRECT
        }

        return site.pingSitePromise(url)
            .then(() => db.storeProjectPromise(channelId, 'slack', platform))
            .then(() => msg.REGISTER_FINISHED)
            .catch(err => promiseErrorHandler(err))
    }

    // filter the fucking duplicate event api messages
    if (message.subtype === 'slack-events-api' &&
        (text === '' || text.startsWith('/'))) {
        return ''
    }

    return msg.UNKNOWN_MESSAGE
}

module.exports = flow
