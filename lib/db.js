/* eslint-disable prefer-arrow-callback, import/no-extraneous-dependencies */
const AWS = require('aws-sdk')

const site = require('./site-utils')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

const projectPlatformConstant = {
    GitHub: 1,
    PyPI: 2,
    npm: 3,
}
const subscriberPlatformConstant = {
    telegram: 1,
    skype: 2,
    slack: 3,
}

exports.storeProjectPromise = function (
    subscriber_id,
    subscriber_platform,
    project_platform
) {
    const projectInfo = site.platformUtil(project_platform).getProjectInfo()

    const putProjectParams = {
        TableName: 'SubscribedProject',
        Item: {
            project_name: projectInfo.project_name,
            subscriber_and_platform: subscriber_id + '-' + subscriberPlatformConstant[subscriber_platform]
        }
    }
    const putProjectDetailParams = {
        TableName: 'ProjectDetail',
        Item: {
            platform: projectPlatformConstant[project_platform]
        }
    }
    Object.assign(putProjectDetailParams.Item, projectInfo)

    const p1 = dynamoDb.put(putProjectParams).promise()
    const p2 = dynamoDb.put(putProjectDetailParams).promise()

    return Promise.all([p1, p2])
}

exports.listSubscriptionPromise = function (subscriber_id, chat_platform) {
    const listParams = {
        TableName: 'SubscribedProject',
        ConsistentRead: true,
        KeyConditionExpression: 'subscriber_and_platform = :x',
        ExpressionAttributeValues: {
            ':x': subscriber_id + '-' + subscriberPlatformConstant[chat_platform]
        },
        ProjectionExpression: 'project_name'
    }

    return dynamoDb.query(listParams).promise()
}

exports.deleteSubscriptionPromise = function (project_name, subscriber_id, chat_platform) {
    const deleteParams = {
        TableName: 'SubscribedProject',
        Key: {
            project_name,
            subscriber_and_platform: subscriber_id + '-' + subscriberPlatformConstant[chat_platform]
        }
    }

    return dynamoDb.delete(deleteParams).promise()
}
