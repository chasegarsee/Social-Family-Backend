const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../socialfamily-55d8f6bf86fe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// admin.initializeApp();
const express = require("express");
const app = express();

app.get("/posts", (req, res) => {
  admin
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
          ...doc.data()
        });
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
});

app.post("/post", (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

exports.api = functions.https.onRequest(app);
