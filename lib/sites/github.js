const GenericSite = require('./generic')

class Github extends GenericSite {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/|http:\/\/)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/
    }
}
module.exports = Github
