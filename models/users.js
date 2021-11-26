import mongoose from "mongoose";
import bcyrpt from "bcrypt";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 15,
  },
});
/*
userSchema.pre("save", async function (next) {

  console.log();
  this.isModified('password')

  const salt = await bcyrpt.genSalt();
  this.passwword = await bcyrpt.hash(this.passwword, salt);

  next();
});*/

userSchema.statics.login = async function (userName, password) {
  console.log("login kısmına giriyor");
  const user = this;
  const isExist = await user.findOne({ userName });
  if (isExist) {
    console.log("isEXist", isExist);

    const auth = await bcyrpt.compare(password, isExist.password);
    if (auth) {
      console.log("auth", auth);
      return isExist;
    } else {
      console.log("sifre yok");
    }
  } else {
    console.log("kullnaıcı yok");
  }
};

userSchema.pre("save", function (next) {
  const user = this;
  console.log("şifre gizlidir", this.password);

  if (this.isModified("password") || this.isNew) {
    bcyrpt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcyrpt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

const User = mongoose.model("Users", userSchema);
export default User;
