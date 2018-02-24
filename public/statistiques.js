// Initialize Cloud Firestore through Firebase
// Script.js avec set : ajouter à la base de données
var display
if(window.innerHeight > window.innerWidth){
    alert("Please use Landscape!");
    display = false;
}
else {
    display = true
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





// Récupération des matches et ré-organisation par ordre croissant
db.collection("matches").orderBy("number").get().then(function(querySnapshot) {
  var data = querySnapshot.docs.map(function (documentSnapshot) {
  return documentSnapshot.data();
});

// Avoir le nombre de buts totaux par joueur
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

    }

    if (i==data.length-1){
        names_last_play.push(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')));
        names_last_play.push(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')));
        names_last_play.push(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')));
        names_last_play.push(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')));
        goals_last_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_goals
        goals_last_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_goals
        goals_last_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_goals
        goals_last_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_goals

        gamelles_last_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_gamelles
        gamelles_last_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_gamelles
        gamelles_last_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_gamelles
        gamelles_last_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_gamelles

        betray_last_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player1_betray
        betray_last_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player2_betray
        betray_last_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player3_betray
        betray_last_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g,"_").replace(/\./g,'')))] = data[i].player4_betray
    }

}
// console.log(goals_last_play)
// console.log(total_goals)
// console.log(names)
// console.log(number_of_plays)
// console.log(goals_per_play)




if (display == true){
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
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        {
            label : 'Total Gamelles',
            data: total_gamelles,
            borderWidth: 1,
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        },
        {
            label : 'Total Contre Son Camp',
            data: total_betray,
            borderWidth: 1,
            backgroundColor: 'rgba(54, 80, 235, 0.2)'
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
            label : names,
            data: number_of_plays,
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            display: false
         },
         tooltips: {
            enabled: false
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
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        {
            label : 'Gamelles/Match',
            data: gamelles_per_play,
            borderWidth: 1,
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        },
        {
            label : 'Contre Son Camp/Match',
            data: betray_per_play,
            borderWidth: 1,
            backgroundColor: 'rgba(54, 80, 235, 0.2)'
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
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        {
            label : 'Gamelles',
            data: gamelles_last_play,
            borderWidth: 1,
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        },
        {
            label : 'Contre Son Camp',
            data: betray_last_play,
            borderWidth: 1,
            backgroundColor: 'rgba(54, 80, 235, 0.2)'
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
            backgroundColor:'rgba(255, 99, 132, 0.2)'
        },
        {
            label : 'Défaites',
            data: total_losses,
            borderWidth: 1,
            backgroundColor:'rgba(54, 80, 235, 0.2)'
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
}





});





// Ajouter des choses à la base de données
// db.collection("players_jeremy")
//     .doc("player1")
//     .set({username: "test"});

// Comment faire rentrer des variables dans le code R ?
ocpu.seturl("//public.opencpu.org/ocpu/library/base/R")
var code_R = $("#code_R").load("test.txt", function() {
  // console.log(code_R.innerHTML);
})[0];

var mysnippet = new ocpu.Snippet("");
var req = ocpu.call("identity", {
  "x": mysnippet
}, function(session) {
  session.getConsole(function(outtxt) {
    $("#output").text(outtxt);
  });
});


//because identity is in base


//document.getElementbyId("submitbutton").addEventListener("click", function {})



  //if R returns an error, alert the error message
  req.fail(function() {
    alert("Server error: " + req.responseText);
  });

  req.always(function() {
    $("button").removeAttr("disabled");
  });

  // setTimeout(function(){  }, 5000);
