const functions = require("firebase-functions");
const express = require("express");
const app = express();

const { getAllPosts, createOnePost } = require("./handlers/posts");
const { signup, login, uploadImage } = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

/* CUSTOM VALIDATION */

/* === === === === === === === === === === === === === === */

/* POST ROUTES */
app.get("/posts", getAllPosts);
app.post("/post", FBAuth, createOnePost);

/* SIGNUP / LOGIN ROUTES */
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
