const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({});
const BUCKET = process.env.EVIDENCE_BUCKET;

module.exports.saveEvidence = async (tenantId, orderId, stage, payload) => {
  const key = `${tenantId}/${orderId}/${stage}-${Date.now()}.json`;
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(payload),
    ContentType: "application/json"
  }));
  return key;
};
