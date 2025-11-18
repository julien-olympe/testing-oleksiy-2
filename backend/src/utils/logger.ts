export function logError(error: Error, context: {
  method: string;
  path: string;
  userId?: string;
  requestId?: string;
}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    errorType: error.constructor.name,
    errorMessage: error.message,
    stackTrace: error.stack,
    requestDetails: {
      method: context.method,
      path: context.path,
      userId: context.userId,
      requestId: context.requestId,
    },
  };
  
  console.error('Error logged:', JSON.stringify(logEntry, null, 2));
}
