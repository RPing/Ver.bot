const github = require('./github')
const pypi = require('./pypi')
const npm = require('./npm')

const platformClass = [
    { name: 'GitHub', class: github },
    { name: 'PyPI', class: pypi },
    { name: 'npm', class: npm },
]

module.exports = function cls(platform) {
    return platformClass.find(el => platform === el.name).class
}
