var admin = require("firebase-admin");

var serviceAccount = require("./auth/pointsmax-auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pointsmax-cad35-default-rtdb.firebaseio.com"
});

const db = admin.database();
module.exports = db;