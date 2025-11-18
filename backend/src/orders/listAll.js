const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  try {
    const result = await dynamo.scan({
      TableName: process.env.TABLE_NAME
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (err) {
    console.error("Error listing orders:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not list orders" })
    };
  }
};
