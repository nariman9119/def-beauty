const express = require("express");
// const bcrypt = require("bcryptjs");
const tinder = require("tinder-client");

const async = require("../middleware/async");
const { User, validate } = require("../db/models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ code: 4001, message: error.details[0].message });

  let { email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    // const validPassword = await bcrypt.compare(password, user.password);
    // if (!validPassword)
    //   return res.status(400).send({ code: 4002, message: "Invalid password" });
    console.log("given", password);
    console.log("stored", user.password);

    if (password !== user.password) {
      return res.status(400).send({ code: 4002, message: "Invalid password" });
    }

    const token = user.generateAuthToken();
    res.send({ token });
  } else {
    try {
      const tinderClient = await tinder.createClientFromFacebookLogin({
        emailAddress: email,
        password: password
      });
      const profile = await tinderClient.getProfile();

      // const salt = await bcrypt.genSalt(10);
      // password = await bcrypt.hash(password, salt);
      let user = new User({ email, password });
      await user.save();
      const token = user.generateAuthToken();

      res.send({ token });
    } catch (e) {
      console.log("error", e);
      return res
        .status(400)
        .send({ code: 4003, message: "Invalid Email or Password" });
    }
  }
});

module.exports = router;
