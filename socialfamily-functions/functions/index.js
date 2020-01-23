const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = "../socialfamily-55d8f6bf86fe.json";
const express = require("express");
const app = express();
//admin.initializeApp();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
  apiKey: "AIzaSyCuUVzM7CwJ0QEQ4OvvKc06nJ8vIn0ylC0",
  authDomain: "socialfamily-9d867.firebaseapp.com",
  databaseURL: "https://socialfamily-9d867.firebaseio.com",
  projectId: "socialfamily-9d867",
  storageBucket: "socialfamily-9d867.appspot.com",
  messagingSenderId: "937726381992",
  appId: "1:937726381992:web:32641886841f7b7a9e979d",
  measurementId: "G-C0KTTPMMT4"
};

const db = admin.firestore();

const firebase = require("firebase");

firebase.initializeApp(firebaseConfig);

/* VIEW ALL POSTS ROUTE */

app.get("/posts", (req, res) => {
  db.collection("posts")
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

/* CREATE POST ROUTE */

app.post("/post", (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  db.collection("posts")
    .add(newPost)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

/* SIGN UP ROUTE */

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // TODO, validate Data

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "This Username already exists" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error();
      if (err.code === "auth/email-already-in-use") {
        return res
          .status(400)
          .json({ email: "This email is already registered to another user." });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.https.onRequest(app);
