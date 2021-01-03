# SmartThings Slackbot Lambda

AWS Lambda for Slackbot that commands devices via SmartThings.

## About 

This is a AWS lambda that provides functionality for Slackbot that allows users to discuss with their Samsung SmartThings based smart home.

Currently the bot knows how to check status of their smart lights (whether lights are on or off in their home) and switch all lights off remotely. More functionlity will be available on the future. 

The project also includes basic natural language processing capabilities (NLP) so the discussion with the bot can be done with natural language instead of commands.

## Installation

### SmartThings

SmartThings API requires a personal access token with permissions `r:scenes:*, l:devices, r:devices:*, x:scenes:*`. You can create one from [https://account.smartthings.com/tokens](https://account.smartthings.com/tokens).

### Slack

First you need to create new Slack application from [https://api.slack.com/apps](https://api.slack.com/apps). 

App needs to be able to write messages, so you need to authorize it for OAuth scope "chat:write" from "OAuth & Permissions". 

App also needs to notify the Lambda about incoming messages so you need to enable events from "Event Subscriptions". Request URL should be the endpoint you created to AWS API Gateway. You will also need to Subscribe to bot events "message.im"

### AWS

In AWS create new Lambda funcxtion and upload contents to it from this repositry. You can use build.sh and deploy.sh scripts to deploy the code e.g.

    sh build.sh
    sh deploy.sh nameOfYourLambda
    
You also need a API Gateway with POST method pointing to the Lambda. Remeber to use the Lambda Proxy integration, otherwise the lambda won't receive payloads from the Slack webhook and the integration will not work.

## Architecture

![architecture](https://lucid.app/publicSegments/view/32d706aa-c4de-47e8-92e1-e8a1ba557080/image.png "architecture")

## Contribution

You can also contribute more features to this project if you wish :)

Open an issue that describes new feature or hotfix, fork the repository in GitHub, make your changes and craete a pull request back to the main repository. Project accepts also documentation enhancements.

If you have an question, you should use open new issue with label "question" in project issue tracker.
