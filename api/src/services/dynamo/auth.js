import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AWSENV } from '../../common/config';
import { create, deleteItem as _delete, get, scan, update } from '../aws/dynamoService';

const TABLE_NAME = `auth-${AWSENV}`;

function getDynamoKey(keys) {
  const { username } = keys;
  return { username };
}

export async function createItem(item) {
  await create(TABLE_NAME, getDynamoKey(item), item);
  return getItem(item);
}

export async function getItem(item) {
  const response = await get(TABLE_NAME, getDynamoKey(item));
  return response.Item;
}

export async function listItems() {
  const response = await scan({
    TableName: TABLE_NAME,
  });
  const items = response.Items || [];
  return items.map((item) => unmarshall(item));
}

export async function updateItem(item) {
  const { tenantId, expiryInSec } = item;
  const updates = [];
  if (tenantId !== undefined && tenantId !== null) {
    updates.push({ name: 'tenantId', value: tenantId });
  }
  if (expiryInSec !== undefined && expiryInSec !== null) {
    updates.push({ name: 'expiryInSec', value: expiryInSec });
  }

  const { UpdateExpression, ExpressionAttributeValues } = getDynamoUpdateExpressions(updates);
  const input = {
    TableName: TABLE_NAME,
    Key: getDynamoKey(item),
    UpdateExpression,
    ExpressionAttributeValues,
  };
  const response = await update(input);
  return response.Attributes;
}

export async function deleteItem(item) {
  await _delete(TABLE_NAME, getDynamoKey(item));
}

function getDynamoUpdateExpressions(input) {
  const UpdateExpression = 'set ' + input.map((kv) => `${kv.name} = :${kv.name}`).join(',');
  const ExpressionAttributeValues = {};
  input.forEach((kv) => {
    ExpressionAttributeValues[`:${kv.name}`] = kv.value;
  });
  return { UpdateExpression, ExpressionAttributeValues };
}

export async function count() {
  const response = await scan({
    TableName: TABLE_NAME,
    Select: 'COUNT',
  });
  const count = response.Items?.length || 0;
  return count;
}

/**
 * assuming all input value is a string
 * condition is equal only
 *
 * @param inputs { name: 'ronnie', age: '29' }
 * @returns
  {
    "FilterExpression": "#name = :name = #age = :age",
    "ExpressionAttributeNames": { "#name": "name", "#age": "age" },
    "ExpressionAttributeValues": { ":name": { "S": "ronnie" }, ":age": { "S": "24" } }
  }
 */
function getFilterExpression(inputs) {
  // eslint-disable-line
  const filterExpression = [];
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  for (const [key, value] of Object.entries(inputs)) {
    filterExpression.push(`#${key} = :${key}`);
    ExpressionAttributeNames['#' + key] = key;
    ExpressionAttributeValues[':' + key] = { S: value };
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
  });

  const items = response.Items || [];
  return items.map((item) => unmarshall(item));
}