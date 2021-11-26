import multer from "multer";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/post.js";

import cookieParser from "cookie-parser";
import loginRoute from "./routes/loginRoutes.js";
import auth from "./middlewares/middleAuth.js";
import productRoute from "./routes/productRoute.js";
import customerRouter from "./routes/customerRoutes.js";

import {
  authBackBlaze,
  getUrlBlaze,
  uploadFileBack,
} from "./backBlazeServer/functions.js";

const PORT = process.env.PORT || 7000;
const app = express();

dotenv.config();

const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({
    message: "nice and quick server",
    admin: "create by APoles",
  });
});

app.use("/posts", postRoutes);
app.use("/login", loginRoute);
app.use("/product", productRoute);
app.use("/customer", customerRouter);

const CONNTECTION_URL = process.env.CONNTECTION_URL;
mongoose
  .connect(CONNTECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("server çalısıyor", PORT);
    });
  })
  .catch((error) => {});

//         BACK BLAZE EXAMPLE

app.post("/images", upload.single("resim"), async (req, res) => {
  const file = req.file;

  try {
    const auth = await authBackBlaze();

    const urls = await getUrlBlaze(auth.auth, auth.apiUrl);

    await uploadFileBack(urls.authorizationToken, urls.uploadUrl, file).catch(
      (err) => {
        console.log(err);
      }
    );

    res.status(200).send(result);
  } catch (err) {
    console.log("========>", err);
    res.status(404).send("hata");
  }
});

/*

file =======> {
  fieldname: 'resim',
  originalname: 'Screenshot+from+2021-11-08+13-59-59.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads/',
  filename: '57d6d9d0a47f668031b97162ff024a60',
  path: 'uploads/57d6d9d0a47f668031b97162ff024a60',
  size: 313702
}*/
