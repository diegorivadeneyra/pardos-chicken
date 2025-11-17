const db = require("../lib/db");

exports.handler = async (event) => {
  try {
    const tenantId = event.headers?.["X-Tenant-Id"] || "pardos-chicken";
    const status = event.queryStringParameters?.status || "COOKING";

    const res = await db.query({
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gpk",
      ExpressionAttributeValues: {
        ":gpk": { S: `TENANT#${tenantId}#STATUS#${status}` }
      },
      ScanIndexForward: true
    });

    const items = (res.Items || []).map(it => ({
      orderId: it.orderId.S,
      status: it.status.S,
      createdAt: it.createdAt.S,
      updatedAt: it.updatedAt.S,
      tenantId: it.tenantId.S
    }));

    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "ListByStatusFailed", detail: err.message }) };
  }
};
