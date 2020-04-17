const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { encrypt, decrypt } = require("../../utils/cypher");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxLength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxLength: 1024,
    set: encrypt,
    get: decrypt
  },
  launched: Boolean
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, config.get("jwtSecret"));
};

const User = new mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
