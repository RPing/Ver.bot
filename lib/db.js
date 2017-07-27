/* eslint-disable comma-dangle, prefer-arrow-callback, import/no-extraneous-dependencies */
const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

const projectPlatformConstant = {
    GitHub: 1,
    PyPI: 2,
    npm: 3,
}
const subscriberPlatformConstant = {
    telegram: 1,
}

exports.storeProjectPromise = function (
    project_name,
    subscriber_id,
    subscriber_platform,
    project_platform
) {
    const putProjectParams = {
        TableName: 'ProjectSubscriber',
        Item: {
            project_name,
            // eslint-disable-next-line prefer-template
            subscriber_and_platform: subscriber_id + '-' + subscriberPlatformConstant[subscriber_platform]
        }
    }
    const putProjectDetailParams = {
        TableName: 'ProjectDetail',
        Item: {
            project_name,
            platform: projectPlatformConstant[project_platform]
        }
    }

    const p1 = dynamoDb.put(putProjectParams).promise()

    const p2 = dynamoDb.put(putProjectDetailParams).promise()

    return Promise.all([p1, p2])
}
