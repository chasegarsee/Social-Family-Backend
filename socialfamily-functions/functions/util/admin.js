const admin = require("firebase-admin");
const serviceAccount = "../socialfamily-55d8f6bf86fe.json";
//admin.initializeApp();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
