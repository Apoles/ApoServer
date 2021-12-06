import express from "express";
import {
  createProduct,
  deleteOneProduct,
  getOneDOcumant,
  getProduct,
  uptadeOneDOcumant,
} from "../controller/productController.js";
import auth from "../middlewares/middleAuth.js";

const productRoute = express.Router();
productRoute.get("/", getProduct);
productRoute.post("/", createProduct);
productRoute.post("/delete", deleteOneProduct);
productRoute.post("/uptade", uptadeOneDOcumant);
productRoute.get("/find", getOneDOcumant);

export default productRoute;
