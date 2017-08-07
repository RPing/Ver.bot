const botBuilder = require('claudia-bot-builder')
const telegramFlow = require('./flow/telegram')
const slackFlow = require('./flow/slack')

const options = {
    platforms: [
        'telegram',
        'slackSlashCommand',
    ],
}

module.exports = botBuilder((message, originalApiRequest) => {
    console.log(JSON.stringify(message))
    console.log(JSON.stringify(originalApiRequest))

    if (message.type === 'telegram') {
        return telegramFlow(message, originalApiRequest)
    }
    if (message.type === 'slack-slash-command') {
        return slackFlow(message, originalApiRequest)
    }

    return 'The messaging platform has not supported yet.'
}, options)
