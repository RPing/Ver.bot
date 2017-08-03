const GenericSite = require('./generic')

class Pypi extends GenericSite {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/|http:\/\/)?pypi\.python\.org\/pypi\/[A-Za-z0-9_.-]+\/?$/
    }
}
module.exports = Pypi
