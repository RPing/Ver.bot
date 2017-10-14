const request = require('request')
const PingError = require('../error').PingError

class Generic {
    static get _protocolPrefix() {
        return 'https://'
    }

    static _isMatchUrlPattern(url) {
        return this._projectUrlRegex.test(url)
    }
    static _pingSitePromise(url) {
        const fullURL = url.startsWith(this._protocolPrefix) ? url : this._protocolPrefix + url

        const option = {
            url: fullURL,
            method: 'HEAD',
            timeout: 3000,
        }
        return new Promise((resolve, reject) => {
            request(option, (error, response) => {
                if (error) {
                    console.error(error)
                    reject(new PingError())
                }

                if (typeof response === 'undefined') {
                    reject(new PingError(`Timeout Error. response object is ${response}`))
                } else if (response.statusCode === 200) {
                    resolve()
                } else {
                    reject(new PingError(`response code is ${response.statusCode}`))
                }
            })
        })
    }
}

module.exports = Generic
