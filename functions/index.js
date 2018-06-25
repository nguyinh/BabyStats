const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  // Send response as HTML
  response.send("Hello from Firebase!");
});

// Listen for any change on document `marie` in collection `users`
exports.actionOnDatabase = functions.firestore
  .document('players/{playerId}').onCreate((change, context) => {
    // console.log(playerId);
    admin.firestore()
      .collection("players")
      .doc('player3')
      .get()
      .then((document) => {
        console.log(document.id + ': ' + document.data());
        return;
      })
      .catch(error => {
        console.log('error: ' + error);
        return;
      });
    console.log('Player created');
    return;
  });