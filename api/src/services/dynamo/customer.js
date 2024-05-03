import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AWSENV } from '../../common/config';
import { deleteItem as _delete, create, get, scan, update } from '../aws/dynamoService';

const TABLE_NAME = `customers-${AWSENV}`;

function getDynamoKey(keys) {
  const { tenantId, id } = keys;
  return { tenantId, id };
}

export async function createItem(item) {
  await create(TABLE_NAME, getDynamoKey(item), item);
  return getItem(item);
}

export async function getItem(item) {
  const response = await get(TABLE_NAME, getDynamoKey(item));
  return response.Item;
}

export async function listItems(pk) {
  const response = await scan({
      TableName: TABLE_NAME,
      FilterExpression: '#tenantId = :tenantId',
      ExpressionAttributeNames: { '#tenantId': 'tenantId' },
      ExpressionAttributeValues: { ':tenantId': { S: pk } },
    }),
    items = response.Items || [];
  return items.map((item) => unmarshall(item));
}

export async function updateItem(item) {
  const { firstName, lastName, email, mobileNumber, deviceId, deviceOs, encrypted, customerType } = item,
    updates = [];
  if (encrypted !== undefined && encrypted !== null) {
    updates.push({ name: 'encrypted', value: encrypted });
  }
  if (firstName !== undefined && firstName !== null) {
    updates.push({ name: 'firstName', value: firstName });
  }
  if (lastName !== undefined && lastName !== null) {
    updates.push({ name: 'lastName', value: lastName });
  }
  if (email !== undefined && email !== null) {
    updates.push({ name: 'email', value: email });
  }
  if (mobileNumber !== undefined && mobileNumber !== null) {
    updates.push({ name: 'mobileNumber', value: mobileNumber });
  }
  if (customerType !== undefined && customerType !== null) {
    updates.push({ name: 'customerType', value: customerType });
  }
  if (deviceId !== undefined && deviceId !== null) {
    updates.push({ name: 'deviceId', value: deviceId });
  }
  if (deviceOs !== undefined && deviceOs !== null) {
    updates.push({ name: 'deviceOs', value: deviceOs });
  }

  const { UpdateExpression, ExpressionAttributeValues } = getDynamoUpdateExpressions(updates),
    input = {
      TableName: TABLE_NAME,
      Key: getDynamoKey(item),
      UpdateExpression,
      ExpressionAttributeValues,
    },
    response = await update(input);
  return response.Attributes;
}

export async function deleteItem(item) {
  await _delete(TABLE_NAME, getDynamoKey(item));
}

function getDynamoUpdateExpressions(input) {
  const UpdateExpression = `set ${input.map((kv) => `${kv.name} = :${kv.name}`).join(',')}`,
    ExpressionAttributeValues = {};
  input.forEach((kv) => {
    ExpressionAttributeValues[`:${kv.name}`] = kv.value;
  });
  return { UpdateExpression, ExpressionAttributeValues };
}

export async function count() {
  const response = await scan({
      TableName: TABLE_NAME,
      Select: 'COUNT',
    }),
    count = response.Items?.length || 0;
  return count;
}

/**
 * Assuming all input value is a string
 * condition is equal only
 *
 * @param inputs { name: 'ronnie', age: '29' }
 * @returns
 *{
 *  "FilterExpression": "#name = :name = #age = :age",
 *  "ExpressionAttributeNames": { "#name": "name", "#age": "age" },
 *  "ExpressionAttributeValues": { ":name": { "S": "ronnie" }, ":age": { "S": "24" } }
 *}
 */
function getFilterExpression(inputs) {
  // eslint-disable-line
  const filterExpression = [],
    ExpressionAttributeNames = {},
    ExpressionAttributeValues = {};

  for (const [key, value] of Object.entries(inputs)) {
    filterExpression.push(`#${key} = :${key}`);
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = { S: value };
  }

  return {
    FilterExpression: filterExpression.join(' AND '),
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
}

export async function searchItems(filter) {
  const response = await scan({
      TableName: TABLE_NAME,
      ...getFilterExpression(filter),
    }),
    items = response.Items || [];
  return items.map((item) => unmarshall(item));
}
