const request = require('request')

class Generic {
    static get _protocolPrefix() {
        return 'https://'
    }

    static _isMatchUrlPattern(url){
        return this._projectUrlRegex.test(url)
    }
    static _pingSitePromise(url){
        url = url.startsWith(this._protocolPrefix) ? url : this._protocolPrefix + url

        let option = {
            url: url,
            method: 'HEAD',
            timeout: 3000
        }
        return new Promise((resolve, reject) => {
            request(option, (error, response) => {
                if (error) {
                    reject(error)
                }

                if (typeof response === 'undefined') {
                    reject(new Error('Timeout Error. response object is ' + response))
                } else if (response.statusCode === 200) {
                    resolve()
                } else {
                    reject(new Error('response code is ' + response.statusCode))
                }
            })
        })
    }
}

module.exports = Generic
