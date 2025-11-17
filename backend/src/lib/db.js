const { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const TABLE = process.env.TABLE_NAME;

module.exports = {
  put: (item) => client.send(new PutItemCommand({ TableName: TABLE, Item: item })),
  get: (key) => client.send(new GetItemCommand({ TableName: TABLE, Key: key })),
  update: (params) => client.send(new UpdateItemCommand({ TableName: TABLE, ...params })),
  query: (params) => client.send(new QueryCommand({ TableName: TABLE, ...params })),
  marshall,
  unmarshall
};
