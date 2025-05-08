export const lambdaHandler = async (event, context) => {
  const requestId = context.awsRequestId;
  const messageId = event.Records?.[0]?.Sns?.MessageId || "N/A";

  try {
    console.log(JSON.stringify({
      level: "info",
      requestId,
      messageId,
      message: "Processing asynchronous event from SNS",
      event
    }));

    // Extract failure flag from event
    const shouldFail = event.Records?.[0]?.Sns?.MessageAttributes?.shouldFail?.Value === "true";

    if (shouldFail) {
      throw new Error("Simulated function failure");
    }

    console.log(JSON.stringify({
      level: "info",
      requestId,
      messageId,
      message: "Event processed successfully"
    }));

  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      requestId,
      messageId,
      message: "Error processing event",
      error: error.message,
      stack: error.stack
    }));

    throw error; // Ensures Lambda retries or routes failure to DLQ/Destination
  }
};