firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('profile_name').innerHTML = '<img id="profile_picture" alt="Photo" src="../blank_profile.png" style="width: 2rem; height:2rem; border-radius: 50%;" class="mr-2">' + user.displayName
        document.getElementById('profile_picture').src = (user.photoURL != null ? user.photoURL : "../blank_profile.png");
    }
});

// Initialize Cloud Firestore through Firebase
// Script.js avec set : ajouter à la base de données
// if (window.innerHeight > window.innerWidth) {
//     alert("Passez en mode paysage!");
// }


// TO-DO : matches en 5 buts
// TO-DO : Fix the ELO stuff


// Integer sorting function
function compareNombres(a, b) {
    return a[0] - b[0];
}


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
var elo = []

function compareNombres(a, b) {
    return a[0] - b[0]
}




// Récupération des matches et ré-organisation par ordre croissant
db.collection("matches").orderBy("number").get().then(function(querySnapshot) {
    var data = querySnapshot.docs.map(function(documentSnapshot) {
        return documentSnapshot.data();
    });

    // Avoir les statistiques descriptives à partir du match nº18 par joueur
    for (i = 18; i < data.length; i++) {

        // Stock in temporary variables to compute ELOs


        // Player 1
        if (players.hasOwnProperty(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))) {
            // Si le joueur existe déjà dans le vecteur
            // Ajouter les buts, gamelles et csc marqués par ce joueur au nombre de buts existants
            // Ajout au nombre de buts, gamelles et csc totaux
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].goals += data[i].player1_goals
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].gamelles += data[i].player1_gamelles
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].betray += data[i].player1_betray
            total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player1_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player1_gamelles
            total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player1_betray

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                // Si l'équipe 1 a marqué 10 buts
                // Ajouter une victoire à ce joueur
                total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] += 1
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                // Sinon ajouter une défaite à ce joueur
                total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] += 1
            }

            // Dans tous les cas augmenter le nombre de parties jouées de 1
            number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] += 1

            // K coefficient
            // Si le nombre de parties jouées est supérieur à 30, K vaut 20
            // Si l'ELO du joueur est supérieur à 2400, K vaut 10.
            if (number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] > 30) {
                players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].k = 20
            }
            if (players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo >= 2400) {
                players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].k = 10
            }

            // Ajout des statistiques par match
            goals_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            betray_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_win[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]

        } else {

            // Si le joueur n'existait pas création du joueur
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))] = {}
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].goals = data[i].player1_goals
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].gamelles = data[i].player1_gamelles
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].betray = data[i].player1_betray

            // Crediting an initial 1000-point ELO
            // K initial vaut 40
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo = 1000;
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].k = 40;

            // Création de tous les attributs, totaux et par match
            total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player1_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player1_gamelles
            names.push(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')));
            number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player1_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]

            // Si l'équipe du joueur a gagné ou perdu
            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 1
                total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 0
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 0
                total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 1
            }
            ratio_win[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]

        }

        // Player 2
        if (players.hasOwnProperty(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))) {
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].goals += data[i].player2_goals
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].gamelles += data[i].player2_gamelles
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].betray += data[i].player2_betray
            total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player2_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player2_gamelles
            number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player2_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]

            // K coefficient
            if (number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] > 30) {
                players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].k = 20
            }
            if (players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo >= 2400) {
                players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].k = 10
            }

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += 1
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += 1
            }

            ratio_win[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]

        } else {
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))] = {}
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].goals = data[i].player2_goals
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].gamelles = data[i].player2_gamelles
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].betray = data[i].player2_betray

            // Crediting an initial 1000-point ELO
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo = 1000
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].k = 40

            total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player2_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player2_gamelles
            names.push(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')));
            number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player2_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 1
                total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 0
            } else if (data[i].score1 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 1
                total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 0
            }

            ratio_win[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]

        }

        // Player 3
        if (players.hasOwnProperty(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))) {
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].goals += data[i].player3_goals
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].gamelles += data[i].player3_gamelles
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].betray += data[i].player3_betray
            total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player3_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player3_gamelles
            number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] += 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player3_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]

            // K coefficient
            if (number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] > 30) {
                players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].k = 20
            }
            if (players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo >= 2400) {
                players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].k = 10
            }

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] += 1
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] += 1
            }

            ratio_win[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]

        } else {
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))] = {}
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].goals = data[i].player3_goals
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].gamelles = data[i].player3_gamelles
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].betray = data[i].player3_betray

            // Crediting an initial 1000-point ELO
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo = 1000
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].k = 40

            total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player3_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player3_gamelles
            names.push(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')));
            number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player3_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 0
                total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 1
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 1
                total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 0
            }

            ratio_win[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]

        }

        // Player 4
        if (players.hasOwnProperty(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))) {
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].goals += data[i].player4_goals
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].gamelles += data[i].player4_gamelles
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].betray += data[i].player4_betray
            total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player4_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player4_gamelles
            number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] += 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] += data[i].player4_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]

            // K coefficient
            if (number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] > 30) {
                players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].k = 20
            }
            if (players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo >= 2400) {
                players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].k = 10
            }

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] += 1
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] += 1
            }

            ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]

        } else {
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))] = {}
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].goals = data[i].player4_goals
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].gamelles = data[i].player4_gamelles
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].betray = data[i].player4_betray

            // Crediting an initial 1000-point ELO
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo = 1000
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].k = 40

            total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player4_goals
            total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player4_gamelles
            names.push(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')));
            number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 1
            goals_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_goals[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
            gamelles_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_gamelles[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
            total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player4_betray
            betray_per_play[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_betray[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]

            if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 1
                total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 0
            } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 0
                total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 1
            }

            ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
            ratio_loss[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]

        }

        // Computation of winning probabilities

        D_team1 = (players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo + players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo) / 2;
        D_team2 = (players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo + players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo) / 2;
        difference = D_team2 - D_team1;


        if (D_team2 - D_team1 > 400) {
            difference = 400
        } else if (D_team2 - D_team1 < -400) {
            difference = -400
        }

        power = difference / 400;

        // Expected scores
        Ea = 1 / (1 + Math.pow(10, power));
        Eb = Ea;
        Ec = 1 - Ea;
        Ed = 1 - Ea;

        Sa = 10 / (10 + Math.min(data[i].score1, data[i].score2));

        change_player1 = players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].k * (Sa - Ea)
        change_player2 = players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].k * (Sa - Eb)
        change_player3 = players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].k * (Sa - Ec)
        change_player4 = players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].k * (Sa - Ed)

        console.log(i + ", " + "TEAM1 :" + data[i].player1 + ", " + data[i].player2 + ", " +
            "TEAM2 :" + data[i].player3 + ", " + data[i].player4 + ", " + ", " + "P1v2:" + Ea + ", " + "P2v1:" + Ec + ", " +
            "SCORE_TEAM1 :" + data[i].score1 + ", " + "SCORE_TEAM2 :" + data[i].score2 + ", " + "ELO1:" + players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo +
            ", " + "ELO2:" + players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo + ", " + "ELO3:" + players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo +
            ", " + "ELO4:" + players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo, ", " + "Sa :" + Sa + ", " +
            "K1:" + players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].k + ", " + "K2:" +
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].k + ", " + "K3:" + players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].k + ", " +
            "K4:" + players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].k)
        if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo += change_player1
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo += change_player2
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo -= change_player3
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo -= change_player4
        } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
            players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo -= change_player1
            players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo -= change_player2
            players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo += change_player3
            players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo += change_player4
        }
        elo[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo
        elo[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo
        elo[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo
        elo[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo

        console.log(i + ", " + "TEAM1 :" + data[i].player1 + ", " + data[i].player2 + ", " +
            "TEAM2 :" + data[i].player3 + ", " + data[i].player4 + ", " + ", " + "P1v2:" + Ea + ", " + "P2v1:" + Ec + ", " +
            "SCORE_TEAM1 :" + data[i].score1 + ", " + "SCORE_TEAM2 :" + data[i].score2 + ", " + "ELO1:" + players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo +
            ", " + "ELO2:" + players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo + ", " + "ELO3:" + players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo +
            ", " + "ELO4:" + players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo)


        // Statistics about last game
        if (i == data.length - 1) {
            names_last_play.push(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')));
            goals_last_play[names_last_play.indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player1_goals
            gamelles_last_play[names_last_play.indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player1_gamelles
            betray_last_play[names_last_play.indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player1_betray

            names_last_play.push(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')));
            goals_last_play[names_last_play.indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player2_goals
            gamelles_last_play[names_last_play.indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player2_gamelles
            betray_last_play[names_last_play.indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player2_betray



            names_last_play.push(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')));
            goals_last_play[names_last_play.indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player3_goals
            gamelles_last_play[names_last_play.indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player3_gamelles
            betray_last_play[names_last_play.indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player3_betray

            names_last_play.push(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')));
            goals_last_play[names_last_play.indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player4_goals
            gamelles_last_play[names_last_play.indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player4_gamelles
            betray_last_play[names_last_play.indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = data[i].player4_betray
        }
    }







    // Display ELO Classification
    var classification = document.getElementById("classification")

    // Sort players according to their ELO
    var sort_elo = []
    for (j = 0; j < names.length; j++) {
        var temp = []
        temp.push(elo[j])
        temp.push(names[j])
        sort_elo.push(temp)
        temp = []
    }
    sort_elo.sort(compareNombres).reverse()

    for (i = 0; i < sort_elo.length; i++) {
        classification.insertAdjacentHTML('beforeend', '<tr><td class="rank">' + String(i + 1) + '</td><td class="team">' + '<button onClick="reply_click(this.id)" style="background:transparent; border:none; cursor:pointer;""   ' + '  id=' + String(sort_elo[i][1]) + '>' + String(sort_elo[i][1]).replace("_", " ") + '</button>' + '</td><td class="points">' + String(Math.round(sort_elo[i][0])) + '</td></tr>')
    }

    // Trois meilleurs joueurs sur le plan du ratio
    var sort_ratio_win = []
    for (j = 0; j < names.length; j++) {
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
    for (j = 0; j < 3; j++) {
        three_best_players.push(sort_ratio_win[j][1])
        three_best_ratios.push(sort_ratio_win[j][0])
    }
    var best_player_html = document.getElementById("best_player")
    var second_best_player_html = document.getElementById("second_best_player")
    var third_best_player_html = document.getElementById("third_best_player")
    best_player_html.innerHTML = three_best_players[0] + "<br>" + three_best_ratios[0].toPrecision(2)
    best_player_html.style.fontWeight = 'bold';
    best_player_html.insertAdjacentHTML('beforeend', "<p><i class=\"em em-first_place_medal\"></i> </p>");
    second_best_player_html.innerHTML = three_best_players[1] + "<br>" + three_best_ratios[1].toPrecision(2)
    second_best_player_html.style.fontWeight = 'bold';
    second_best_player_html.insertAdjacentHTML('beforeend', "<p><i class=\"em em-second_place_medal\"></i> </p>");
    third_best_player_html.innerHTML = three_best_players[2] + "<br>" + three_best_ratios[2].toPrecision(2)
    third_best_player_html.style.fontWeight = 'bold';
    third_best_player_html.insertAdjacentHTML('beforeend', "<p><i class=\"em em-third_place_medal\"></i> </p>");

    // Trois meilleurs joueurs sur le plan du nombre de victoires
    var sort_number_win = []
    for (j = 0; j < names.length; j++) {
        var temp = []
        temp.push(('0' + total_wins[j]).slice(-2))
        temp.push(names[j])
        sort_number_win.push(temp)
        temp = []
    }
    sort_number_win.sort(compareNombres).reverse()
    // console.log(sort_ratio_win)
    var three_best_players_wins = []
    var three_best_number_wins = []
    for (j = 0; j < 3; j++) {
        three_best_players_wins.push(sort_number_win[j][1])
        three_best_number_wins.push(sort_number_win[j][0])
    }

    var best_player_html_wins = document.getElementById("best_player_wins")
    var second_best_player_html_wins = document.getElementById("second_best_player_wins")
    var third_best_player_html_wins = document.getElementById("third_best_player_wins")
    best_player_html_wins.innerHTML = three_best_players_wins[0] + "<br>" + three_best_number_wins[0]
    best_player_html_wins.style.fontWeight = 'bold';
    best_player_html_wins.insertAdjacentHTML('beforeend', "<p><i class=\"em em-first_place_medal\"></i> </p>");
    second_best_player_html_wins.innerHTML = three_best_players_wins[1] + "<br>" + three_best_number_wins[1]
    second_best_player_html_wins.style.fontWeight = 'bold';
    second_best_player_html_wins.insertAdjacentHTML('beforeend', "<p><i class=\"em em-second_place_medal\"></i> </p>");
    third_best_player_html_wins.innerHTML = three_best_players_wins[2] + "<br>" + three_best_number_wins[2]
    third_best_player_html_wins.style.fontWeight = 'bold';
    third_best_player_html_wins.insertAdjacentHTML('beforeend', "<p><i class=\"em em-third_place_medal\"></i> </p>");

    // Trois meilleurs joueurs sur le plan du nombre de buts



    var sort_number_goals = []
    for (j = 0; j < names.length; j++) {
        var temp = []
        var char
        temp.push(total_goals[j])
        temp.push(names[j])
        sort_number_goals.push(temp)
        temp = []
    }
    sort_number_goals.sort(compareNombres).reverse()
    // console.log(sort_number_goals)
    // console.log(sort_number_goals)
    // console.log(sort_ratio_win)
    var three_best_players_goals = []
    var three_best_number_goals = []
    for (j = 0; j < 3; j++) {
        three_best_players_goals.push(sort_number_goals[j][1])
        three_best_number_goals.push(sort_number_goals[j][0])
    }

    var best_player_html_goals = document.getElementById("best_player_goals")
    var second_best_player_html_goals = document.getElementById("second_best_player_goals")
    var third_best_player_html_goals = document.getElementById("third_best_player_goals")
    best_player_html_goals.innerHTML = three_best_players_goals[0] + "<br>" + three_best_number_goals[0]
    best_player_html_goals.style.fontWeight = 'bold';
    best_player_html_goals.insertAdjacentHTML('beforeend', "<p><i class=\"em em-first_place_medal\"></i> </p>");
    second_best_player_html_goals.innerHTML = three_best_players_goals[1] + "<br>" + three_best_number_goals[1]
    second_best_player_html_goals.style.fontWeight = 'bold';
    second_best_player_html_goals.insertAdjacentHTML('beforeend', "<p><i class=\"em em-second_place_medal\"></i> </p>");
    third_best_player_html_goals.innerHTML = three_best_players_wins[2] + "<br>" + three_best_number_goals[2]
    third_best_player_html_goals.style.fontWeight = 'bold';
    third_best_player_html_goals.insertAdjacentHTML('beforeend', "<p><i class=\"em em-third_place_medal\"></i> </p>");

    var GRAPH_HEIGHT_SIZE = 250;

    // Diagramme en bâton des buts totaux
    var ctx_total_goals = document.getElementById("chartTotalGoals");
    ctx_total_goals.height = GRAPH_HEIGHT_SIZE;
    var chartTotalGoals = new Chart(ctx_total_goals, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                    label: 'Total Buts',
                    data: total_goals,
                    borderWidth: 1,
                    backgroundColor: 'rgb(50, 205, 50)'
                },
                {
                    label: 'Total Gamelles',
                    data: total_gamelles,
                    borderWidth: 1,
                    backgroundColor: 'rgb(65, 105, 225)'
                },
                {
                    label: 'Total Contre Son Camp',
                    data: total_betray,
                    borderWidth: 1,
                    backgroundColor: 'rgb(255, 0, 0)'
                }
            ]
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
        }
    });

    // Diagramme en bâton du nombre de matches joués
    var ctx_number_of_plays = document.getElementById("chartNumberofPlays");
    ctx_number_of_plays.height = GRAPH_HEIGHT_SIZE;
    var chartNumberofPlays = new Chart(ctx_number_of_plays, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Nombre de matches joués',
                data: number_of_plays,
                borderWidth: 1,
                backgroundColor: 'rgb(65, 105, 225)'
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
    var ctx_goals_per_play = document.getElementById("chartGoalsperPlay");
    ctx_goals_per_play.height = GRAPH_HEIGHT_SIZE;
    var chartGoalsperPlay = new Chart(ctx_goals_per_play, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                    label: 'Buts/Match',
                    data: goals_per_play,
                    borderWidth: 1,
                    backgroundColor: 'rgb(50, 205, 50)'
                },
                {
                    label: 'Gamelles/Match',
                    data: gamelles_per_play,
                    borderWidth: 1,
                    backgroundColor: 'rgb(65, 105, 225)'
                },
                {
                    label: 'Contre Son Camp/Match',
                    data: betray_per_play,
                    borderWidth: 1,
                    backgroundColor: 'rgb(255, 0, 0)'
                }
            ]
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
    var ctx_goals_last_play = document.getElementById("chartGoalslastPlay");
    ctx_goals_last_play.height = GRAPH_HEIGHT_SIZE;
    var chartGoalslastPlay = new Chart(ctx_goals_last_play, {
        type: 'bar',
        data: {
            labels: names_last_play,
            datasets: [{
                    label: 'Buts',
                    data: goals_last_play,
                    borderWidth: 1,
                    backgroundColor: 'rgb(50, 205, 50)'
                },
                {
                    label: 'Gamelles',
                    data: gamelles_last_play,
                    borderWidth: 1,
                    backgroundColor: 'rgb(65, 105, 225)'
                },
                {
                    label: 'Contre Son Camp',
                    data: betray_last_play,
                    borderWidth: 1,
                    backgroundColor: 'rgb(255, 0, 0)'
                }
            ]
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
    var ctx_number_of_wins = document.getElementById("chartNumberofWins");
    ctx_number_of_wins.height = GRAPH_HEIGHT_SIZE;
    var chartNumberofWins = new Chart(ctx_number_of_wins, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                    label: 'Victoires',
                    data: total_wins,
                    borderWidth: 1,
                    backgroundColor: 'rgb(50, 205, 50)'
                },
                {
                    label: 'Défaites',
                    data: total_losses,
                    borderWidth: 1,
                    backgroundColor: 'rgb(255, 0, 0)'
                }
            ]
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
    var ctx_ratio_win_loss = document.getElementById("chartRatioWinLoss");
    ctx_ratio_win_loss.height = GRAPH_HEIGHT_SIZE;
    var chartRatioWinLoss = new Chart(ctx_ratio_win_loss, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Ratio Victoires-Défaites',
                data: ratio_win,
                borderWidth: 1,
                backgroundColor: 'rgb(65, 105, 225)'
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

function reply_click(clicked_id) {
    var index = names.indexOf(String(clicked_id));
    text = 'Ratio Victoire/Défaites : ' + String(ratio_win[index].toPrecision(3)) + "<br>"
    text = text + 'Gagnés : ' + String(total_wins[index]) + "<br>"
    text = text + 'Gagnés (% Total): ' + String(ratio_win[index].toPrecision(3)) + "<br>"
    text = text + 'Perdus : ' + String(total_losses[index]) + "<br>"
    text = text + 'Perdus (% Total): ' + String(ratio_loss[index].toPrecision(3)) + "<br>"
    text = text + 'Joués : ' + String(number_of_plays[index]) + "<br>"
    text = text + 'Buts (Total) : ' + String(total_goals[index]) + "<br>"
    text = text + 'Buts (/Match) : ' + String(goals_per_play[index].toPrecision(3)) + "<br>"
    text = text + 'Gamelles (/Match) : ' + String(gamelles_per_play[index].toPrecision(3)) + "<br>"
    text = text + 'CSC (/Match) : ' + String(betray_per_play[index].toPrecision(3)) + "<br>"

    swal({
        title: clicked_id.replace("_", " "),
        html: text,
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonClass: 'btn btn-success mr-1',
        confirmButtonText: 'OK',
    })
}



// document.getElementById('palmares').addEventListener('click', function() {
//     document.getElementById('ranking').style.display = "none";
//     document.getElementById('palmares_number_wins').style.display = "";
//     document.getElementById('best_player').style.display = "";
//     document.getElementById('second_best_player').style.display = "";
//     document.getElementById('third_best_player').style.display = "";
//
//     document.getElementById('palmares_ratio_wins').style.display = "";
//     document.getElementById('best_player_wins').style.display = "";
//     document.getElementById('second_best_player_wins').style.display = "";
//     document.getElementById('third_best_player_wins').style.display = "";
//
//     document.getElementById('palmares_meilleur_buteur').style.display = "";
//     document.getElementById('best_player_goals').style.display = "";
//     document.getElementById('second_best_player_goals').style.display = "";
//     document.getElementById('third_best_player_goals').style.display = "";
//
//
//     document.getElementById('chartNumberofPlays').style.display = "none";
//     document.getElementById('chartGoalslastPlay').style.display = "none";
//     document.getElementById('chartNumberofWins').style.display = "none";
//     document.getElementById('chartRatioWinLoss').style.display = "none";
//     document.getElementById('chartTotalGoals').style.display = "none";
//     document.getElementById('chartGoalsperPlay').style.display = "none";
// });
//
// document.getElementById('graphs').addEventListener('click', function() {
//     document.getElementById('ranking').style.display = "none";
//     document.getElementById('chartNumberofPlays').style.display = "";
//     document.getElementById('chartGoalslastPlay').style.display = "";
//     document.getElementById('chartNumberofWins').style.display = "";
//     document.getElementById('chartRatioWinLoss').style.display = "";
//     document.getElementById('chartTotalGoals').style.display = "";
//     document.getElementById('chartGoalsperPlay').style.display = "";
//
//
//     document.getElementById('palmares_number_wins').style.display = "none";
//     document.getElementById('best_player').style.display = "none";
//     document.getElementById('second_best_player').style.display = "none";
//     document.getElementById('third_best_player').style.display = "none";
//
//     document.getElementById('palmares_ratio_wins').style.display = "none";
//     document.getElementById('best_player_wins').style.display = "none";
//     document.getElementById('second_best_player_wins').style.display = "none";
//     document.getElementById('third_best_player_wins').style.display = "none";
//
//     document.getElementById('palmares_meilleur_buteur').style.display = "none";
//     document.getElementById('best_player_goals').style.display = "none";
//     document.getElementById('second_best_player_goals').style.display = "none";
//     document.getElementById('third_best_player_goals').style.display = "none";
// });
//
// document.getElementById('classement').addEventListener('click', function() {
//     document.getElementById('ranking').style.display = "";
//     document.getElementById('palmares_number_wins').style.display = "none";
//     document.getElementById('best_player').style.display = "none";
//     document.getElementById('second_best_player').style.display = "none";
//     document.getElementById('third_best_player').style.display = "none";
//
//     document.getElementById('palmares_ratio_wins').style.display = "none";
//     document.getElementById('best_player_wins').style.display = "none";
//     document.getElementById('second_best_player_wins').style.display = "none";
//     document.getElementById('third_best_player_wins').style.display = "none";
//
//     document.getElementById('palmares_meilleur_buteur').style.display = "none";
//     document.getElementById('best_player_goals').style.display = "none";
//     document.getElementById('second_best_player_goals').style.display = "none";
//     document.getElementById('third_best_player_goals').style.display = "none";
//
//     document.getElementById('chartNumberofPlays').style.display = "none";
//     document.getElementById('chartGoalslastPlay').style.display = "none";
//     document.getElementById('chartNumberofWins').style.display = "none";
//     document.getElementById('chartRatioWinLoss').style.display = "none";
//     document.getElementById('chartTotalGoals').style.display = "none";
//     document.getElementById('chartGoalsperPlay').style.display = "none";
// });









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