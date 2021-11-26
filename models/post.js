import mongoose from "mongoose";
const postSchema = mongoose.Schema({
  photoUrl: {
    type: String,
  },
  productTittle: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },

  /* productImageUrl: {
    type: String,
    required: true,
  },*/
  productDescription: {
    type: String,
    required: true,
  },
  createTime: {
    type: String,
  },
});

postSchema.pre("save", function (next) {
  const Post = this;

  Post.createTime = Date();
  next();
});

const Post = mongoose.model("Posts", postSchema);
export default Post;
