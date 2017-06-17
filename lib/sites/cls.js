const github = require('./github')
const pypi = require('./pypi')
const npm = require('./npm')

const platformClass = [
    {
        name: 'GitHub', class: github
    },
    {
        name: 'PyPI', class: pypi
    },
    {
        name: 'npm', class: npm
    }
]

module.exports = function cls (platform) {
    for (var i = platformClass.length - 1; i >= 0; i--) {
        if (platform === platformClass[i].name) {
            return platformClass[i].class
        }
    }
}
