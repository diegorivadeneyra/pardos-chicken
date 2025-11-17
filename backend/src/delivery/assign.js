const db = require("../lib/db");
const events = require("../lib/events");
const s3 = require("../lib/s3");

exports.handler = async (event) => {
  try {
    const tenantId = event.headers?.["X-Tenant-Id"] || "pardos-chicken";
    const actorId = event.headers?.["X-Actor-Id"] || "dispatcher_anon";
    const body = JSON.parse(event.body || "{}");
    const driverId = body.driverId || "driver_anon";
    const orderId = event.pathParameters.orderId;
    const now = new Date().toISOString();

    await db.update({
      Key: { PK: { S: `TENANT#${tenantId}` }, SK: { S: `ORDER#${orderId}` } },
      UpdateExpression: "SET #s = :s, updatedAt = :u, GSI1PK = :gpk, GSI1SK = :gsk, driverId = :d",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":s": { S: "ASSIGNED_DRIVER" }, ":u": { S: now },
        ":gpk": { S: `TENANT#${tenantId}#STATUS#ASSIGNED_DRIVER` },
        ":gsk": { S: now },
        ":d": { S: driverId }
      }
    });

    await events.publish("DriverAssigned", { tenantId, orderId, driverId, actorId });
    await s3.saveEvidence(tenantId, orderId, "ASSIGNED_DRIVER", { driverId, actorId });

    return { statusCode: 200, body: JSON.stringify({ orderId, status: "ASSIGNED_DRIVER", driverId }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "AssignDriverFailed", detail: err.message }) };
  }
};
