# Ver.bot
Ver.bot webhook part.

## Deploy by yourself
1. install dependency

    npm i

2. before deploy to AWS, [install AWS CLI][1] and [configure it][2].

3. create AWS dynamoDB tables.

    aws dynamodb create-table --cli-input-json file://aws/dynamodb/project.json
    aws dynamodb create-table --cli-input-json file://aws/dynamodb/project_detail.json

4. create, update or destroy it.

    npm run create
    npm run update
    npm run destroy

You can use tools like [ntl][3] to avoid typing.
Now, AWS API gateway and AWS Lambda are all set!

Default deploy region is `us-east-1`. For more tweaking information in `package.json`, refer to [Claudia docs][4].

## LICENSE
[AGPL-3.0](LICENSE)

[1]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
[2]:  http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
[3]: https://github.com/ruyadorno/ntl
[4]: https://github.com/claudiajs/claudia/tree/master/docs
