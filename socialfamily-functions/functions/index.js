const functions = require("firebase-functions");
const express = require("express");
const app = express();

const { getAllPosts, createOnePost, getPost } = require("./handlers/posts");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

/* CUSTOM VALIDATION */

/* === === === === === === === === === === === === === === */

/* POST ROUTES */
app.get("/posts", getAllPosts);
app.post("/post", FBAuth, createOnePost);
app.get("/post/:postId", getPost);
// Todo: Delete Post
// Todo: Like Post
// Todo: Unlike Post
// Todo: Comment on Post

/* SIGNUP / LOGIN ROUTES */
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
