const GenericSite = require('./generic')

class Npm extends GenericSite {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/|http:\/\/)?www\.npmjs\.com\/package\/[A-Za-z0-9_.-]+\/?$/
    }
}
module.exports = Npm
