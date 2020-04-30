const _ = require("lodash");
const tinder = require("tinder-client");
const express = require("express");
const router = express.Router();
const differenceWith = require("lodash/differenceWith");
const isEqual = require("lodash/isEqual");
const axios = require("axios");
const { sockets } = require("../ws");

const auth = require("../middleware/auth");
const { User } = require("../db/models/user");

const getRecommendations = async ({ tinderClient }) => {
  try {
    const recommendations = await tinderClient.getRecommendations();
    const photos = recommendations.results
      .filter(r => r.photos.length)
      .map(r => ({
        photos: r.photos.filter(p => p.id !== "unknown").map(p => p.url),
        _id: r._id
      }));
    console.log("photos", photos.length);
    return { data: { photos } };
  } catch (e) {
    console.log("Error while obtaining recommendations", e);
    return { error: e.message };
  }
};

let swiped = [];
let i = 0;

const estimator = async photos => {
  return Math.random() >= 0.5;

  try {
    console.log(`${photos.length} photos sent to estimator`);
    const res = await axios.post(
      "http://10.91.49.160:5000/api/predict/",
      photos
    );
    const result = res.data.result;
    console.log("result", result);
    return result !== "False";
  } catch (e) {
    console.log("error occurred while acccessing estimator", e.message);
  }
};

const performSwipes = async ({ _id, tinderClient }) => {
  console.log("RUN NUMBER", i);
  i += 1;
  const user = await User.findById(_id);
  if (!user.launched) return;

  const { data, error } = await getRecommendations({ tinderClient });
  if (error) return;
  const toSwipe = differenceWith(data.photos, swiped, isEqual);
  swiped = [...swiped, ...toSwipe];
  console.log("ALREADY SWIPdED", swiped.length);

  for (let account of toSwipe) {
    const isLike = await estimator(account.photos);
    if (isLike) {
      console.log("LIKE", sockets.length);
      const socket = sockets
        .reverse()
        .find(s => s._id.toString() === _id.toString());
      if (socket) {
        console.log("SOCKET FOUND");
        socket.emit("like", { photo: account.photos[0] });
      }
      await tinderClient.like(account._id);
    } else {
      await tinderClient.pass(account._id);
    }
  }

  return await new Promise((resolve, reject) => {
    setTimeout(async () => {
      const res = await performSwipes({ _id, tinderClient });
      resolve(res);
    }, 1000);
  });
};

router.post("/start", [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  user.launched = true;
  await user.save();

  const tinderClient = await tinder.createClientFromFacebookLogin({
    emailAddress: user.email,
    password: user.password
  });

  performSwipes({ _id: user._id, tinderClient });

  res.send({
    res: "success"
  });
});

router.post("/stop", [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  user.launched = false;
  await user.save();

  console.log("STOPPED");

  res.send({
    res: "success"
  });
});

module.exports = router;
