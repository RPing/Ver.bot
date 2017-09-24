class Npm {
    constructor() {
        this._projectUrlRegex =
            /^(?:https:\/\/|http:\/\/)?www\.npmjs\.com\/package\/[A-Za-z0-9_.-]+\/?$/
    }

    isMatchUrlPattern(url) {
        if (url.length > 200) {
            return false
        }
        return this._projectUrlRegex.test(url)
    }
}
module.exports = Npm
