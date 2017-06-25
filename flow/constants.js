const constants = {
    ASK_URL: 'What\'s the project url?',

    ASK_PLATFORM: 'Which platform the project release?',

    COMMAND_LIST:
        'Here are available commands:\n' +
        '/notify can choose the project that Vbot can automatically inform you when they release new version\n' +
        '/help to show command list\n' +
        '/about can tell you some information about Vbot',

    REGISTER_FINISHED: 'OK. I will check this project every several days.',

    URL_NOTFOUND: 'no project url found.',

    URL_NOTCORRECT: 'your project url seems not correct. please refer to example url.',

    PING_ERROR:
        'failed when check the project existence,\n' +
        'it may result from typos in url or some server error.\n' +
        'feel free to report an issue if an error still occurred.',

    UNKNOWN_MESSAGE: 'sorry, I don\'t understand what you mean.',

    supportedPlatform: [
        { name: 'GitHub', exampleUrl: 'https://github.com/torvalds/linux' },
        { name: 'PyPI', exampleUrl: 'https://pypi.python.org/pypi/Django' },
        { name: 'npm', exampleUrl: 'https://www.npmjs.com/package/express' },
    ],
}

module.exports = constants
