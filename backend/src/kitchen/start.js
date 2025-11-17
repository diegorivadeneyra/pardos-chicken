const db = require("../lib/db");
const events = require("../lib/events");
const s3 = require("../lib/s3");

exports.handler = async (event) => {
  try {
    const tenantId = event.headers?.["X-Tenant-Id"] || "pardos-chicken";
    const actorId = event.headers?.["X-Actor-Id"] || "chef_anon";
    const orderId = event.pathParameters.orderId;
    const now = new Date().toISOString();

    await db.update({
      Key: { PK: { S: `TENANT#${tenantId}` }, SK: { S: `ORDER#${orderId}` } },
      UpdateExpression: "SET #s = :s, updatedAt = :u, GSI1PK = :gpk, GSI1SK = :gsk",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":s": { S: "COOKING" }, ":u": { S: now },
        ":gpk": { S: `TENANT#${tenantId}#STATUS#COOKING` },
        ":gsk": { S: now }
      }
    });

    await events.publish("KitchenStarted", { tenantId, orderId, actorId });
    await s3.saveEvidence(tenantId, orderId, "COOKING", { actorId });

    return { statusCode: 200, body: JSON.stringify({ orderId, status: "COOKING" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "KitchenStartFailed", detail: err.message }) };
  }
};
