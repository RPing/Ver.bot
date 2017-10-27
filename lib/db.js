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
            subscriber_id: subscriber_id.toString(),
            subscriber_platform: subscriberPlatformConstant[subscriber_platform]
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

exports.listSubscriptionPromise = function (subscriber_id, subscriber_platform) {
    const listParams = {
        TableName: 'SubscribedProject',
        IndexName: 'BySubscriber',
        ConsistentRead: true,
        KeyConditionExpression: 'subscriber_id = :x AND subscriber_platform = :y',
        ExpressionAttributeValues: {
            ':x': subscriber_id.toString(),
            ':y': subscriberPlatformConstant[subscriber_platform]
        },
        ProjectionExpression: 'project_name'
    }

    return dynamoDb.query(listParams).promise()
}

exports.deleteSubscriptionPromise = function (project_name, subscriber_id, subscriber_platform) {
    const deleteParams = {
        TableName: 'SubscribedProject',
        Key: {
            subscriber_id: subscriber_id.toString(),
            project_name
        },
        ConditionExpression: 'subscriber_platform = :x',
        ExpressionAttributeValues: {
            ':x': subscriberPlatformConstant[subscriber_platform]
        }
    }

    return dynamoDb.delete(deleteParams).promise()
}
