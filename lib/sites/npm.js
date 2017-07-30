const Generic = require('./generic')

class Npm extends Generic {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/|http:\/\/)?www\.npmjs\.com\/package\/[A-Za-z0-9_.-]+\/?$/
    }
}
module.exports = Npm
