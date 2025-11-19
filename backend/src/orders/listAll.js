const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB();   // 👈 usa el cliente bajo nivel

exports.handler = async () => {
  try {
    const result = await dynamo.scan({
      TableName: process.env.TABLE_NAME
    }).promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Items ?? [])
    };
  } catch (err) {
    console.error("Error listing orders:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Could not list orders", detail: err.message })
    };
  }
};
