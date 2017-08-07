const msg = {
    ASK_URL: 'What\'s the project url?',

    ASK_PLATFORM: 'Which platform the project release?',

    ASK_UNSUBSCRIBE: 'Which project you want to cancel subscription?',

    COMMAND_LIST:
        'Here are available commands:\n' +
        '/subscribe can choose the project that Vbot can automatically inform you when they release new version\n' +
        '/unsubscribe to cancel the project you subscribe\n' +
        '/help to show command list\n' +
        '/about can tell you some information about Vbot',

    SLACK_COMMAND_LIST:
        'Here are available commands:\n' +
        '/subscribe can choose the project that Vbot can automatically inform you when they release new version\n' +
        '/unsubscribe to cancel the project you subscribe\n' +
        '/helpv to show command list\n' +
        '/about can tell you some information about Vbot',

    REGISTER_FINISHED: 'OK. I will check this project every several days.',

    UNSUBSCRIBE_FINISHED: 'unsubscription complete.',

    URL_NOTFOUND: 'no project url found.',

    URL_NOTCORRECT: 'your project url seems not correct. please refer to example url.',

    PING_ERROR:
        'failed when check the project existence,\n' +
        'it may result from typos in url or some server error.\n' +
        'feel free to report an issue if an error still occurs.',

    DATABASE_ERROR:
        'failed when communicate with database.\n' +
        'please report an issue if an error still occurs.',

    UNKNOWN_ERROR:
        'some unknown error occurred ...\n' +
        'please report an issue if an error still occurs.',

    UNKNOWN_MESSAGE: 'sorry, I don\'t understand what you mean.',

    EXAMPLE_URL: {
        GitHub: 'https://github.com/torvalds/linux',
        PyPI: 'https://pypi.python.org/pypi/Django',
        npm: 'https://www.npmjs.com/package/express',
    },
}

module.exports = msg
