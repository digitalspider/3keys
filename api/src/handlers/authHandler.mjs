import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { HttpStatusCode } from 'axios';
import { HTTP_METHOD } from '../common/constants';
import { listCustomers } from '../services/customerService';
import { createResponse } from '../services/utils';
import { CustomAxiosError } from '../types/error';

const { Ok, MethodNotAllowed, InternalServerError } = HttpStatusCode;
const { GET, POST } = HTTP_METHOD;

export async function handler(event, context) {
  const { httpMethod, path, body: bodyString } = event;
  const { awsRequestId } = context;
  const body = bodyString ? JSON.parse(bodyString) : undefined;
  body &&
    console.debug('request', { handler: 'appHandler', httpMethod, path, awsRequestId, body: JSON.stringify(body) });

  try {
    let result;
    switch (httpMethod) {
      case GET:
        if (path.endsWith('/')) {
          result = await handleList(body, path, awsRequestId);
        }
        break;
      case POST:
        if (path.endsWith('/')) {
          result = await handleList(body, path, awsRequestId);
        }
        break;
      default:
        throw new CustomAxiosError('Invalid request', { status: MethodNotAllowed });
    }

    console.debug('response', { httpMethod, path, awsRequestId, response: JSON.stringify(result) });
    return createResponse(Ok, result);
  } catch (err) {
    console.error(`ERROR in ${httpMethod} ${path}.`);
    const { status, message, data, url = `${httpMethod} ${path}` } = err;
    const errorStatus = status || InternalServerError;
    console.error({ message, data, url, errorStatus, body, err });
    const errorBody = {
      message,
      status,
      awsRequestId,
    };
    return createResponse(errorStatus, errorBody);
  }
}

export async function handleList(input, requestPath, awsRequestId) {
  const { tenantId } = input || {};
  try {
    const result = await listCustomers(tenantId);
    return result || [];
  } catch (error) {
    const message = `Failed to list customers for tenant ${tenantId}`;
    console.error({ message, requestPath, awsRequestId, error });
    throw error;
  }
}
