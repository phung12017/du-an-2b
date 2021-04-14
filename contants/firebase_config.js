var admin = require("firebase-admin");

var serviceAccount = require("./hexia-1f113-firebase-adminsdk-4zfdq-f0e81c147c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hexia-1f113-default-rtdb.firebaseio.com"
}); 

module.exports.admin = admin