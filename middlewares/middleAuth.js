import axios from "axios";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const token = req.body;

  // console.log("authorizate", req.headers.authorization.split(" ")[0]);
  // const token = req;

  if (req.headers.authorization) {
    if (token) {
      const getKeys = req.headers.authorization.split(" ")[0];
      const getRefKeys = req.headers.authorization.split(" ")[1];
      jwt.verify(
        token.data || token.token || req.headers.messeage || getKeys,
        "secretkey",
        async (err, decodedToken) => {
          if (err) {
            try {
              const result = await axios.post(
                "http://localhost:7000/login/ref",
                {
                  refToken: token.refToken || getRefKeys,
                }
              );
              console.log(
                "====================>>>>>>",
                result.data.accessToken
              );
              jwt.verify(
                result.data.accessToken,
                "secretkey",
                (err, decodedToken) => {
                  if (err) {
                    console.log(err);
                    res.status(401).send("başasırısız ama diğer taraf he");
                  } else {
                    console.log("haaaaaaahahahahha", decodedToken);
                    next();
                  }
                }
              );
            } catch {
              res.status(401).send({ message: "başarısırz" });
            }
          } else {
            console.log("decodedToken", decodedToken);
            //res.send("başarılı");
            console.log("başasrı");
            next();
          }
        }
      );
    } else {
      console.log("token hiç yok");
    }
  } else {
    if (token) {
      jwt.verify(
        token.data || token.token || req.headers.messeage,
        "secretkey",
        async (err, decodedToken) => {
          if (err) {
            try {
              const result = await axios.post(
                "http://localhost:7000/login/ref",
                {
                  refToken: token.refToken,
                }
              );
              console.log(
                "====================>>>>>>",
                result.data.accessToken
              );
              jwt.verify(
                result.data.accessToken,
                "secretkey",
                (err, decodedToken) => {
                  if (err) {
                    console.log(err);
                    res.status(401).send("başasırısız ama diğer taraf he");
                  } else {
                    console.log("haaaaaaahahahahha", decodedToken);
                    next();
                  }
                }
              );
            } catch {
              res.status(401).send({ message: "başarısırz" });
            }
          } else {
            console.log("decodedToken", decodedToken);
            //res.send("başarılı");
            console.log("başasrı");
            next();
          }
        }
      );
    } else {
      console.log("token hiç yok");
    }
  }
};

export default auth;
