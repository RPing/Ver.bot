# Ver.bot

<div align="center">
        <img src="https://rping.github.io/Ver.bot-site/img/vbot.png" width="160">
</div>
<br />

<div align="center">

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SVRBTQKRQ5VGE)

</div>

Ver.bot webhook part.

Notify part in [here](https://github.com/RPing/Ver.bot-notify)

## Deploy by yourself
1. install dependency
```bash
npm i
```

2. before deploy to AWS, [install AWS CLI][1] and [configure it][2].

3. create AWS dynamoDB tables.
```bash
aws dynamodb create-table --cli-input-json file://aws/dynamodb/project.json
aws dynamodb create-table --cli-input-json file://aws/dynamodb/project_detail.json
```

4. create, update or destroy it.
```bash
npm run create
npm run update
npm run destroy
```

You can use tools like [ntl][3] to avoid typing.
Now, AWS API gateway and AWS Lambda are all set!

Default deploy region is `us-east-1`. For more tweaking information in `package.json`, refer to [Claudia docs][4].

## LICENSE
[AGPL-3.0](LICENSE)

[1]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
[2]:  http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
[3]: https://github.com/ruyadorno/ntl
[4]: https://github.com/claudiajs/claudia/tree/master/docs
