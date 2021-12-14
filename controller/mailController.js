import { SendMail } from "../mailFunction.js/mail.js";

export const sendMail = async (req, res) => {
  console.log(req.headers.messeage);
  SendMail("ayse", "maraa", "asd", "asd");
};

export const helloMail = async (req, res) => {
  res.send({
    message: "hello world",
  });
};
