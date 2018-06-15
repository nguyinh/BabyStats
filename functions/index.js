const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();
// admin.initializeApp({
//     apiKey: "AIzaSyC9YNHO1_eQOfgSQp5IifQj2fzrf5u3Hik",
//     authDomain: "babystats-df22b.firebaseapp.com",
//     databaseURL: "https://babystats-df22b.firebaseio.com",
//     projectId: "babystats-df22b",
//     storageBucket: "babystats-df22b.appspot.com",
//     messagingSenderId: "892281132936"
// });

// const db = admin.firestore();
// .collection('messages').add({original: original}).then(writeResult => {
//     // write is complete here
// });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
  // return admin.firestore().collection('players').doc.add({
  //   original: 'bijour'
  // }).then((writeResult) => {
  //   return;
  // });
});

// Listen for any change on document `marie` in collection `users`
exports.actionOnDatabase = functions.firestore
  .document('players/{playerId}').onCreate((change, context) => {
    // console.log(playerId);
    // admin.firestore().collection("players")
    //   .doc('player35')
    //   .set({
    //     name: "Florent",
    //     surname: "test"
    //   })
    //   .then(() => {
    //     console.log('Database write successful');
    //     return;
    //   })
    //   .catch(error => {
    //     console.log('error: ' + error);
    //     return;
    //   });
    console.log('Player created');
    // console.log(change);
    // console.log(context);
  });
