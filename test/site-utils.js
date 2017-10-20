const site = require('../lib/site-utils')
const assert = require('assert')

describe('site-utils', function () {
    const tests = [{
        site: 'GitHub',
        correct: 'https://github.com/torvalds/linux',
        http_prefix: 'http://github.com/torvalds/linux',
        no_prefix: 'github.com/torvalds/linux',
        typo: 'https://githuv.com/torvalds/linux',
        expectedProjectInfo: {
            project_author: 'torvalds',
            project_name: 'linux'
        }
    }, {
        site: 'PyPI',
        correct: 'https://pypi.python.org/pypi/Django',
        http_prefix: 'http://pypi.python.org/pypi/Django',
        no_prefix: 'pypi.python.org/pypi/Django',
        typo: 'pypi.python.org//pypi/Django',
        expectedProjectInfo: {
            project_name: 'Django'
        }
    }, {
        site: 'npm',
        correct: 'https://www.npmjs.com/package/express',
        http_prefix: 'http://www.npmjs.com/package/express',
        no_prefix: 'www.npmjs.com/package/express',
        typo: 'https://www.npmj.com/package/express',
        expectedProjectInfo: {
            project_name: 'express'
        }
    }]

    describe('singleton', function () {
        tests.forEach(function (test) {
            it(test.site, function () {
                const a = site.platformUtil(test.site)
                const b = site.platformUtil(test.site)
                assert.equal(a, b)
            })
        })
    })

    describe('ping site', function () {
        this.slow(3000)
        it('ping correct url', function (done) {
            site.pingSitePromise('https://github.com/torvalds/linux')
            .then((isOk) => {
                done()
            })
            .catch((reason) => {
                done(reason)
            })
        })
        this.slow(3000)
        it('wrong url', function (done) {
            site.pingSitePromise('https://github.com/torvalds/linu')
            .then((isOk) => {
                done(new Error('Omitted \'x\' in the end! This shouldn\'t be 200 OK.'))
            })
            .catch((reason) => {
                done()
            })
        })
    })

    describe('match site-specific url', function () {
        tests.forEach(function (test) {
            describe(test.site, function () {
                describe('correct', function () {
                    const isMatch = site.platformUtil(test.site).isMatchUrlPattern(test.correct)
                    const projectInfo = site.platformUtil(test.site).getProjectInfo(test.exampleURL)

                    it('match pattern', function () {
                        assert.equal(isMatch, true)
                    })
                    it('retrieve url information', function () {
                        assert.deepEqual(projectInfo, test.expectedProjectInfo)
                    })
                })
                it('http prefix will transform to https prefix', function () {
                    const isMatch = site.platformUtil(test.site).isMatchUrlPattern(test.http_prefix)
                    assert.equal(isMatch, true)
                })
                it('no protocal prefix is OK', function () {
                    const isMatch = site.platformUtil(test.site).isMatchUrlPattern(test.no_prefix)
                    assert.equal(isMatch, true)
                })
                it('unmatch pattern', function () {
                    const isMatch = site.platformUtil(test.site).isMatchUrlPattern(test.typo)
                    assert.equal(isMatch, false)
                })
                it('too long length', function () {
                    const longUrl = new Array(202).join('x') // length 201
                    const isMatch = site.platformUtil(test.site).isMatchUrlPattern(longUrl)
                    assert.equal(isMatch, false)
                })
            })
        })
    })

    describe('whether an input string is a valid project name', function () {
        it('valid #1', function () {
            const isMatch = site.isProjectName('django')
            assert.equal(isMatch, true)
        })
        it('valid #2', function () {
            const isMatch = site.isProjectName('claudia-bot-builder')
            assert.equal(isMatch, true)
        })
        it('valid #3', function () {
            const isMatch = site.isProjectName('spee.ch')
            assert.equal(isMatch, true)
        })
        it('invalid pattern', function () {
            const isMatch = site.isProjectName('spee~ch')
            assert.equal(isMatch, false)
        })
        it('invalid length', function () {
            const longName = new Array(102).join('x') // length 101
            const isMatch = site.isProjectName(longName)
            assert.equal(isMatch, false)
        })
    })

    describe('get platform name by url', function () {
        it('get correct platform name', function () {
            const name = site.getPlatformByUrl('https://github.com/torvalds/linux')
            assert.equal(name, 'GitHub')
        })
        it('return null if a valid platform is not found', function () {
            const name = site.getPlatformByUrl('https://www.google.com')
            assert.equal(name, null)
        })
    })
})
