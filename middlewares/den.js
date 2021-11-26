import jwt from "jsonwebtoken";

const den = (req, res, next) => {
  try {
    /*JWT is send with request header! 
    Format of it: Authorization : Bearer <token>
    */
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodedToken = jwt.verify(token, "secret_key");
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Auth failed",
    });
  }
};
export default den;
