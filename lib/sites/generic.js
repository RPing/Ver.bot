const request = require('request')
const PingError = require('../error').PingError

class GenericSite {
    static _isMatchUrlPattern(url) {
        return this._projectUrlRegex.test(url)
    }
    static _pingSitePromise(url) {
        let fullURL
        /* transform to safer https prefix */
        if (url.startsWith('https://')) {
            fullURL = url
        } else if (url.startsWith('http://')) {
            fullURL = url.replace(/^http:\/\//i, 'https://')
        } else {
            fullURL = 'https://' + url
        }

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

module.exports = GenericSite
