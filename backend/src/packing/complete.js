const db = require("../lib/db");
const events = require("../lib/events");
const s3 = require("../lib/s3");

exports.handler = async (event) => {
  try {
    const tenantId = event.headers?.["X-Tenant-Id"] || "pardos-chicken";
    const actorId = event.headers?.["X-Actor-Id"] || "packer_anon";
    const orderId = event.pathParameters.orderId;
    const now = new Date().toISOString();

    await db.update({
      Key: { PK: { S: `TENANT#${tenantId}` }, SK: { S: `ORDER#${orderId}` } },
      UpdateExpression: "SET #s = :s, updatedAt = :u, GSI1PK = :gpk, GSI1SK = :gsk",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":s": { S: "PACKED" }, ":u": { S: now },
        ":gpk": { S: `TENANT#${tenantId}#STATUS#PACKED` },
        ":gsk": { S: now }
      }
    });

    await events.publish("PackingCompleted", { tenantId, orderId, actorId });
    await s3.saveEvidence(tenantId, orderId, "PACKED", { actorId });

    return { statusCode: 200, body: JSON.stringify({ orderId, status: "PACKED" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "PackingCompleteFailed", detail: err.message }) };
  }
};
