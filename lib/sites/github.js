class Github {
    constructor() {
        this._projectUrlRegex =
            /^(?:https:\/\/|http:\/\/)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/
    }

    isMatchUrlPattern(url) {
        return this._projectUrlRegex.test(url)
    }
}

module.exports = Github
