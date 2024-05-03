import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  DeleteCommand,
  DynamoDBDocument,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { AWS } from '../../common/constants';

const { AWS_REGION_APSE2 } = AWS.REGIONS,
  /*
   * See https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-dynamodb
   * See https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01
   * See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
   * See https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
   */

  ddbClient = new DynamoDBClient({
    region: AWS_REGION_APSE2,
  }),
  marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: true, // False, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // False, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: true, // False, by default.
  },
  unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // False, by default.
  },
  translateConfig = { marshallOptions, unmarshallOptions },
  // Create the DynamoDB Document client.
  ddbDocClient = DynamoDBDocument.from(ddbClient, translateConfig);

export function getDynamoDBClient() {
  return ddbClient;
}

export function getDynamoDocClient() {
  return ddbDocClient;
}

export async function create(TableName, Key, content) {
  const params = {
      TableName,
      Item: {
        ...Key,
        ...content,
      },
    },
    data = await ddbDocClient.send(new PutCommand(params));
  // Console.debug('Success - item added or updated', data);
  return data;
}

export async function get(TableName, Key) {
  const params = {
      TableName,
      Key,
    },
    data = await ddbDocClient.send(new GetCommand(params));
  /*
   * Console.debug('Success :', data);
   * console.debug('Success :', data.Item);
   */
  return data;
}

/**
 * @param input has the below
 * // Define expressions for the new or updated attributes
 *  UpdateExpression: 'set ATTRIBUTE_NAME_1 = :t, ATTRIBUTE_NAME_2 = :s', // For example, "'set Title = :t, Subtitle = :s'"
 *  ExpressionAttributeValues: {
 *    ':t': 'NEW_ATTRIBUTE_VALUE_1', // For example ':t' : 'NEW_TITLE'
 *    ':s': 'NEW_ATTRIBUTE_VALUE_2', // For example ':s' : 'NEW_SUBTITLE'
 *  },
 *  ReturnValues: 'ALL_NEW',
 */
export async function update(input) {
  const {
      TableName,
      Key,
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      ReturnValues = 'ALL_NEW',
    } = input || {},
    params = {
      TableName,
      Key,
      // Define expressions for the new or updated attributes
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues,
    },
    data = await ddbDocClient.send(new UpdateCommand(params));
  // Console.debug('Success - item added or updated', data);
  return data;
}

/**
 * @param input has the below
 *  ExpressionAttributeValues: {
 *    ':s': 1,
 *    ':e': 1,
 *    ':topic': 'Title2',
 *  },
 *  // Specifies the values that define the range of the retrieved items. In this case, items in Season 2 before episode 9.
 *  KeyConditionExpression: 'Season = :s and Episode > :e',
 *  // Filter that returns only episodes that meet previous criteria and have the subtitle 'The Return'
 *  FilterExpression: 'contains (Subtitle, :topic)',
 */
export async function query(input) {
  const { TableName, ExpressionAttributeValues, KeyConditionExpression, FilterExpression } = input || {},
    params = {
      TableName,
      ExpressionAttributeValues,
      // Specifies the values that define the range of the retrieved items. In this case, items in Season 2 before episode 9.
      KeyConditionExpression,
      // Filter that returns only episodes that meet previous criteria and have the subtitle 'The Return'
      FilterExpression,
    },
    data = await ddbDocClient.send(new QueryCommand(params));
  /*
   * Console.debug('Success. Item details: ', data);
   * console.debug('Success. Item details: ', data.Items);
   */
  return data;
}

/**
 * @param input has the below
 *  ExpressionAttributeValues: {
 *    ':s': 1,
 *    ':e': 1,
 *    ':topic': 'Title2',
 *  },
 *  // Filter that returns only episodes that meet previous criteria and have the subtitle 'The Return'
 *  FilterExpression: 'contains (Subtitle, :topic)',
 */
export async function scan(input) {
  const {
      TableName,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      FilterExpression,
      ProjectionExpression,
      Select,
      Limit,
    } = input || {},
    params = {
      TableName,
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      Limit,
      ProjectionExpression,
      Select,
    },
    data = await ddbDocClient.send(new ScanCommand(params));
  /*
   * Console.debug('Success. Item details: ', data);
   * console.debug('Success. Item details: ', data.Items);
   */
  return data;
}

export async function deleteItem(TableName, Key) {
  const params = {
      TableName,
      Key,
    },
    data = await ddbDocClient.send(new DeleteCommand(params));
  // Console.debug('Success - item deleted');
  return data;
}

export async function batchGet(TableName, Keys) {
  const params = {
      RequestItems: {
        [TableName]: { Keys },
      },
    },
    data = await ddbDocClient.send(new BatchGetCommand(params));
  return data;
}
