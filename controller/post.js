import User from "../models/users.js";
import jwt from "jsonwebtoken";

const maxAge = (60 * 60) / 10;
const refresMaxAge = 60 * 60;
const message = {
  message: "BU ALAN RİSKLİDİR",
  admin: "CREATER BY APOLES",
  status: "401 NOT  AUTHORIZED ",
};

const createToken = (id) => {
  return jwt.sign({ id }, "secretKey", { expiresIn: maxAge });
};
const refreshToken = (id) => {
  return jwt.sign({ id }, "Apoles123.", {
    expiresIn: refresMaxAge,
  });
};

export const getUser = async (req, res) => {
  const posts = await User.find();
  const a = JSON.stringify(message, null, 2);

  console.log(a);
  res.send(a);
  //res.status(200).json(posts);
};

export const createUsers = async (req, res) => {
  const post = req.body;
  console.log(req.body);
  const newPost = new User(post);

  try {
    console.log("try a girdi");
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.login(userName, password);

    const token = createToken(user._id);
    const refToken = refreshToken(user._id);

    res.status(200).json({ token: token, refToken: refToken });
  } catch (e) {
    console.log("hata adlım");
    console.log("===>", e);
    res.status(404).send({
      message: "Kullanıcı adı yada parola hatalı",
      admin: "Creater by APoles",
    });
  }
};

export const createTokFromRefTok = async (req, res) => {
  const refTok = req.body;
  console.log("refTok", refTok.refToken);
  if (!refTok) {
    res.status(401).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  }
  try {
    const user = jwt.verify(refTok.refToken, "Apoles123.");
    // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
    const { id } = user;
    console.log("=>", id);
    const accessToken = await jwt.sign({ id }, "secretkey", {
      expiresIn: maxAge,
    });
    console.log(accessToken);
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
};

export const logins = async (req, res) => {
  const user = await User.login(userName, password);
  const token = createToken(user._id);
  res.cookie("denemes", token);
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
};

/*   SİGN METODU ALTERNETİF
export const signden = async (req, res) => {
  const post = req.body;
  const userName = post.userName;
  const password = post.password;

  const isExist = await User.findOne({ userName });
  if (isExist) {
    const auth = await bcyrpt.compare(password, isExist.password);
    if (auth) {
      console.log("auth", auth);
      const token = createToken(isExist._id);

      res.status(200).json({ Headers: token });
    } else {
      console.log("parola hata");
      return res.status(401).send("hata");
    }
  } else {
    console.log("kullancı hata");
  }
};
*/
