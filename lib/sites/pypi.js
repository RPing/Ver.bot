const Generic = require('./generic')

class Pypi extends Generic {
    /* constants */
    static get _projectUrlRegex() {
        return /^(?:https:\/\/)?pypi\.python\.org\/pypi\/[A-Za-z0-9_.-]+\/?$/
    }

}
module.exports = Pypi
