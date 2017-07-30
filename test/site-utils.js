const site = require('../lib/site-utils')
const assert = require('assert')

describe('site-utils', function () {
    describe('ping site', function () {
        this.slow(3000)
        it('ping correct url', function (done) {
            site.pingSitePromise('https://github.com/torvalds/linux', 'GitHub')
            .then((isOk) => {
                done()
            })
            .catch((reason) => {
                done(reason)
            })
        })
        this.slow(3000)
        it('wrong url', function (done) {
            site.pingSitePromise('https://github.com/torvalds/linu', 'GitHub')
            .then((isOk) => {
                done(new Error('Omitted \'x\' in the end! This shouldn\'t be 200 OK.'))
            })
            .catch((reason) => {
                done()
            })
        })
    })

    describe('match site-specific url', function () {
        const tests = [{
            site: 'GitHub',
            correct: 'https://github.com/torvalds/linux',
            http_prefix: 'http://github.com/torvalds/linux',
            no_prefix: 'github.com/torvalds/linux',
            typo: 'https://githuv.com/torvalds/linux',
        }, {
            site: 'PyPI',
            correct: 'https://pypi.python.org/pypi/Django',
            http_prefix: 'http://pypi.python.org/pypi/Django',
            no_prefix: 'pypi.python.org/pypi/Django',
            typo: 'pypi.python.org//pypi/Django',
        }, {
            site: 'npm',
            correct: 'https://www.npmjs.com/package/express',
            http_prefix: 'http://www.npmjs.com/package/express',
            no_prefix: 'www.npmjs.com/package/express',
            typo: 'https://www.npmj.com/package/express',
        }]

        tests.forEach(function (test) {
            describe(test.site, function () {
                it('match pattern', function () {
                    const isMatch = site.isMatchUrlPattern(test.correct, test.site)
                    assert.equal(isMatch, true)
                })
                it('http prefix will transform to https prefix', function () {
                    const isMatch = site.isMatchUrlPattern(test.http_prefix, test.site)
                    assert.equal(isMatch, true)
                })
                it('no protocal prefix is OK', function () {
                    const isMatch = site.isMatchUrlPattern(test.no_prefix, test.site)
                    assert.equal(isMatch, true)
                })
                it('unmatch pattern', function () {
                    const isMatch = site.isMatchUrlPattern(test.typo, test.site)
                    assert.equal(isMatch, false)
                })
            })
        })
    })
})
