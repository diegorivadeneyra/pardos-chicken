const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const bus = new EventBridgeClient({});
const BUS_NAME = process.env.EVENT_BUS_NAME;

module.exports.publish = async (detailType, detail) => {
  await bus.send(new PutEventsCommand({
    Entries: [{
      EventBusName: BUS_NAME,
      Source: "pardos.orders",
      DetailType: detailType,
      Detail: JSON.stringify(detail)
    }]
  }));
};
