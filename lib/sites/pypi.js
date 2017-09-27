let _singleton

class Pypi {
    constructor() {
        if (_singleton) {
            return _singleton
        }

        this._projectUrlRegex =
            /^(?:https:\/\/|http:\/\/)?pypi\.python\.org\/pypi\/([A-Za-z0-9_.-]+)\/?$/

        this._regexExec = function (url) {
            this._URLRegexExec = this._projectUrlRegex.exec(url)
            return this._URLRegexExec
        }
        _singleton = this
    }

    isMatchUrlPattern(url) {
        if (url.length > 200) {
            return false
        }

        return !!this._regexExec(url)
    }

    getProjectInfo() {
        return {
            project_name: this._URLRegexExec[1]
        }
    }
}
module.exports = Pypi
