const { db } = require("../util/admin");

exports.getAllSocialPosts = (req, res) => {
  db.collection("socialPosts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let socialPosts = [];
      data.forEach(doc => {
        socialPosts.push({
          socialPostId: doc.id,
          ...doc.data()
        });
      });
      return res.json(socialPosts);
    })
    .catch(err => console.error(err));
};