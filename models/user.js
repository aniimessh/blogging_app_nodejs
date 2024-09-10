const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    profileImageurl: {
      type: String,
      default: "/images/user.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha-256", salt)
    .update(this.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return false;
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedhash = createHmac("sha-256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedhash)
      throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("user", userSchema);
module.exports = User;
