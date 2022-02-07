#Auth app server

Project repository for the server of "Auth" application.

The server logic is written in node.js and uses serverless framework for deployment on AWS cloud.

Server is based on serverless architecture and depends on the fallowing Amazon Web Services:
* Cloud Formation
* Amazon Lambda
* API Gateway
* S3
* DynamoDB
* IAM
* CloudWatch

##Deploy

First make sure you have the necessary AWS credentials set up on your machine and node with npm installed.   

Run the fallowing commands:
    
    npm install

    sls deploy [--stage --region]

After a successful deployment copy, the generated API Gateway host endpoint from the terminal.
This the endpoint needs to be used in the mobile application.

###Options

####stage
Serverless stage that will be targeted.

####region
The AWS region that will be targeted. If not provided the default value is **eu-west-1**.

##Tests

To run unit tests use this command:

    npm run tests
