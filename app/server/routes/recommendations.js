const _ = require("lodash");
const tinder = require("tinder-client");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { User } = require("../db/models/user");
const photosSamples = require("../data/photos");

const getRecommendations = async ({ tinderClient }) => {
  try {
    const recommendations = await tinderClient.getRecommendations();
    const photos = recommendations.results
      .filter(r => r.photos.length)
      .map(r => r.photos[0])
      .filter(p => p.id !== "unknown")
      .map(p => p.url);
    console.log("photos", photos);
    return photos;
  } catch (e) {
    console.log("Error while obtaining recommendations", e);
    return { error: e.message };
  }
};

router.get("/", [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log("user", user.email, user.password);

  const tinderClient = await tinder.createClientFromFacebookLogin({
    emailAddress: user.email,
    password: user.password
  });

  const photos = await getRecommendations({ tinderClient });
  res.send({ photos });

  // res.send({
  //   photos: photosSamples
  // });
});

router.post("/", [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log("user", user.email, user.password);
  console.log("estimates", req.body.estimates);

  res.send({
    res: "success"
  });
});

module.exports = router;
