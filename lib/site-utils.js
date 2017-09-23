/* eslint-disable global-require */
const request = require('request')

const PingError = require('./error').PingError

const siteClass = {
    GitHub: require('./sites/github'),
    PyPI: require('./sites/pypi'),
    npm: require('./sites/npm'),
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

/* Remember to take a look at sites/ directory to know what api you can use. */
function platformUtil(platform) {
    return new siteClass[platform]()
}

function isProjectName(text) {
    const re = /^[A-Za-z0-9_.-]+$/
    return re.test(text)
}

function getPlatformByUrl(url) {
    let platform = null
    Object.keys(siteClass).forEach((plat) => {
        if (platformUtil(plat).isMatchUrlPattern(url)) {
            platform = plat
        }
    })

    return platform
}

module.exports = {
    platformUtil,
    isProjectName,
    pingSitePromise,
    getPlatformByUrl,
}
