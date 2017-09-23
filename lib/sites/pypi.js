class Pypi {
    constructor() {
        this._projectUrlRegex =
            /^(?:https:\/\/|http:\/\/)?pypi\.python\.org\/pypi\/[A-Za-z0-9_.-]+\/?$/
    }

    isMatchUrlPattern(url) {
        return this._projectUrlRegex.test(url)
    }
}
module.exports = Pypi
