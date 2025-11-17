const db = require("../lib/db");

exports.handler = async (event) => {
  try {
    const tenantId = event.headers?.["X-Tenant-Id"] || "pardos-chicken";
    const orderId = event.pathParameters.orderId;

    const res = await db.get({
      PK: { S: `TENANT#${tenantId}` },
      SK: { S: `ORDER#${orderId}` }
    });

    if (!res.Item) {
      return { statusCode: 404, body: JSON.stringify({ message: "Order not found" }) };
    }

    const it = res.Item;
    const items = JSON.parse(it.items.S);

    return {
      statusCode: 200,
      body: JSON.stringify({
        orderId: it.orderId.S,
        tenantId: it.tenantId.S,
        status: it.status.S,
        createdAt: it.createdAt.S,
        updatedAt: it.updatedAt.S,
        items,
        total: Number(it.total.N)
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "GetOrderFailed", detail: err.message }) };
  }
};
