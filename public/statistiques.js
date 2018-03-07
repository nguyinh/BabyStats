// Initialize Cloud Firestore through Firebase
// Script.js avec set : ajouter à la base de données
if(window.innerHeight > window.innerWidth){
    alert("Passez en mode paysage!");
}

// window.addEventListener("orientationchange", function() {
//     console.log("the orientation of the device is now " + screen.orientation.angle);
//     if(screen.orientation.angle==90){
//     }
//     else if (screen.orientation.angle==0){
//     }
// });


// Déclaration de la base de données
var db = firebase.firestore();
var matches
var players = {}
var names = []
var total_goals = []
var total_gamelles = []
var gamelles_per_play = []
var number_of_plays = []
var goals_per_play = []
var goals_last_play = []
var gamelles_last_play = []
var names_last_play = []
var total_betray = []
var betray_per_play = []
var betray_last_play = []
var total_wins = []
var total_losses = []
var ratio_win = []
var ratio_loss = []
var test = []

function compareNombres(a, b){
  return a[0] - b[0]
}




// Récupération des matches et ré-organisation par ordre croissant
db.collection("matches").orderBy("number").get().then(function(querySnapshot) {
  var data = querySnapshot.docs.map(function (documentSnapshot) {
  return documentSnapshot.data();
});

// Avoir les statistiques descriptives à partir du match nº18 par joueur
for(i=18; i<data.length; i++){

if (players.hasOwnProperty(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))){
    players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))].goals += data[i].player1_goals
    players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))].gamelles += data[i].player1_gamelles
    players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))].betray += data[i].player1_betray
    total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player1_goals
    total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player1_gamelles
    total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player1_betray

    if (data[i].score1 == 10){
    total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }
    else {
    total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }

    number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] += 1

    goals_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
    gamelles_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
    betray_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
    ratio_win[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
    ratio_loss[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]

}

    else {

        players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))] = {}
        players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))].goals = data[i].player1_goals
        players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))].gamelles = data[i].player1_gamelles
        players[String(data[i].player1.replace(/ /g,"_").replace(/\./g,''))].betray = data[i].player1_betray
        total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_goals
        total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_gamelles
        names.push(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')));
        number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = 1
        goals_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
        gamelles_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
        total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_betray
        betray_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]

        if (data[i].score1 == 10){
        total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = 1
        total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = 0
        }
        else {
        total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = 0
        total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = 1
        }
        ratio_win[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]
        ratio_loss[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))]

    }

if (players.hasOwnProperty(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))){
    players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))].goals += data[i].player2_goals
    players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))].gamelles += data[i].player2_gamelles
    players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))].betray += data[i].player2_betray
    total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player2_goals
    total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player2_gamelles
    number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] += 1
    goals_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]
    gamelles_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]
    total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player2_betray
    betray_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]

    if (data[i].score1 == 10){
    total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }
    else {
    total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }

    ratio_win[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]
    ratio_loss[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]

}
    else {
        players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))] = {}
        players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))].goals = data[i].player2_goals
        players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))].gamelles = data[i].player2_gamelles
        players[String(data[i].player2.replace(/ /g,"_").replace(/\./g,''))].betray = data[i].player2_betray
        total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_goals
        total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_gamelles
        names.push(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')));
        number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = 1
        goals_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]
        gamelles_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]
        total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_betray
        betray_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]

        if (data[i].score1 == 10){
        total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = 1
        total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = 0
        }
        else {
        total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = 1
        total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = 0
        }

        ratio_win[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]
        ratio_loss[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))]

    }

if (players.hasOwnProperty(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))){
    players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))].goals += data[i].player3_goals
    players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))].gamelles += data[i].player3_gamelles
    players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))].betray += data[i].player3_betray
    total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player3_goals
    total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player3_gamelles
    number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] += 1
    goals_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]
    gamelles_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]
    total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player3_betray
    betray_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]

    if (data[i].score1 == 10){
    total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }
    else {
    total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }

    ratio_win[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]
    ratio_loss[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]

}
    else {
        players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))] = {}
        players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))].goals = data[i].player3_goals
        players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))].gamelles = data[i].player3_gamelles
        players[String(data[i].player3.replace(/ /g,"_").replace(/\./g,''))].betray = data[i].player3_betray
        total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_goals
        total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_gamelles
        names.push(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')));
        number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = 1
        goals_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]
        gamelles_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]
        total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_betray
        betray_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]

        if (data[i].score1 == 10){
        total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = 0
        total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = 1
        }
        else {
        total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = 1
        total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = 0
        }

        ratio_win[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]
        ratio_loss[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))]

    }

if (players.hasOwnProperty(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))){
    players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))].goals += data[i].player4_goals
    players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))].gamelles += data[i].player4_gamelles
    players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))].betray += data[i].player4_betray
    total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player4_goals
    total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player4_gamelles
    number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] += 1
    goals_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]
    gamelles_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]
    total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] += data[i].player4_betray
    betray_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]

    if (data[i].score1 == 10){
    total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }
    else {
    total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] += 1
    }

    ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]
    ratio_loss[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]

}
    else {
        players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))] = {}
        players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))].goals = data[i].player4_goals
        players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))].gamelles = data[i].player4_gamelles
        players[String(data[i].player4.replace(/ /g,"_").replace(/\./g,''))].betray = data[i].player4_betray
        total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_goals
        total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_gamelles
        names.push(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')));
        number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = 1
        goals_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]
        gamelles_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]
        total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_betray
        betray_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]

        if (data[i].score1 == 10){
        total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = 1
        total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = 0
        }
        else {
        total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = 0
        total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = 1
        }

        ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]
        ratio_loss[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]/number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))]

    }

    if (i==data.length-1){
        names_last_play.push(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')));
        goals_last_play[names_last_play.indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_goals
        gamelles_last_play[names_last_play.indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_gamelles
        betray_last_play[names_last_play.indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_betray

        names_last_play.push(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')));
        goals_last_play[names_last_play.indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_goals
        gamelles_last_play[names_last_play.indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_gamelles
        betray_last_play[names_last_play.indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_betray



        names_last_play.push(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')));
        goals_last_play[names_last_play.indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_goals
        gamelles_last_play[names_last_play.indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_gamelles
        betray_last_play[names_last_play.indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_betray

        names_last_play.push(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')));
        goals_last_play[names_last_play.indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_goals
        gamelles_last_play[names_last_play.indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_gamelles
        betray_last_play[names_last_play.indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_betray
    }
console.log(names_last_play)
console.log(goals_last_play)

}
// console.log(goals_last_play)
// console.log(total_goals)
// console.log(names)
// console.log(number_of_plays)
// console.log(goals_per_play)


// Trois meilleurs joueurs sur le plan du ratio
var sort_ratio_win = []
for (j = 0; j<names.length; j++){
    var temp = []
    temp.push(ratio_win[j])
    temp.push(names[j])
    sort_ratio_win.push(temp)
    temp = []
}
sort_ratio_win.sort(compareNombres).reverse()
// console.log(sort_ratio_win)
var three_best_players = []
var three_best_ratios = []
for (j = 0; j<3; j++){
    three_best_players.push(sort_ratio_win[j][1])
    three_best_ratios.push(sort_ratio_win[j][0])
}
// console.log(three_best_players)
var best_player_html = document.getElementById("best_player")
var second_best_player_html = document.getElementById("second_best_player")
var third_best_player_html = document.getElementById("third_best_player")
best_player_html.innerHTML = three_best_players[0] + "\r" + three_best_ratios[0].toPrecision(2)
best_player_html.style.fontWeight = 'bold';
best_player_html.insertAdjacentHTML('beforeend', "<p><i class=\"em em-first_place_medal\"></i> </p>");
second_best_player_html.innerHTML = three_best_players[1]  + "\r" + three_best_ratios[1].toPrecision(2)
second_best_player_html.style.fontWeight = 'bold';
second_best_player_html.insertAdjacentHTML('beforeend', "<p><i class=\"em em-second_place_medal\"></i> </p>");
third_best_player_html.innerHTML = three_best_players[2] + "\r" + three_best_ratios[2].toPrecision(2)
third_best_player_html.style.fontWeight = 'bold';
third_best_player_html.insertAdjacentHTML('beforeend', "<p><i class=\"em em-third_place_medal\"></i> </p>");




// Trois meilleurs joueurs sur le plan du nombre de victoires
var sort_number_win = []
for (j = 0; j<names.length; j++){
    var temp = []
    temp.push(('0' + total_wins[j]).slice(-2))
    temp.push(names[j])
    sort_number_win.push(temp)
    temp = []
}
console.log(sort_number_win)
sort_number_win.sort(compareNombres).reverse()
console.log(sort_number_win)
// console.log(sort_ratio_win)
var three_best_players_wins = []
var three_best_number_wins = []
for (j = 0; j<3; j++){
    three_best_players_wins.push(sort_number_win[j][1])
    three_best_number_wins.push(sort_number_win[j][0])
}

var best_player_html_wins = document.getElementById("best_player_wins")
var second_best_player_html_wins = document.getElementById("second_best_player_wins")
var third_best_player_html_wins = document.getElementById("third_best_player_wins")
best_player_html_wins.innerHTML = three_best_players_wins[0] + "\r" + three_best_number_wins[0]
best_player_html_wins.style.fontWeight = 'bold';
best_player_html_wins.insertAdjacentHTML('beforeend', "<p><i class=\"em em-first_place_medal\"></i> </p>");
second_best_player_html_wins.innerHTML = three_best_players_wins[1]  + "\r" + three_best_number_wins[1]
second_best_player_html_wins.style.fontWeight = 'bold';
second_best_player_html_wins.insertAdjacentHTML('beforeend', "<p><i class=\"em em-second_place_medal\"></i> </p>");
third_best_player_html_wins.innerHTML = three_best_players_wins[2]  + "\r" + three_best_number_wins[2]
third_best_player_html_wins.style.fontWeight = 'bold';
third_best_player_html_wins.insertAdjacentHTML('beforeend', "<p><i class=\"em em-third_place_medal\"></i> </p>");

// Trois meilleurs joueurs sur le plan du nombre de buts



var sort_number_goals = []
for (j = 0; j<names.length; j++){
    var temp = []
    var char
    temp.push(total_goals[j])
    temp.push(names[j])
    sort_number_goals.push(temp)
    temp = []
}
sort_number_goals.sort(compareNombres).reverse()
// console.log(sort_number_goals)
console.log(sort_number_goals)
// console.log(sort_ratio_win)
var three_best_players_goals = []
var three_best_number_goals = []
for (j = 0; j<3; j++){
    three_best_players_goals.push(sort_number_goals[j][1])
    three_best_number_goals.push(sort_number_goals[j][0])
}

var best_player_html_goals = document.getElementById("best_player_goals")
var second_best_player_html_goals = document.getElementById("second_best_player_goals")
var third_best_player_html_goals = document.getElementById("third_best_player_goals")
best_player_html_goals.innerHTML = three_best_players_goals[0]   + "\r" + three_best_number_goals[0]
best_player_html_goals.style.fontWeight = 'bold';
best_player_html_goals.insertAdjacentHTML('beforeend', "<p><i class=\"em em-first_place_medal\"></i> </p>");
second_best_player_html_goals.innerHTML = three_best_players_goals[1] + "\r" + three_best_number_goals[1]
second_best_player_html_goals.style.fontWeight = 'bold';
second_best_player_html_goals.insertAdjacentHTML('beforeend', "<p><i class=\"em em-second_place_medal\"></i> </p>");
third_best_player_html_goals.innerHTML = three_best_players_wins[2] + "\r" + three_best_number_goals[2]
third_best_player_html_goals.style.fontWeight = 'bold';
third_best_player_html_goals.insertAdjacentHTML('beforeend', "<p><i class=\"em em-third_place_medal\"></i> </p>");







// Diagramme en bâton des buts totaux
var ctx_total_goals = document.getElementById("chartTotalGoals").getContext('2d');
ctx_total_goals.height = 1;
var chartTotalGoals = new Chart(ctx_total_goals, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label : 'Total Buts',
            data: total_goals,
            borderWidth: 1,
            backgroundColor: 'rgb(255, 99, 132)'
        },
        {
            label : 'Total Gamelles',
            data: total_gamelles,
            borderWidth: 1,
            backgroundColor: 'rgb(54, 162, 235)'
        },
        {
            label : 'Total Contre Son Camp',
            data: total_betray,
            borderWidth: 1,
            backgroundColor: 'rgb(54, 80, 235)'
        }]
    },
    options: {
        legend: {
            display: true
         },
         tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxRotation: 90,
                        minRotation: 0
                    }
                }]
        },

        title: {
            display: true,
            text: 'Statistiques sur l\'ensemble des matches'
        }
    },
});

// Diagramme en bâton du nombre de matches joués
var ctx_number_of_plays = document.getElementById("chartNumberofPlays").getContext('2d');
var chartNumberofPlays = new Chart(ctx_number_of_plays, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label : 'Nombre de matches joués',
            data: number_of_plays,
            borderWidth: 1,
            backgroundColor: 'rgb(255, 99, 132)'
        }]
    },
    options: {
        legend: {
            display: false
         },
         tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0
                    }
                }]
        },

        title: {
            display: true,
            text: 'Nombre de matches joués par joueur'
        }
    },
});

// Diagramme en bâton du nombre de buts par match par joueur
var ctx_goals_per_play = document.getElementById("chartGoalsperPlay").getContext('2d');
var chartGoalsperPlay = new Chart(ctx_goals_per_play, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label : 'Buts/Match',
            data: goals_per_play,
            borderWidth: 1,
            backgroundColor: 'rgb(255, 99, 132)'
        },
        {
            label : 'Gamelles/Match',
            data: gamelles_per_play,
            borderWidth: 1,
            backgroundColor: 'rgb(54, 162, 235)'
        },
        {
            label : 'Contre Son Camp/Match',
            data: betray_per_play,
            borderWidth: 1,
            backgroundColor: 'rgb(54, 80, 235)'
        }]
    },
    options: {
        legend: {
            display: true
         },
         tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0
                    }
                }]
        },

        title: {
            display: true,
            text: 'Statistiques par match et par joueur'
        }
    },
});

// Diagramme en bâton du nombre de buts au dernier match
var ctx_goals_last_play = document.getElementById("chartGoalslastPlay").getContext('2d');
var chartGoalslastPlay = new Chart(ctx_goals_last_play, {
    type: 'bar',
    data: {
        labels: names_last_play,
        datasets: [{
            label : 'Buts',
            data: goals_last_play,
            borderWidth: 1,
            backgroundColor: 'rgb(255, 99, 132)'
        },
        {
            label : 'Gamelles',
            data: gamelles_last_play,
            borderWidth: 1,
            backgroundColor: 'rgb(54, 162, 235)'
        },
        {
            label : 'Contre Son Camp',
            data: betray_last_play,
            borderWidth: 1,
            backgroundColor: 'rgb(54, 80, 235)'
        }]
    },
    options: {
        legend: {
            display: true
         },
         tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0
                    }
                }]
        },

        title: {
            display: true,
            text: 'Statistiques dernier match'
        }
    },
});


// Diagramme en bâton du nombre de perdus/gagnés
var ctx_number_of_wins = document.getElementById("chartNumberofWins").getContext('2d');
var chartNumberofWins = new Chart(ctx_number_of_wins, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label : 'Victoires',
            data: total_wins,
            borderWidth: 1,
            backgroundColor:'rgb(255, 99, 132'
        },
        {
            label : 'Défaites',
            data: total_losses,
            borderWidth: 1,
            backgroundColor:'rgb(54, 80, 235)'
        }]
    },
    options: {
        legend: {
            display: true
         },
         tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0
                    }
                }]
        },

        title: {
            display: true,
            text: 'Victoires et Défaites'
        }
    },
});


// Diagramme du ratio gagné/perdu
var ctx_ratio_win_loss = document.getElementById("chartRatioWinLoss").getContext('2d');
var chartRatioWinLoss = new Chart(ctx_ratio_win_loss, {
    type: 'bar',
    data: {
        labels: names,
        datasets: [{
            label : 'Ratio Victoires-Défaites',
            data: ratio_win,
            borderWidth: 1,
            backgroundColor:'rgb(255, 99, 132)'
        }]
    },
    options: {
        legend: {
            display: false
         },
         tooltips: {
            enabled: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0
                    }
                }]
        },

        title: {
            display: true,
            text: 'Ratio Victoires-Défaites'
        }
    },
});





});





// Ajouter des choses à la base de données
// db.collection("players_jeremy")
//     .doc("player1")
//     .set({username: "test"});

// Comment faire rentrer des variables dans le code R ?
// ocpu.seturl("//public.opencpu.org/ocpu/library/base/R")
// var code_R = $("#code_R").load("test.txt", function() {
//   // console.log(code_R.innerHTML);
// })[0];
//
// var mysnippet = new ocpu.Snippet("");
// var req = ocpu.call("identity", {
//   "x": mysnippet
// }, function(session) {
//   session.getConsole(function(outtxt) {
//     $("#output").text(outtxt);
//   });
// });


//because identity is in base


//document.getElementbyId("submitbutton").addEventListener("click", function {})



  //if R returns an error, alert the error message
  // req.fail(function() {
  //   alert("Server error: " + req.responseText);
  // });
  //
  // req.always(function() {
  //   $("button").removeAttr("disabled");
  // });

  // setTimeout(function(){  }, 5000);
