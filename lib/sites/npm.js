const Generic = require('./generic')

class Npm extends Generic {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/)?www\.npmjs\.com\/package\/[A-Za-z0-9_.-]+\/?$/
    }
}
module.exports = Npm
