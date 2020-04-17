const tinder = require("tinder-client");

const run = async () => {
  const client = await tinder.createClientFromFacebookLogin({
    emailAddress: "wasilisk.1995@mail.ru",
    password: "Swetlana53facebook"
  });

  const res = await client.getRecommendations();
  const recommendations = res.results;
  console.log("Amount of the accounts to estimate", recommendations.length);

  console.log(recommendations[0].photos[0].crop_info);
  console.log(recommendations[0].photos[0].processedFiles);
  console.log(recommendations[0].photos[0].webp_qf);

  for (let rec of recommendations) {
    const isLike = await decide(rec.photos.map(photo => photo.url));
    if (isLike){
      await client.like(rec._id);
    } else {
      await client.pass(rec._id);
    }
  }
};

const decide = async ({ images }) => {
  return true;
};

run();

console.log('fawffawfwasjkhkh')