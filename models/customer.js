import mongoose from "mongoose";
import {
  validateOnlyString,
  validateOnlyInt,
  validateOnlyDoubleAndInt,
  validateEmail,
} from "./functions.js";

var createId = function () {
  var sayi = `${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}${Math.floor(
    Math.random() * 10
  )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}
    `;
  console.log(sayi);

  return parseInt(sayi);
};

var CounterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const postSchema = mongoose.Schema({
  order: {
    type: Number,
    uniqe: true,
  },

  customerName: {
    type: String,
    required: true,
    validate: [validateOnlyString, "isim yanlış girildi"],
  },
  customerSurName: {
    type: String,

    required: true,
    validate: [validateOnlyString, "soyismi yanlış girildi"],
  },
  eMail: {
    type: String,
    lowercase: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email addresa"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email addressss",
    ],
  },
  paymentDate: {
    type: String,
  },
  city: {
    type: String,
    required: true,
    validate: [validateOnlyString, "şehir ismi yanlış girildi"],
  },
  town: {
    type: String,
    required: true,
    validate: [validateOnlyString, "ilçe ismi yanliş girildi"],
  },
  adress: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  orderPrize: {
    type: Number,
    required: true,
    validate: [validateOnlyDoubleAndInt, "Fiyat da bir yanlışlık var"],
  },
  kdv: {
    type: Number,
    required: true,
    validate: [validateOnlyDoubleAndInt, "kdv de bir yanlışlık var"],
  },
  customerPhone: {
    type: Number,
    required: true,
  },
  product: {
    type: Array,
    required: true,
  },
});

function handle() {
  counter.findByIdAndUpdate(
    { _id: "entityId" },
    { $inc: { seq: 1 } },
    function (error, datam) {
      if (error) {
        return next(error);
      }

      return datam.seq;
    }
  );
}

postSchema.pre("save", function async(next) {
  var doc = this;

  counter.findByIdAndUpdate(
    { _id: "entityId" },
    { $inc: { seq: 1 } },
    function (error, datam) {
      if (error) {
        return next(error);
      }
    }
  );

  doc.paymentDate = Date();
  doc.order = createId();

  //veri.order=(Customer.length+1).toString()

  next();
});

const Customer = mongoose.model("Customer", postSchema);
const counter = mongoose.model("counters", CounterSchema);
export default Customer;
