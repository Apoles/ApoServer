import AWS from "aws-sdk";
import fs from "fs";
import S3 from "aws-sdk/clients/s3.js";
import dotenv from "dotenv";

dotenv.config();

AWS.config.loadFromPath("./awsConfig.json");

const region = process.env.REGİON;
const axesKey = process.env.AXESKEY;
const secretKey = process.env.SECREYKEY;
const awsName = process.env.AWSNAME;

const s3 = new S3({
  region,
  axesKey,
  secretKey,
});

export function uplade(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: "resims",
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
export default uplade;
