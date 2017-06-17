const Generic = require('./generic')

class Github extends Generic {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/
    }

}
module.exports = Github
