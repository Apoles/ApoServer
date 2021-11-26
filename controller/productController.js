import Post from "../models/post.js";

export const getProduct = async (req, res) => {
  console.log(req.headers.messeage);
  const posts = await Post.find();
  res.status(200).json(posts);
};

export const createProduct = async (req, res) => {
  const product = req.body;
  console.log(req.body);

  const newProduct = new Post(product);

  try {
    console.log("try a girdi");
    await newProduct.save();
    res.send("tms");
  } catch (error) {
    console.log(error);
    res.status(409).json({
      message: error.message,
    });
  }
};

export const deleteOneProduct = async (req, res) => {
  const ids = req.body;
  console.log(ids.id);
  try {
    Post.deleteOne({ _id: ids.id }, function (err, results) {
      console.log("==========>err", err, "============>", results);
    });
    return res.status(200).send("yms");
  } catch (err) {
    console.log(err);
  }
};

export const uptadeOneDOcumant = async (req, res) => {
  const ids = req.body;
  console.log(ids);
  try {
    console.log("try a girioyr");

    await Post.updateOne(
      {
        _id: ids.id,
      },
      {
        $set: {
          _id: ids.id,
          productTittle: ids.productTittle,
          product: ids.product,
          productContent: ids.productContent,
        },
      },
      function (err, results) {
        console.log("==========>err", err, "============>", results);
      }
    );
  } catch (err) {
    console.log(err);
  }
};
