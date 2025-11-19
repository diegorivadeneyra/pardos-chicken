const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async () => {
  try {
    const result = await client.send(new ScanCommand({
      TableName: process.env.TABLE_NAME
    }));

    // convertir cada item del formato bajo nivel a objeto plano
    const items = result.Items.map(unmarshall);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(items)
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
