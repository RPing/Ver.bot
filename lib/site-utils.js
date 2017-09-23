const request = require('request')

const PingError = require('./error').PingError
const github = require('./sites/github')
const pypi = require('./sites/pypi')
const npm = require('./sites/npm')

const siteClass = {
    GitHub: github,
    PyPI: pypi,
    npm,
}

function pingSitePromise(url) {
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

function isMatchUrlPattern(url, platform) {
    return siteClass[platform]._isMatchUrlPattern(url)
}

function isProjectName(text) {
    const re = /^[A-Za-z0-9_.-]+$/
    return re.test(text)
}

function getPlatformByUrl(url) {
    let platform = null
    Object.keys(siteClass).forEach((plat) => {
        if (isMatchUrlPattern(url, plat)) {
            platform = plat
        }
    })

    return platform
}

module.exports = {
    isMatchUrlPattern,
    isProjectName,
    pingSitePromise,
    getPlatformByUrl,
}
