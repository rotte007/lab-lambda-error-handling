# lab-lambda-error-handling
AWS Serverless

Implementd error handling using AWS Lambda’s built-in retry behavior, Dead Letter Queues (DLQs), and AWS Lambda Destinations. Created a Lambda function that intentionally fails to simulate real-world error scenarios. Configured an Amazon SQS queue as a DLQ to capture failed event payloads and an Amazon SNS topic to send failure notifications. Set up on-failure destinations to route failed executions to the SNS topic. Tested the retry behavior and verified that failed events are correctly routed to the DLQ and SNS. Analyze CloudWatch logs to track Lambda execution failures and retries

Background - When a Lambda function fails, handling the failed events efficiently is crucial. Two primary mechanisms for error handling in asynchronous invocations:

Dead Letter Queues (DLQs) – Use DLQs (Amazon SQS or SNS) when there is need to manually reprocess failed events. DLQs store failed events after Lambda exhausts its retry attempts, allowing us to investigate and reprocess them later.

Lambda Destinations (On-failure) – Use Destinations for real-time event routing when an execution fails. Failed events can be sent to Amazon SQS, SNS, EventBridge, S3, or another Lambda function for automated handling, such as logging, notifications, or triggering alternative workflows

Commands used to 

1. Send message to SNS topic Lambda-Trigger to invoke the Lambda function using AWS CLI. Send a message with message attribute shouldFail=false to verify successful processing.

LAMBDA_TRIGGER_TOPIC_ARN=$(aws sns list-topics --query "Topics[?contains(TopicArn, 'Lambda-Trigger')].TopicArn" --output text)
aws sns publish --topic-arn $LAMBDA_TRIGGER_TOPIC_ARN \
--message "Test successful event" \
--message-attributes '{"shouldFail": {"DataType": "String", "StringValue": "false"}}'

2. To tail CloudWatch logs

aws logs tail /aws/lambda/dlqTest --follow

3. Send message with message attribute shouldFail=true to trigger failure.

aws sns publish --topic-arn $LAMBDA_TRIGGER_TOPIC_ARN \
--message "Test failure event" \
--message-attributes '{"shouldFail": {"DataType": "String", "StringValue": "true"}}'
