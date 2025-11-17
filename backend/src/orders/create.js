const { v4: uuid } = require("uuid");
const db = require("../lib/db");
const events = require("../lib/events");
const s3 = require("../lib/s3");

exports.handler = async (event) => {
  try {
    const tenantId = event.headers?.["X-Tenant-Id"] || "pardos-chicken";
    const body = JSON.parse(event.body || "{}");
    const orderId = uuid();
    const now = new Date().toISOString();

    const orderItem = {
      PK: { S: `TENANT#${tenantId}` },
      SK: { S: `ORDER#${orderId}` },
      tenantId: { S: tenantId },
      orderId: { S: orderId },
      status: { S: "RECEIVED" },
      createdAt: { S: now },
      updatedAt: { S: now },
      total: { N: String(body.total || 0) },
      items: { S: JSON.stringify(body.items || []) },
      GSI1PK: { S: `TENANT#${tenantId}#STATUS#RECEIVED` },
      GSI1SK: { S: now }
    };

    await db.put(orderItem);
    await events.publish("OrderCreated", { tenantId, orderId, items: body.items, total: body.total });
    await s3.saveEvidence(tenantId, orderId, "RECEIVED", { body });

    return {
      statusCode: 201,
      body: JSON.stringify({ orderId, status: "RECEIVED", createdAt: now })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "CreateOrderFailed", detail: err.message }) };
  }
};
