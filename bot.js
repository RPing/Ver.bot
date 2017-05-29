const botBuilder = require('claudia-bot-builder')
const telegramFlow = require('./flow/telegram')

const options = {
    platforms: [
        'telegram'
    ]
}

module.exports = botBuilder((message, originalApiRequest) => {
    console.log(JSON.stringify(message))
    console.log(JSON.stringify(originalApiRequest))

    if (message.type === 'telegram') {
        return telegramFlow(message, originalApiRequest)
    }
}, options)
