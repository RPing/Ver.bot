const github = require('./sites/github')
const pypi = require('./sites/pypi')
const npm = require('./sites/npm')

const siteClass = {
    GitHub: github,
    PyPI: pypi,
    npm,
}

/* interface */
exports.isMatchUrlPattern = function (url, platform) {
    return siteClass[platform]._isMatchUrlPattern(url)
}

exports.pingSitePromise = function (url, platform) {
    return siteClass[platform]._pingSitePromise(url)
}
