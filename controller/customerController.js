import Customer from "../models/customer.js";

export const createCustomer = async (req, res) => {
  const customer = req.body;
  console.log(req.body);
  const newCustomer = new Customer(customer);

  try {
    console.log("try a girdi");
    await newCustomer.save();
    res.send("tms");
  } catch (error) {
    console.log(error);
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getCustomer = async (req, res) => {
  const posts = await Customer.find();
  res.status(200).json(posts);
};
