// TO-DO : Clean ce petit code
// Statistiques par équipe
// Intégrer le shuffle-elo
// Courbe de progression de l'ELO en fonction du temps
// Graphiques avec joueurs au choix : systeme de dropdown avec choix multiple

// User authentication
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('profile_name').innerHTML = '<img id="profile_picture" alt="Photo" src="../blank_profile.png" style="width: 2rem; height:2rem; border-radius: 50%;" class="mr-2">' + user.displayName
        document.getElementById('profile_picture').src = (user.photoURL != null ? user.photoURL : "../blank_profile.png");
    }
});


// Fonction de classement
function compareNombres(a, b) {
    return a[0] - b[0];
}

// Checkbox si l'on souhaite les statistiques par équipe ou par joueur
var checkedValue = $('.ios-toggle:checked').val();
if (String(checkedValue) == "on") {
    document.getElementById("elo").style.display = "none"
    document.getElementById("elo_team").style.display = "inline-table"
} else if (String(checkedValue) != "on") {
    document.getElementById("elo").style.display = "inline-table"
    document.getElementById("elo_team").style.display = "none"
}

$('.ios-toggle:checked').on('click', function() {
    var checkedValue = $('.ios-toggle:checked').val();
    console.log(checkedValue)
    if (String(checkedValue) == "on") {
        document.getElementById("elo").style.display = "none"
        document.getElementById("elo_team").style.display = "inline-table"
    } else if (String(checkedValue) != "on") {
        console.log(checkedValue)
        document.getElementById("elo").style.display = "inline-table"
        document.getElementById("elo_team").style.display = "none"
    }
});


// Déclaration de la base de données
var db = firebase.firestore();

// Déclaration de variables
$('#demolist2 li').on('click', function() {
    selected_season = "season" + $(this).text().split(" ")[1]
    statistics(selected_season)
});

// Statistiques s'affichent automatiquement sur la dernière saison
statistics('season2')







// Liste déroulante des saisons

function statistics(selected_season) {

    // Initialisation des variables
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
    var start = 0
    var elo_over_time = {}

    if (selected_season == "season1") {
        start = 18;
    } else if (selected_season != "season1") {
        start = 0;
    }

    // Statistiques par joueur
    // Récupération des matches selon la saison demandée
    db.collection("matches").where("season", "==", selected_season).orderBy("number").get().then(function(querySnapshot) {
        var data = querySnapshot.docs.map(function(documentSnapshot) {
            return documentSnapshot.data();
        });

        // Avoir les statistiques descriptives à partir du match nº18 par joueur
        for (i = start; i < data.length; i++) {
            // console.log(i, data[i].player1, data[i].player1_goals, data[i].player2, data[i].player2_goals, data[i].player3, data[i].player3_goals, data[i].player4, data[i].player4_goals)

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
                    // console.log([i, data[i].player1, total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]])
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
                elo_over_time[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))] = {}
                elo_over_time[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo = []

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
                    // console.log([i, data[i].player1, total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]])

                    total_losses[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 0
                } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                    total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = 0
                    // console.log([i, data[i].player1, total_wins[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))]])

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
                    // console.log([i, data[i].player2, total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]])

                } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                    total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] += 1
                }

                ratio_win[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]
                ratio_loss[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]

            } else {
                elo_over_time[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))] = {}
                elo_over_time[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo = []

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
                    // console.log([i, data[i].player2, total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]])

                    total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 0
                } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                    total_losses[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 1
                    total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = 0
                    // console.log([i, data[i].player2, total_wins[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))]])

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
                    // console.log([i, data[i].player3, total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]])

                }

                ratio_win[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]
                ratio_loss[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]

            } else {
                elo_over_time[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))] = {}
                elo_over_time[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo = []


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
                    // console.log([i, data[i].player3, total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]])

                    total_losses[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 1
                } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                    total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = 1
                    // console.log([i, data[i].player3, total_wins[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))]])

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
                    // console.log([i, data[i].player4, total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]])

                }

                ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
                ratio_loss[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]

            } else {
                elo_over_time[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))] = {}
                elo_over_time[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo = []

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
                    // console.log([i, data[i].player4, total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]])

                } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                    total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 0
                    total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = 1
                    // console.log([i, data[i].player4, total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]])

                }

                ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_wins[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]
                ratio_loss[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = total_losses[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] / number_of_plays[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))]

            }

            // console.log(i, data[i].player1, ratio_win[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))],
            // data[i].player2, ratio_win[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))],
            // data[i].player3, ratio_win[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))],
            // data[i].player4, ratio_win[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))])

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

            // Dernier ELO
            elo[Object.keys(players).indexOf(String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo
            elo[Object.keys(players).indexOf(String(data[i].player2.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo
            elo[Object.keys(players).indexOf(String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo
            elo[Object.keys(players).indexOf(String(data[i].player4.replace(/ /g, "_").replace(/\./g, '')))] = players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo

            // Stockage de l'ELO par match
            elo_over_time[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo.push(players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo)
            elo_over_time[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo.push(players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo)
            elo_over_time[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo.push(players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo)
            elo_over_time[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo.push(players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo)
            // console.log(elo_over_time)

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

                // console.log(i + ", " + "TEAM1 :" + data[i].player1 + ", " + data[i].player2 + ", " +
                // "TEAM2 :" + data[i].player3 + ", " + data[i].player4 + ", " + ", " + "P1v2:" + Ea + ", " + "P2v1:" + Ec + ", " +
                // "SCORE_TEAM1 :" + data[i].score1 + ", " + "SCORE_TEAM2 :" + data[i].score2 + ", " + "ELO1:" + players[String(data[i].player1.replace(/ /g, "_").replace(/\./g, ''))].elo +
                // ", " + "ELO2:" + players[String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))].elo + ", " + "ELO3:" + players[String(data[i].player3.replace(/ /g, "_").replace(/\./g, ''))].elo +
                // ", " + "ELO4:" + players[String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))].elo)
            }
        }

        // Liste déroulante des joueurs affin d'afficher la progression de l'ELO
        var min = 0,
            max = names.length,
            select = document.getElementById('sel1');
        for (var i = min; i <= max; i++) {
            var opt = document.createElement('option');
            opt.value = String(names[i]).replace("_", " ");
            opt.innerHTML = String(names[i]).replace("_", " ");
            select.appendChild(opt);
        }

        // Code permettant d'obtenir la valeur du choix effectué dans la liste déroulante
        var liste_joueurs = document.getElementById("sel1");
        liste_joueurs.onchange = function() {
            var strUser = liste_joueurs.options[liste_joueurs.selectedIndex].value.replace(" ", "_");
            display_elo_evolution(strUser);
        }

        function display_elo_evolution(strUser) {
            console.log(elo_over_time[strUser].elo)
            var size = elo_over_time[strUser].elo.length
            indexes = [...Array(size).keys()]
            // Display ELO Evolution
            new Chart(document.getElementById("line"), {
                type: 'line',
                data: {
                    labels: indexes,
                    datasets: [{
                        label: strUser.replace("_", " "),
                        data: elo_over_time[strUser].elo,
                        borderColor: "#3e95cd",
                        fill: false
                    }]
                },
                options: {
                    legends: {
                        display: true
                    },
                    title: {
                        display: true,
                        text: 'Points'
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Points'
                            }
                        }],
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: '# Match'
                            }
                        }]
                    }
                }
            });
        }


        // Display ELO Classification
        var players_names = {}
        // Cette portion permet de ne sélectionner que les joueurs actifs
        db.collection("players").orderBy("name").get().then(function(querySnapshot) {
            var data = querySnapshot.docs.map(function(documentSnapshot) {
                return documentSnapshot.data();
            });
            // Avoir les statistiques descriptives à partir du match nº18 par joueur
            for (i = 0; i < data.length; i++) {
                if (players_names.hasOwnProperty(String(data[i].name.replace(/ /g, "_").replace(/\./g, '')))) {
                    players_names.isActive = data[i].isActive;
                } else players_names[String(data[i].name.replace(/ /g, "_").replace(/\./g, ''))] = {}
                players_names[String(data[i].name.replace(/ /g, "_").replace(/\./g, ''))].isActive = data[i].isActive;
            }
            var classification = document.getElementById("classification")
            classification.innerHTML = ""
            // Sort players according to their ELO
            var sort_elo = []
            for (j = 0; j < names.length; j++) {
                if (players_names.hasOwnProperty(names[j])) {

                    if (players_names[names[j]].isActive == true) {
                        var temp = []
                        temp.push(elo[j])
                        temp.push(names[j])
                        temp.push(number_of_plays[j])
                        temp.push(total_wins[j])
                        temp.push(total_losses[j])
                        temp.push(goals_per_play[j])
                        temp.push(gamelles_per_play[j])
                        temp.push(betray_per_play[j])

                        sort_elo.push(temp)
                        temp = []
                    }
                }
            }
            sort_elo.sort(compareNombres).reverse()
            for (i = 0; i < sort_elo.length; i++) {
                classification.insertAdjacentHTML('beforeend', '<tr><td class="rank">' + String(i + 1) + '</td><td class="team">' + '<button onClick="reply_click(this.id)" style="background:transparent; border:none; cursor:pointer;""   ' + '  id=' + String(sort_elo[i][1]) + '>' +
                    String(sort_elo[i][1]).replace("_", " ") + '</button>' + '</td><td class="points">' +
                    String(Math.round(sort_elo[i][0])) + '</td><td class="points">' + String(Math.round(sort_elo[i][2])) +
                    '</td><td class="points">' + '<font size="3" color="green">' + String(Math.round(sort_elo[i][3])) + '</font>' + '</td><td class="points">' + '<font size="3" color="red">' + String(Math.round(sort_elo[i][4])) + '</font>' + '</td><td class="points">' + '<font size="3" color="blue">' +
                    String(Math.round(sort_elo[i][5] * 10) / 10) + '</font>' + '</td><td class="points">' + '<font size="3" color="blue">' + String(Math.round(sort_elo[i][6] * 10) / 10) + '</font>' + '</td><td class="points">' + '<font size="3" color="blue">' + String(Math.round(sort_elo[i][7] * 10) / 10) +
                    '</font>' + '</td></tr>')
            }
        });
        return elo_over_time
    });


    //
    //
    //  Statistiques par équipe
    //
    //
    // Récupération des matches selon la saison demandée

    var team = {};
    var total_wins_team = [];
    var total_losses_team = [];
    var number_of_plays_team = [];
    var ratio_wins_team = [];
    var ratio_losses_team = [];
    var names_team = [];
    var elo_team = [];



    db.collection("matches").where("season", "==", selected_season).orderBy("number").get().then(function(querySnapshot) {
            var data = querySnapshot.docs.map(function(documentSnapshot) {
                return documentSnapshot.data();
            });
            for (i = 0; i < data.length; i++) {
                var team1 = [String(data[i].player1.replace(/ /g, "_").replace(/\./g, '')), String(data[i].player2.replace(/ /g, "_").replace(/\./g, ''))]
                var team2 = [String(data[i].player3.replace(/ /g, "_").replace(/\./g, '')), String(data[i].player4.replace(/ /g, "_").replace(/\./g, ''))]
                var player1 = team1.sort()[0]
                var player2 = team1.sort()[1]
                var player3 = team2.sort()[0]
                var player4 = team2.sort()[1]

                // Stock in temporary variables to compute ELOs
                // Team 1
                if (team.hasOwnProperty(player1 + " " + player2)) {
                    // Si le joueur existe déjà dans le vecteur
                    // Ajouter les buts, gamelles et csc marqués par ce joueur au nombre de buts existants
                    // Ajout au nombre de buts, gamelles et csc totaux
                    if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                        total_wins_team[Object.keys(team).indexOf(player1 + " " + player2)] += 1
                    } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                        total_losses_team[Object.keys(team).indexOf(player1 + " " + player2)] += 1
                    }

                    // Dans tous les cas augmenter le nombre de parties jouées de 1
                    number_of_plays_team[Object.keys(team).indexOf(player1 + " " + player2)] += 1

                    // K coefficient
                    // Si le nombre de parties jouées est supérieur à 30, K vaut 20
                    // Si l'ELO du joueur est supérieur à 2400, K vaut 10.
                    if (number_of_plays_team[Object.keys(team).indexOf(team[player1 + " " + player2])] > 30) {
                        team[Object.keys(team).indexOf(team[player1 + " " + player2])].k = 20
                    }
                    if (team[player1 + " " + player2].elo >= 2400) {
                        team[player1 + " " + player2].k = 10
                    }

                    // Ajout des statistiques par match
                    ratio_wins_team[Object.keys(team).indexOf(team[player1 + " " + player2])] = total_wins_team[Object.keys(team).indexOf([player1 + " " + player2])] / number_of_plays_team[Object.keys(team).indexOf(team[player1 + " " + player2])]
                    ratio_losses_team[Object.keys(team).indexOf(team[player1 + " " + player2])] = total_losses_team[Object.keys(team).indexOf(team[player1 + " " + player2])] / number_of_plays_team[Object.keys(team).indexOf(team[player1 + " " + player2])]

                } else {

                    // Si le joueur n'existait pas création du joueur
                    team[player1 + " " + player2] = {}


                    // Crediting an initial 1000-point ELO
                    // K initial vaut 40
                    team[player1 + " " + player2].elo = 1000;
                    team[player1 + " " + player2].k = 40;

                    // Création de tous les attributs, totaux et par match
                    names_team.push(player1 + " " + player2);
                    number_of_plays_team[Object.keys(team).indexOf(player1 + " " + player2)] = 1

                    // Si l'équipe du joueur a gagné ou perdu
                    if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                        total_wins_team[Object.keys(team).indexOf(player1 + " " + player2)] = 1
                        total_losses_team[Object.keys(team).indexOf(player1 + " " + player2)] = 0
                    } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                        total_wins_team[Object.keys(team).indexOf(player1 + " " + player2)] = 0
                        total_losses_team[Object.keys(team).indexOf(player1 + " " + player2)] = 1
                    }
                    ratio_wins_team[Object.keys(team).indexOf(team[player1 + " " + player2])] = total_wins_team[Object.keys(team).indexOf(team[player1 + " " + player2])] / number_of_plays_team[Object.keys(team).indexOf(team[player1 + " " + player2])]
                    ratio_losses_team[Object.keys(team).indexOf(team[player1 + " " + player2])] = total_wins_team[Object.keys(team).indexOf(team[player1 + " " + player2])] / number_of_plays_team[Object.keys(team).indexOf(team[player1 + " " + player2])]

                }



                // Team 2
                if (team.hasOwnProperty(player3 + " " + player4)) {
                    // Si le joueur existe déjà dans le vecteur
                    // Ajouter les buts, gamelles et csc marqués par ce joueur au nombre de buts existants
                    // Ajout au nombre de buts, gamelles et csc totaux
                    if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                        total_wins_team[Object.keys(team).indexOf(player3 + " " + player4)] += 1
                    } else if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                        total_losses_team[Object.keys(team).indexOf(player3 + " " + player4)] += 1
                    }

                    // Dans tous les cas augmenter le nombre de parties jouées de 1
                    number_of_plays_team[Object.keys(team).indexOf(player3 + " " + player4)] += 1

                    //K coefficient
                    //Si le nombre de parties jouées est supérieur à 30, K vaut 20
                    // Si l'ELO du joueur est supérieur à 2400, K vaut 10.
                    if (number_of_plays_team[Object.keys(team).indexOf(team[player3 + " " + player4])] > 30) {
                        team[Object.keys(team).indexOf(team[player3 + " " + player4])].k = 20
                    }
                    if (team[player3 + " " + player4].elo >= 2400) {
                        team[player3 + " " + player4].k = 10
                    }

                    // Ajout des statistiques par match
                    ratio_wins_team[Object.keys(team).indexOf(team[player3 + " " + player4])] = total_wins_team[Object.keys(team).indexOf([player3 + " " + player4])] / number_of_plays_team[Object.keys(team).indexOf(team[player3 + " " + player4])]
                    ratio_losses_team[Object.keys(team).indexOf(team[player3 + " " + player4])] = total_losses_team[Object.keys(team).indexOf(team[player3 + " " + player4])] / number_of_plays_team[Object.keys(team).indexOf(team[player3 + " " + player4])]

                } else {

                    // Si le joueur n'existait pas création du joueur
                    team[player3 + " " + player4] = {}


                    // Crediting an initial 1000-point ELO
                    // K initial vaut 40
                    team[player3 + " " + player4].elo = 1000;
                    team[player3 + " " + player4].k = 40;

                    // Création de tous les attributs, totaux et par match
                    names_team.push(player3 + " " + player4);
                    number_of_plays_team[Object.keys(team).indexOf(player3 + " " + player4)] = 1

                    // Si l'équipe du joueur a gagné ou perdu
                    if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                        total_wins_team[Object.keys(team).indexOf(player3 + " " + player4)] = 1
                        total_losses_team[Object.keys(team).indexOf(player3 + " " + player4)] = 0
                    } else if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                        total_wins_team[Object.keys(team).indexOf(player3 + " " + player4)] = 0
                        total_losses_team[Object.keys(team).indexOf(player3 + " " + player4)] = 1
                    }
                    ratio_wins_team[Object.keys(team).indexOf(team[player3 + " " + player4])] = total_wins_team[Object.keys(team).indexOf(team[player3 + " " + player4])] / number_of_plays_team[Object.keys(team).indexOf(team[player3 + " " + player4])]
                    ratio_losses_team[Object.keys(team).indexOf(team[player3 + " " + player4])] = total_wins_team[Object.keys(team).indexOf(team[player3 + " " + player4])] / number_of_plays_team[Object.keys(team).indexOf(team[player3 + " " + player4])]

                }
                // console.log(total_wins_team)
                // Computation of winning probabilities

                D_team1 = team[player1 + " " + player2].elo;
                D_team2 = team[player1 + " " + player2].elo;
                difference = D_team2 - D_team1;


                if (D_team2 - D_team1 > 400) {
                    difference = 400
                } else if (D_team2 - D_team1 < -400) {
                    difference = -400
                }

                power = difference / 400;

                // Expected scores
                Ea = 1 / (1 + Math.pow(10, power));
                Ec = 1 - Ea;

                Sa = 10 / (10 + Math.min(data[i].score1, data[i].score2));

                change_team1 = team[player1 + " " + player2].k * (Sa - Ea)
                change_team2 = team[player3 + " " + player4].k * (Sa - Ec)

                if (data[i].score1 == 10 || (data[i].score1 == 5 && data[i].score2 < 5)) {
                    team[player1 + " " + player2].elo += change_team1
                    team[player3 + " " + player4].elo -= change_team2
                } else if (data[i].score2 == 10 || (data[i].score2 == 5 && data[i].score1 < 5)) {
                    team[player1 + " " + player2].elo -= change_team1
                    team[player3 + " " + player4].elo += change_team2
                }
                elo_team[Object.keys(team).indexOf(player1 + " " + player2)] = team[player1 + " " + player2].elo
                elo_team[Object.keys(team).indexOf(player3 + " " + player4)] = team[player3 + " " + player4].elo

                // console.log(i + ", " + "TEAM1 :" + player1+"_"+player2 + ", " +
                // "TEAM2 :" + player3+"_"+player4 + ", " + "P1v2:" + Ea + ", " + "P2v1:" + Ec + ", " +
                // "SCORE_TEAM1 :" + data[i].score1 + ", " + "SCORE_TEAM2 :" + data[i].score2 + ", " + "change1: " + change_team1 +
                // ", " + "change2: " + change_team2 +
                // "ELO1:" + team[player1+" "+player2].elo +
                // ", " + "ELO2:" + team[player3+" "+player4].elo)
            }
            // Display ELO Classification
            var team_names = {}
            var classification = document.getElementById("classification_team")
            classification_team.innerHTML = ""
            // Sort players according to their ELO
            var sort_elo_team = []
            for (j = 0; j < names_team.length; j++) {
                var temp = []
                temp.push(elo_team[j])
                temp.push(names_team[j])
                temp.push(number_of_plays_team[j])
                temp.push(total_wins_team[j])
                temp.push(total_losses_team[j])
                sort_elo_team.push(temp)
                temp = []
            }
            sort_elo_team.sort(compareNombres).reverse()
            for (i = 0; i < sort_elo_team.length; i++) {
                classification_team.insertAdjacentHTML('beforeend', '<tr><td class="rank">' + String(i + 1) + '</td><td class="team">' + '<button onClick="reply_click(this.id)" style="background:transparent; border:none; cursor:pointer;""   ' + '  id=' + String(sort_elo_team[i][1]) + '>' + String(sort_elo_team[i][1]).replace(/ /g, ' & ').replace("_", " ").replace("_", " ") + '</button>' + '</td><td class="points">' + String(Math.round(sort_elo_team[i][0])) + '</td><td class="points">' + String(Math.round(sort_elo_team[i][2])) + '</td><td class="points">' + String(Math.round(sort_elo_team[i][3])) + '</td><td class="points">' + String(Math.round(sort_elo_team[i][4])) + '</td></tr>')
            }
        }

    )
};