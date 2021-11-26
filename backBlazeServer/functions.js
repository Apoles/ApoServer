import axios from "axios";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { resolve } from "path";
import bluebird from "bluebird";
dotenv.config();
/*
const id = process.env.BACK_ID;
const key = process.env.BACK_KEY;
*/
const url = "https://api.backblazeb2.com/b2api";

export async function authBackBlaze() {
  const id = process.env.BACK_ID;
  const key = process.env.BACK_KEY;
  const result = await axios.get(`${url}/v2/b2_authorize_account`, {
    headers: {
      Authorization: "Basic " + Buffer.from(id + ":" + key).toString("base64"),
    },
  });

  return {
    auth: result.data.authorizationToken,
    apiUrl: result.data.apiUrl,
    downloadUrl: result.data.downloadUrl,
    accountId: result.data.accountId,
  };
}

export async function getUrlBlaze(auth, apiUrl) {
  const result = await axios.post(
    `${apiUrl}/b2api/v2/b2_get_upload_url`,
    { bucketId: "9abfba9d9584039377d90e1d" },
    {
      headers: {
        Authorization: auth,
      },
    }
  );

  return {
    uploadUrl: result.data.uploadUrl,
    bucketId: result.data.bucketId,
    authorizationToken: result.data.authorizationToken,
  };
}

//const fileStream = fs.createReadStream(file.path);
function getShaPromise(filePath) {
  return new bluebird(function (resolve, reject) {
    var fd = fs.createReadStream(filePath);
    var hash = crypto.createHash("sha1");
    hash.setEncoding("hex");
    fd.on("end", function () {
      hash.end();
      return resolve(hash.read());
    });
    fd.on("error", function (err) {
      return reject(err);
    });
    fd.pipe(hash);
  });
}

export async function uploadFileBack(auth, uploadUrl, file) {
  const stat = fs.statSync(file.path);

  const result = await axios.post(uploadUrl, null, {
    headers: {
      Authorization: auth,
      "X-Bz-File-Name": file.originalname,
      "Content-Type": file.mimetype,
      "Content-Length": stat.size,
      "X-Bz-Content-Sha1": `${await getShaPromise(file.path)}`,
    },
  });

  return result;
}
