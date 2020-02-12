const { admin, db } = require("../util/admin");

exports.getAllPosts = (req, res) => {
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
};

/* CREATE A POST */

exports.createOnePost = (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }

  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0,
    imageUrl: ""
  };
  db.collection("posts")
    .add(newPost)
    .then(doc => {
      const resPost = newPost;
      resPost.postId = doc.id;
      res.json(resPost);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

/* CREATE A POST WITH AN IMAGE */
exports.createPostWithImage = (req, res) => {
  console.log(req.params.postId);
  // if (req.method !== "POST") {
  //   return res.status(400).json({ error: "Method not allowed" });
  // }

  // const newPost = {
  //   body: req.body.body,
  //   userHandle: req.user.handle,
  //   createdAt: new Date().toISOString(),
  //   userImage: req.user.imageUrl,
  //   likeCount: 0,
  //   commentCount: 0,
  //   imageUrl: ""
  // };

  // db.collection("posts")
  //   .add(newPost)
  //   .then(doc => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtention = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(Math.random() * 1000)}.${imageExtention}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket("socialfamily-9d867.appspot.com")
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(doc => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;

        db.doc(`/posts/${req.params.postId}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image Uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
    // .then(doc => {
    //   const resPost = newPost;
    //   resPost.postId = doc.id;

    // })
    // .catch(err => {
    //   console.error(err);
    //   return res.status(500).json({ error: err.code });
    // });
  });

  busboy.end(req.rawBody);
  //     });
};

/* GET SINGLE POST */
exports.getPost = (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      postData = doc.data();
      postData.postId = doc.id;
      const commentPromise = () =>
        new Promise(resolve =>
          setTimeout(
            resolve,
            0001,
            db
              .collection("comments")
              .orderBy("createdAt", "desc")
              .where("postId", "==", req.params.postId)
              .get()
          )
        );

      Promise.resolve()
        .then(() => {
          const commentProm = commentPromise();
          const likesValue = db
            .collection("likes")
            .where("postId", "==", req.params.postId)
            .get();
          return Promise.all([commentProm, likesValue]);
        })
        .then(([comments, likes]) => {
          postData.comments = [];
          postData.likes = [];
          comments.forEach(doc => {
            postData.comments.push(doc.data());
          });
          likes.forEach(doc => {
            postData.likes.push(doc.data());
          });
          return res.json(postData);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: "Something went wrong" });
        });
    });
};

/* COMMENT ON POST */

exports.commentOnPost = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Comment must not be empty" });
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  };

  db.doc(`posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Post not found" });
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

/* LIKE POST */
exports.likePost = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);

  let postDoc = db.doc(`/posts/${req.params.postId}`);

  let postData = {};

  postDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDoc.get();
      } else return status(404).json({ error: "Post not found" });
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            postId: req.params.postId,
            userHandle: req.user.handle
          })
          .then(() => {
            postData.likeCount++;
            return postDoc.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        return res.status(400).json({ error: "Post already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

/* UNLIKE POST */
exports.unlikePost = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);
  let postDoc = db.doc(`/posts/${req.params.postId}`);
  let postData = {};

  postDoc
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDoc.get();
      } else {
        return status(404).json({ error: "Post not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "This post has not been liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--;
            return postDoc.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deletePost = (req, res) => {
  const docToBeDel = db.doc(`/posts/${req.params.postId}`);
  docToBeDel
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return docToBeDel.delete();
      }
    })
    .then(() => {
      res.json({ message: "Post deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
