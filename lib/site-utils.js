const github = require('./sites/github')
const pypi = require('./sites/pypi')
const npm = require('./sites/npm')

const siteClass = {
    GitHub: github,
    PyPI: pypi,
    npm,
}

function isMatchUrlPattern(url, platform) {
    return siteClass[platform]._isMatchUrlPattern(url)
}

function isProjectName(text) {
    const re = /^[A-Za-z0-9_.-]+$/
    return re.test(text)
}

function pingSitePromise(url, platform) {
    return siteClass[platform]._pingSitePromise(url)
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

module.exports.isMatchUrlPattern = isMatchUrlPattern
module.exports.isProjectName = isProjectName
module.exports.pingSitePromise = pingSitePromise
module.exports.getPlatformByUrl = getPlatformByUrl
