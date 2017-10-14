const skypeTemplate = require('claudia-bot-builder').skypeTemplate
const msg = require('./message')
const db = require('../lib/db')
const site = require('../lib/site-utils')
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

function flow(message, originalApiRequest) {
    const text = message.text

    if (text === 'help') {
        return new skypeTemplate.Text(msg.SKYPE_COMMAND_LIST, 'markdown').get()
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
                        const ask = new skypeTemplate.Carousel(msg.ASK_UNSUBSCRIBE, msg.ASK_UNSUBSCRIBE).addReceipt()
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

    /* Skype will send such a stupid thing when user input a URL ...
     * '<a href="https://github.com/torvalds/linux">https://github.com/torvalds/linux</a>'
     * so I need to sanitize here. */
    let sanitized_text
    if (text.startsWith('<a')) {
        sanitized_text = text.split('>')[1].split('<')[0]
    }

    // user input a url to subscribe
    if (site.isUrl(sanitized_text)) {
        const url = sanitized_text
        const platform = site.getPlatformByUrl(sanitized_text)
        if (!platform) {
            return msg.URL_NOTCORRECT
        }
        const projectName = /(?:.+)\/(.*?)(?:\/|$)/.exec(url)[1]

        return site.pingSitePromise(url, platform)
                .then(() => db.storeProjectPromise(projectName, message.sender, 'skype', platform))
                .then(() => msg.REGISTER_FINISHED)
                .catch(err => promiseErrorHandler(err))
    }

    if (site.isProjectName(text)) {
        return db.deleteSubscriptionPromise(text, message.sender, 'skype')
                .then(() => msg.UNSUBSCRIBE_FINISHED)
                .catch(err => promiseErrorHandler(err))
    }

    return msg.UNKNOWN_MESSAGE
}

module.exports = flow
