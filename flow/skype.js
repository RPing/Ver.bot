const skypeTemplate = require('claudia-bot-builder').skypeTemplate
const msg = require('./message')
const db = require('../lib/db')
const site = require('../lib/site-utils')
const error = require('../lib/error')

const COMMAND_LIST =
    'Here are available commands:\n\n' +
    '**subscribe** can choose the project that Ver.bot can automatically inform you when they release new version\n\n' +
    '**unsubscribe** to cancel the project you subscribe\n\n' +
    '**help** to show command list\n\n' +
    '**about** can tell you some information about Ver.bot'

const projectPlatforms = Object.keys(msg.EXAMPLE_URL)

function promiseErrorHandler(err) {
    console.error(err)

    const errorMsgKey = error.getErrorType(err)
    return msg[errorMsgKey] || msg.UNKNOWN_ERROR
}

function flow(message) {
    let text = message.text
    const isGroup = message.originalRequest.conversation.isGroup

    if (isGroup) {
        const re = /.Ver\.bot (.*)/
        const a = message.text.match(re)
        text = a[1]
    }

    if (text === 'help') {
        return new skypeTemplate.Text(COMMAND_LIST, 'markdown').get()
    }
    if (text === 'about') {
        // TODO
    }
    if (text === 'subscribe') {
        // TODO: if bot framework add type AdaptiveCard, then I can remove the stupid `addReceipt`
        const ask = new skypeTemplate.Carousel(msg.ASK_PLATFORM, msg.ASK_PLATFORM).addReceipt()
        projectPlatforms.forEach((name) => {
            ask.addButton(name, name, 'imBack')
        })

        return ask.get()
    }
    if (text === 'unsubscribe') {
        return db.listSubscriptionPromise(message.sender, 'skype')
            .then((data) => {
                if (data.Items.length === 0) {
                    return msg.NO_SUBSCRIBED_PROJECT
                }

                const ask = new skypeTemplate.Carousel(
                    msg.ASK_UNSUBSCRIBE,
                    msg.ASK_UNSUBSCRIBE
                ).addReceipt()

                data.Items.forEach((item) => {
                    ask.addButton(item.project_name, item.project_name, 'imBack')
                })

                return ask.get()
            })
            .catch(err => promiseErrorHandler(err))
    }

    // Reply
    // user select a platform from command 'subscribe'
    if (projectPlatforms.indexOf(text) !== -1) {
        return msg.ASK_URL + '\n\ne.g. ' + msg.EXAMPLE_URL[text]
    }

    // user input a url to subscribe
    if (text.startsWith('<a')) {
        /* Skype will send such a stupid thing when user input a URL ...
         * '<a href="https://github.com/torvalds/linux">https://github.com/torvalds/linux</a>'
         * so I need to sanitize here. */
        const url = text.split('>')[1].split('<')[0]
        const platform = site.getPlatformByUrl(url)
        if (!platform) {
            return msg.URL_NOTCORRECT
        }

        return site.pingSitePromise(url)
            .then(() => db.storeProjectPromise(message.sender, 'skype', platform))
            .then(() => msg.REGISTER_FINISHED)
            .catch(err => promiseErrorHandler(err))
    }

    // unsubscribe project
    if (site.isProjectName(text)) {
        return db.deleteSubscriptionPromise(text, message.sender, 'skype')
            .then(() => msg.UNSUBSCRIBE_FINISHED)
            .catch(err => promiseErrorHandler(err))
    }

    return msg.UNKNOWN_MESSAGE
}

module.exports = flow
