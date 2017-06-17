const cls = require('./sites/cls')

/* interface */
exports.isMatchUrlPattern = function (url, platform) {
    return cls(platform)._isMatchUrlPattern(url)
}

exports.pingSitePromise = function (url, platform) {
    return cls(platform)._pingSitePromise(url)
}
