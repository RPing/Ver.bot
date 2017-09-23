class GenericSite {
    static _isMatchUrlPattern(url) {
        return this._projectUrlRegex.test(url)
    }
}

module.exports = GenericSite
