// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// User profil display
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('profile_name').innerHTML = '<img id="profile_picture" alt="Photo" src="res/blank_profile.png" style="width: 2rem; height:2rem; border-radius: 50%;" class="mr-2">' + user.displayName
        document.getElementById('profile_picture').src = (user.photoURL != null ? user.photoURL : "../res/blank_profile.png");
    } else {
        console.log("no user connected");
    }
});



var score1 = document.getElementById("score1");
var score2 = document.getElementById("score2");

var goalJ1 = document.getElementById("goalJ1score");
var goalJ2 = document.getElementById("goalJ2score");
var goalJ3 = document.getElementById("goalJ3score");
var goalJ4 = document.getElementById("goalJ4score");

var gamJ1 = document.getElementById("gamelleJ1score");
var gamJ2 = document.getElementById("gamelleJ2score");
var gamJ3 = document.getElementById("gamelleJ3score");
var gamJ4 = document.getElementById("gamelleJ4score");

var betrayJ1 = document.getElementById("betrayJ1score");
var betrayJ2 = document.getElementById("betrayJ2score");
var betrayJ3 = document.getElementById("betrayJ3score");
var betrayJ4 = document.getElementById("betrayJ4score");

var scores_indicators = [goalJ1, goalJ2, goalJ3, goalJ4, gamJ1, gamJ2, gamJ3, gamJ4, betrayJ1, betrayJ2, betrayJ3, betrayJ4];


// Cast string number to integer
function int(element) {
    return parseInt(element.innerHTML);
}

// Return if team score is maximum (10)
function isMax(element) {
    if (int(element) < 10)
        return false;
    else
        return true;
}

// Return if team score is minimum (-10)
function isMin(element) {
    if (int(element) > -10)
        return false;
    else
        return true;
}

// Return if player score is correct (>0)
function isCorrect(element) {
    if (int(element) > 0)
        return true;
    else
        return false;
}

// Add +1 to a score
function add(element) {
    element.innerHTML = int(element) + 1;
}

// Substract -1 to a score
function minus(element) {
    element.innerHTML = int(element) - 1;
}


// Contains all logic for score changes conditions
function updateScore(team, type, change) {
    switch (team) {
        // ----------------- PLAYER 1 -----------------
        case "J1":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(goalJ1);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(goalJ1)) {
                                minus(score1);
                                minus(goalJ1);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score2)) {
                                minus(score2);
                                add(gamJ1);
                            }
                            break;

                        case "-":
                            if (!isMax(score2) && isCorrect(gamJ1)) {
                                add(score2);
                                minus(gamJ1);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(betrayJ1);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(betrayJ1)) {
                                minus(score2);
                                minus(betrayJ1);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;

            // ----------------- PLAYER 2 -----------------
        case "J2":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(goalJ2);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(goalJ2)) {
                                minus(score1);
                                minus(goalJ2);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score2)) {
                                minus(score2);
                                add(gamJ2);
                            }
                            break;

                        case "-":
                            if (!isMax(score2) && isCorrect(gamJ2)) {
                                add(score2);
                                minus(gamJ2);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(betrayJ2);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(betrayJ2)) {
                                minus(score2);
                                minus(betrayJ2);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;


            // ----------------- PLAYER 3 -----------------
        case "J3":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(goalJ3);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(goalJ3)) {
                                minus(score2);
                                minus(goalJ3);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score1)) {
                                minus(score1);
                                add(gamJ3);
                            }
                            break;

                        case "-":
                            if (!isMax(score1) && isCorrect(gamJ3)) {
                                add(score1);
                                minus(gamJ3);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(betrayJ3);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(betrayJ3)) {
                                minus(score1);
                                minus(betrayJ3);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;

            // ----------------- PLAYER 4 -----------------
        case "J4":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(goalJ4);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(goalJ4)) {
                                minus(score2);
                                minus(goalJ4);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score1)) {
                                minus(score1);
                                add(gamJ4);
                            }
                            break;

                        case "-":
                            if (!isMax(score1) && isCorrect(gamJ4)) {
                                add(score1);
                                minus(gamJ4);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(betrayJ4);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(betrayJ4)) {
                                minus(score1);
                                minus(betrayJ4);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;

        default:
            break;

    }
}


// Add event listener on all buttons
var buttons = document.getElementsByTagName('button');
for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
        if (this.id.split("|")[0] == "validate_button")
            validate();
        else if (this.id.split("|")[0] == "random_button") {
            var playersNames = Array.from(document.getElementsByClassName('player_name'));
            var playersCount = 0;
            for (var name of playersNames) {
                if (name.innerHTML != '') {
                    playersCount++;
                }
            }
            if (playersCount == 2)
                return;
            // Get all choosen players
            var choosenPlayers = [
                [document.getElementById("player1_img").src, document.getElementById("player1_name").innerHTML],
                [document.getElementById("player2_img").src, document.getElementById("player2_name").innerHTML],
                [document.getElementById("player3_img").src, document.getElementById("player3_name").innerHTML],
                [document.getElementById("player4_img").src, document.getElementById("player4_name").innerHTML]
            ];

            function shuffle(array) {
                var currentIndex = array.length,
                    temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }

            // Shuffle and replace players
            choosenPlayers = shuffle(choosenPlayers);
            document.getElementById("player1_img").src = choosenPlayers[0][0];
            document.getElementById("player1_name").innerHTML = choosenPlayers[0][1];
            document.getElementById("player2_img").src = choosenPlayers[1][0];
            document.getElementById("player2_name").innerHTML = choosenPlayers[1][1];
            document.getElementById("player3_img").src = choosenPlayers[2][0];
            document.getElementById("player3_name").innerHTML = choosenPlayers[2][1];
            document.getElementById("player4_img").src = choosenPlayers[3][0];
            document.getElementById("player4_name").innerHTML = choosenPlayers[3][1];

            updateButtons();
        } else {
            updateScore(this.id.split("|")[0], this.id.split("|")[1], this.id.split("|")[2]);
            // Display random button if scores are at 0
            for (var n = 0; n < scores_indicators.length; n++) {
                if (scores_indicators[n].innerHTML != 0) {
                    document.getElementById('random_button').style.display = 'none';
                    break;
                }
                document.getElementById('random_button').style.display = 'block';
            }
        }
    });
};




function validate() {

    // Get all inputs
    var inputs = [
        document.getElementById("player1_placeholder"),
        document.getElementById("player2_placeholder"),
        document.getElementById("player3_placeholder"),
        document.getElementById("player4_placeholder")
    ];

    // Clear color for all inputs
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].querySelector('.player_name').classList.remove('invalid_player');
        document.getElementsByClassName("score_border").item(0).style.borderColor = "rgb(121, 121, 121)";
        document.getElementsByClassName("score_border").item(1).style.borderColor = "rgb(121, 121, 121)";
    }

    // Check for errors
    var errorFlag = false;
    if ((inputs[0].querySelector('.player_name').innerHTML == "" && inputs[1].querySelector('.player_name').innerHTML == "") ||
        (inputs[2].querySelector('.player_name').innerHTML == "" && inputs[3].querySelector('.player_name').innerHTML == "") ||
        ((int(score1) == 0) && (int(score2) == 0))) {
        // ((int(score1) == 10) && (int(score2) == 10)) ||
        // ((int(score1) != 10) && (int(score2) != 10))) {

        if ((inputs[0].querySelector('.player_name').innerHTML == "" && inputs[1].querySelector('.player_name').innerHTML == "")) {
            inputs[0].querySelector('.player_name').classList.add('invalid_player');
            inputs[1].querySelector('.player_name').classList.add('invalid_player');
        }
        // if (((int(score1) == 10) && (int(score2) == 10)) ||
        //     ((int(score1) != 10) && (int(score2) != 10))) {
        if ((int(score1) == 0) && (int(score2) == 0)) {
            document.getElementsByClassName("score_border").item(0).style.borderColor = "rgb(194, 57, 57)";
            document.getElementsByClassName("score_border").item(1).style.borderColor = "rgb(194, 57, 57)";
        }
        if ((inputs[2].querySelector('.player_name').innerHTML == "" && inputs[3].querySelector('.player_name').innerHTML == "")) {
            inputs[2].querySelector('.player_name').classList.add('invalid_player');
            inputs[3].querySelector('.player_name').classList.add('invalid_player');
        }

        // Exit method if error(s)
        errorFlag = true;
    }
    if (errorFlag)
        return;



    // Disable button while match not added
    document.getElementById("validate_button").disabled = true;
    document.getElementById("validate_button").innerHTML = "<i class=\"fas fa-circle-notch fa-spin\"></i>";


    // Get active season then publish match to database
    db.collection("seasons")
        .where("active", "==", true)
        .limit(1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // Create match object
                var reported_match = {
                    player1: inputs[0].querySelector('.player_name').innerHTML,
                    player2: inputs[1].querySelector('.player_name').innerHTML,
                    player3: inputs[2].querySelector('.player_name').innerHTML,
                    player4: inputs[3].querySelector('.player_name').innerHTML,
                    score1: int(score1),
                    score2: int(score2),
                    player1_goals: int(goalJ1),
                    player2_goals: int(goalJ2),
                    player3_goals: int(goalJ3),
                    player4_goals: int(goalJ4),
                    player1_gamelles: int(gamJ1),
                    player2_gamelles: int(gamJ2),
                    player3_gamelles: int(gamJ3),
                    player4_gamelles: int(gamJ4),
                    player1_betray: int(betrayJ1),
                    player2_betray: int(betrayJ2),
                    player3_betray: int(betrayJ3),
                    player4_betray: int(betrayJ4),
                    number: 0, // number and invert_number are used to sort data from database
                    invert_number: 0,
                    season: doc.id,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };


                // Publish to Database
                db.collection("matches")
                    .orderBy("number")
                    .get()
                    .then(function(documentSnapshots) {
                        // Get the last visible document (= last match played)
                        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        reported_match["number"] = (parseInt(lastVisible.id.split("match")[1]) + 1);
                        reported_match["invert_number"] = -(parseInt(lastVisible.id.split("match")[1]) + 1);

                        db.collection("matches")
                            .doc("match" + (parseInt(lastVisible.id.split("match")[1]) + 1))
                            .set(reported_match)
                            .then(function(docRef) {

                                // Choose a quote
                                var goal_type = [];
                                var high_low = Math.random() >= 0.5; // true = max, false = min

                                // Get all players scores
                                var players = [];
                                for (var i = 0; i < inputs.length; i++) {
                                    var nb = inputs[i].id.split("player")[1].split("_")[0];
                                    if (inputs[i].querySelector('.player_name').innerHTML != "")
                                        players.push([
                                            inputs[i].querySelector('.player_name').innerHTML,
                                            parseInt($("#goalJ" + nb + "score")[0].innerHTML),
                                            parseInt($("#gamelleJ" + nb + "score")[0].innerHTML),
                                            parseInt($("#betrayJ" + nb + "score")[0].innerHTML)
                                        ]);
                                }

                                // Check which type of goals have been added to the match
                                for (var i = 0; i < players.length; i++) {
                                    if (players[i][1] != 0 && !goal_type.includes("goal")) {
                                        goal_type.push("goal");
                                    }
                                    if (players[i][2] != 0 && !goal_type.includes("gamelle")) {
                                        goal_type.push("gamelle");
                                    }
                                    if (players[i][3] != 0 && !goal_type.includes("betray")) {
                                        goal_type.push("betray");
                                    }
                                }

                                quote = "Le match a bien été enregistré !";

                                switch (goal_type[Math.floor(Math.random() * goal_type.length)]) {
                                    case "goal": // sort with goals
                                        players.sort(function(a, b) {
                                            if (a[1] === b[1]) {
                                                return 0;
                                            } else {
                                                return (a[1] < b[1]) ? (high_low ? 1 : -1) : (high_low ? -1 : 1);
                                            }
                                        });

                                        if (high_low)
                                            quote = "Woah ! " + players[0][0].split(" ")[0] +
                                            " est en grande forme aujourd'hui avec ses " +
                                            players[0][1] +
                                            " points <i class=\"em em-open_mouth\"></i>";
                                        else
                                            quote = players[0][0].split(" ")[0] +
                                            ", faut dormir plus la nuit <i class=\"em em-smiling_face_with_smiling_eyes_and_hand_covering_mouth\"></i>";
                                        break;

                                    case "gamelle": // sort with gamelles
                                        players.sort(function(a, b) {
                                            if (a[2] === b[2]) {
                                                return 0;
                                            } else {
                                                return (a[2] < b[2]) ? (high_low ? 1 : -1) : (high_low ? -1 : 1);
                                            }
                                        });

                                        if (players[0][2] != 0) {
                                            if (players[0][2] > 1) { // If there was more than 1 gamelles
                                                quote = players[0][0].split(" ")[0] +
                                                    " a le poignet en feu avec ses " +
                                                    players[0][2] +
                                                    " gamelles <i class=\"em em-clap\"></i>";
                                            } else { // If there was just 1 gamelle
                                                quote = "Bravo " +
                                                    players[0][0].split(" ")[0] +
                                                    " pour cette exceptionnelle gamelle <i class=\"em em-open_mouth\"></i>";
                                            }
                                        } else {
                                            if (high_low)
                                                quote = "Pas de gamelle aujourd'hui ? <i class=\"em em-cry\"></i>";
                                            else {
                                                if (players[players.length - 1][2] > 1) { // If there was more than 1 gamelles
                                                    quote = players[players.length - 1][0].split(" ")[0] +
                                                        " a le poignet en feu avec ses " +
                                                        players[players.length - 1][2] +
                                                        " gamelles <i class=\"em em-clap\"></i>";
                                                } else { // If there was just 1 gamelle
                                                    quote = "Bravo " +
                                                        players[players.length - 1][0].split(" ")[0] +
                                                        " pour cette exceptionnelle gamelle <i class=\"em em-open_mouth\"></i>";
                                                }
                                            }
                                        }
                                        break;

                                    case "betray": // sort with betrays
                                        players.sort(function(a, b) {
                                            if (a[3] === b[3]) {
                                                return 0;
                                            } else {
                                                return (a[3] < b[3]) ? (high_low ? 1 : -1) : (high_low ? -1 : 1);
                                            }
                                        });


                                        if (players[0][3] != 0) {
                                            if (players[0][3] > 1) { // If there was more than 1 betrays
                                                quote = "Une ovation pour " +
                                                    players[0][0].split(" ")[0] +
                                                    " et ses " +
                                                    players[0][3] +
                                                    " buts contre son camp <i class=\"em em-upside_down_face\"></i>";
                                            } else { // If there was just 1 betray
                                                quote = "Bravo la trahison " +
                                                    players[0][0].split(" ")[0] +
                                                    " <i class=\"em em-anguished\"></i>";
                                            }
                                        } else
                                            quote = "L'avant-bras de " +
                                            players[0][0].split(" ")[0] +
                                            " est plus gros qu'hier non ? <i class=\"em em-fist\"></i><i class=\"em em-smirk\"></i>";
                                        break;
                                    default:
                                        break;
                                }


                                swal({
                                    toast: true,
                                    position: 'bottom-start',
                                    showConfirmButton: false,
                                    timer: 6000,
                                    title: quote,
                                    type: 'success',
                                    showConfirmButton: true,
                                    confirmButtonText: "<i class='em em-trophy m-2' style='font-size: 1.75rem;'></i>"
                                }).then(function(result) {
                                    // if (result.dismiss)
                                    //     console.log("dismiss");
                                    // else
                                    if (result.value) {
                                        swal({
                                            title: 'Variations d\'ELO',
                                            html: 'Ici seront affiché les changements d\'ELOs',
                                            showCloseButton: true,
                                            showCancelButton: false,
                                            confirmButtonColor: '#3ab02b',
                                            confirmButtonClass: 'btn btn-success mr-1'
                                        });
                                    }
                                });

                                setTimeout(function() {
                                    document.getElementById("validate_button").disabled = false;
                                    document.getElementById("validate_button").innerHTML = "Valider";
                                    var indicators = document.getElementsByClassName("score_indicator");
                                    for (i = 0; i < indicators.length; i++)
                                        indicators[i].innerHTML = 0;

                                    for (var i = 0; i < inputs.length; i++) {
                                        inputs[i].querySelector('.player_name').classList.remove('invalid_player');
                                        inputs[i].querySelector('.player_name').innerHTML = 'Joueur ' + (i + 1);
                                        inputs[i].querySelector('.pic').src = './res/player' + (i + 1) + '.png';
                                    }

                                    updateButtons();

                                    document.getElementById('random_button').style.display = 'block'
                                    document.getElementById("shuffle_container").style.display = "block";
                                    document.getElementById("score_indicators").style.display = "none";
                                }, 500);
                            })
                    });
            });
        });
}






var begin_template = '<div class="container">' +
    '<div class="row align-items-center" id="container_row">' +
    '<div class="col-12 col-xl-10 offset-xl-1" id="sw_container">';

function addPlayerCheckbox(name, n) {
    return '<div class="container mt-2">' +
        '<div class="row">' +
        '<span class="switch switch-lg">' +
        '<input type="checkbox" class="switch" id="sw_id' + n + '"></input>' +
        '<label for="sw_id' + n + '" id="sw_name_id' + n + '">' + name + '</label>' +
        '</div>' +
        '</div>' +
        '<hr/>';
}

var end_template = '</div>' +
    '</div>' +
    '</div>'

var borders_template = begin_template + end_template;


// Listener if players have been added
$("select").change(function() {
    var sel_player = 0;
    $('select[id*="_input"][id*="player"]').each(function() {
        if (this.value != "")
            sel_player++;
    });

    if (sel_player < 2) {
        document.getElementById("shuffle_container").style.display = "block";
        document.getElementById("score_indicators").style.display = "none";
    } else {
        document.getElementById("shuffle_container").style.display = "none";
        document.getElementById("score_indicators").style.display = "block";
    }

    updateButtons();
});



function updateButtons() {
    // Get all players selected
    var inputs = [
        document.getElementById("player1_name").innerHTML,
        document.getElementById("player2_name").innerHTML,
        document.getElementById("player3_name").innerHTML,
        document.getElementById("player4_name").innerHTML
    ];

    for (j = 0; j < inputs.length; j++) {
        // For each one, check if there is one
        var nb = j + 1;
        var buttons = $('[id*="J' + nb + '|"]');

        // Activate or disable buttons
        for (i = 0; i < buttons.length; i++) {
            if (inputs[j] != "") {
                buttons[i].disabled = false;
            } else {
                buttons[i].disabled = true;
            }
        }
    }
}



// [].forEach.call(document.getElementsByClassName('debug_hide'), function(el) {
//     el.style.display = 'none';
// });


var fetchedPlayers = {};

document.getElementById('shuffle_button').addEventListener('click', function() {
    swal({
        title: 'Selectionnez les joueurs',
        html: '<div id="swal_container_chooser" class="row"></div>',
        showCloseButton: true,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonClass: 'btn btn-success ml-1 btn-lg',
        cancelButtonClass: 'btn btn-danger mr-1 btn-lg',
        buttonsStyling: false,
        confirmButtonText: 'Let\'s <i class="em em-soccer"></i>',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
        onOpen: () => {
            // Main chooser container
            var chooser = $("#swal_container_chooser")[0];
            // Display loading icon while players are fetched from database
            chooser.innerHTML = '<i class="fas fa-circle-notch fa-spin col-12" style="font-size: 3rem;"></i>';

            // Copy player selector template
            var player_element_template = document.getElementById('player_placeholder').cloneNode(true);

            // Fetch all active players
            db.collection("players")
                .where("isActive", "==", true)
                .get()
                .then(function(querySnapshot) {
                    // Empty the chooser container
                    chooser.innerHTML = '';

                    // Store all players data
                    querySnapshot.forEach(function(doc) {
                        fetchedPlayers[doc.id] = doc.data();
                    });

                    // Get all teams available
                    var teamSet = new Set();

                    for (var p in fetchedPlayers) {
                        teamSet.add(fetchedPlayers[p].team);
                    }

                    var sortedPlayers = {};
                    // Sort players on team they belong
                    for (var team of teamSet) {
                        sortedPlayers[team] = {};
                        for (var playerID in fetchedPlayers) {
                            if (fetchedPlayers[playerID].team === team)
                                sortedPlayers[team][playerID] = fetchedPlayers[playerID];
                        }

                        // Store players data in array to sort alphabetically
                        var arr = [];
                        for (var playerID in sortedPlayers[team]) {
                            arr.push([team, playerID, sortedPlayers[team][playerID]]);
                        }

                        // Sort players alphabetically
                        arr.sort(function(a, b) {
                            if (a[2].name === b[2].name) {
                                return 0;
                            } else {
                                return a[2].name > b[2].name;
                            }
                        });

                        // Display team name
                        chooser.innerHTML += '<h2 class="col-12">' + arr[0][0] + '</h2>';
                        // Display each player
                        for (var a = 0; a < arr.length; a++) {
                            player_element_template.id = arr[a][1]; // Change each div ID
                            player_element_template.querySelector('.pic').id = arr[a][1] + '_pic'; // Change each img ID
                            // Display picture if available
                            if (arr[a][2].photoURL != null)
                                player_element_template.querySelector('.pic').src = arr[a][2].photoURL;
                            else
                                player_element_template.querySelector('.pic').src = 'res/blank_profile.png';
                            // Display player name
                            player_element_template.querySelector('.player_selector_name').innerHTML = arr[a][2].name;
                            // Add copied node to chooser container
                            chooser.innerHTML += player_element_template.outerHTML;
                        }
                        // Add bottom margin between each team
                        chooser.innerHTML += '<div class="col-12 mb-2"/>';
                    }


                    // Add click event listener to all player element
                    var elements = chooser.children;

                    for (var e = 0; e < elements.length; e++) {
                        elements[e].style.display = 'block'; // Display element
                        // Add click listener
                        elements[e].addEventListener('click', function(event) {
                            var player_container = event.target.closest('.player_placeholder');
                            // Fix for height animation
                            player_container.querySelector('.img_container').style.minHeight = player_container.querySelector('.img_container').offsetHeight + 'px';
                            // Display validator image
                            var actualOpacity = player_container.querySelector('.overlay').style.opacity;
                            if (actualOpacity < 0.75) {
                                player_container.querySelector('.overlay').style.opacity = 0.75;
                                player_container.classList.add('player_selected');
                            } else {
                                player_container.querySelector('.overlay').style.opacity = 0;
                                player_container.classList.remove('player_selected');
                            }

                            // Animate height
                            $('#' + player_container.id + ' .pic').animate({
                                width: "95%"
                            }, 35, function() {
                                $(this).animate({
                                    width: "100%"
                                }, 35);
                            });
                        })
                    }
                });
        },
        preConfirm: () => {
            var selected_players = document.getElementsByClassName('player_selected');
            var selected_players = Array.from(selected_players);

            // If less than 2 players are selected
            if (selected_players.length < 2)
                swal.showValidationError('Veuillez selectionner au moins 2 joueurs <i class=\"em em-v\"></i>');
            // If only 2 players are selected
            else if (selected_players.length == 2) {
                document.getElementById('player1_placeholder').querySelector('#player1_img').src = (fetchedPlayers[selected_players[0].id].photoURL != null ? fetchedPlayers[selected_players[0].id].photoURL : './res/blank_profile.png');
                document.getElementById('player1_placeholder').querySelector('#player1_name').innerHTML = fetchedPlayers[selected_players[0].id].name;
                document.getElementById('player2_placeholder').querySelector('#player2_img').src = './res/empty_pic.png';
                document.getElementById('player2_placeholder').querySelector('#player2_name').innerHTML = '';
                document.getElementById('player3_placeholder').querySelector('#player3_img').src = (fetchedPlayers[selected_players[1].id].photoURL != null ? fetchedPlayers[selected_players[1].id].photoURL : './res/blank_profile.png');
                document.getElementById('player3_placeholder').querySelector('#player3_name').innerHTML = fetchedPlayers[selected_players[1].id].name;
                document.getElementById('player4_placeholder').querySelector('#player4_img').src = './res/empty_pic.png';
                document.getElementById('player4_placeholder').querySelector('#player4_name').innerHTML = '';
                document.getElementById("shuffle_container").style.display = "none";
                document.getElementById("score_indicators").style.display = "block";
            }
            // If 3 or more players are selected
            else {
                // Request to Statistiques HERE
                for (var placeHolder of document.getElementsByClassName('match_player_placeholder')) {
                    if (selected_players.length == 0) {
                        placeHolder.querySelector('.pic').src = './res/empty_pic.png';
                        placeHolder.querySelector('.player_name').innerHTML = '';
                        break; // if only 3 players have been selected, exit function if names array is empty
                    }

                    var rand_nb = Math.floor(Math.random() * selected_players.length);
                    placeHolder.querySelector('.pic').src = (fetchedPlayers[selected_players[rand_nb].id].photoURL != null ? fetchedPlayers[selected_players[rand_nb].id].photoURL : './res/blank_profile.png');
                    placeHolder.querySelector('.player_name').innerHTML = fetchedPlayers[selected_players[rand_nb].id].name;
                    selected_players.splice(rand_nb, 1); // remove name from array
                }

                document.getElementById("shuffle_container").style.display = "none";
                document.getElementById("score_indicators").style.display = "block";
            }
            updateButtons();
        }
    });
});




// Add click event listener for all placeholders 
for (var holder of document.getElementsByClassName('match_player_placeholder')) {
    holder.addEventListener('click', function(e) {
        var player_header = document.getElementById('players_container').cloneNode(true);
        player_header.id = 'players_container_swal';
        player_header.querySelector('#player1_img').style.opacity = 1;
        player_header.querySelector('#player1_placeholder').classList.add('selected');
        if (player_header.querySelector('#player1_name').innerHTML == 'Joueur 1')
            player_header.querySelector('#player1_placeholder').classList.add('empty_selector');
        if (player_header.querySelector('#player1_name').innerHTML == '') {
            player_header.querySelector('#player1_placeholder').classList.add('empty_selector');
            player_header.querySelector('#player1_img').src = './res/player1.png';
            player_header.querySelector('#player1_name').innerHTML = 'Joueur 1';
        }
        player_header.querySelector('#player2_img').style.opacity = 0.25;
        if (player_header.querySelector('#player2_name').innerHTML == 'Joueur 2')
            player_header.querySelector('#player2_placeholder').classList.add('empty_selector');
        if (player_header.querySelector('#player2_name').innerHTML == '') {
            player_header.querySelector('#player2_placeholder').classList.add('empty_selector');
            player_header.querySelector('#player2_img').src = './res/player2.png';
            player_header.querySelector('#player2_name').innerHTML = 'Joueur 2';
        }
        player_header.querySelector('#player3_img').style.opacity = 0.25;
        if (player_header.querySelector('#player3_name').innerHTML == 'Joueur 3')
            player_header.querySelector('#player3_placeholder').classList.add('empty_selector');
        if (player_header.querySelector('#player3_name').innerHTML == '') {
            player_header.querySelector('#player3_placeholder').classList.add('empty_selector');
            player_header.querySelector('#player3_img').src = './res/player3.png';
            player_header.querySelector('#player3_name').innerHTML = 'Joueur 3';
        }
        player_header.querySelector('#player4_img').style.opacity = 0.25;
        if (player_header.querySelector('#player4_name').innerHTML == 'Joueur 4')
            player_header.querySelector('#player4_placeholder').classList.add('empty_selector');
        if (player_header.querySelector('#player4_name').innerHTML == '') {
            player_header.querySelector('#player4_placeholder').classList.add('empty_selector');
            player_header.querySelector('#player4_img').src = './res/player4.png';
            player_header.querySelector('#player4_name').innerHTML = 'Joueur 4';
        }


        swal({
            title: 'Selectionnez les joueurs',
            html: '<div id="swal_container_chooser" class="row"></div>',
            showCloseButton: true,
            showCancelButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success ml-1 btn-lg',
            cancelButtonClass: 'btn btn-danger mr-1 btn-lg',
            buttonsStyling: false,
            confirmButtonText: 'Let\'s <i class="em em-soccer"></i>',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            onOpen: () => {
                var chooser = $("#swal_container_chooser")[0];
                chooser.innerHTML += '<i class="fas fa-circle-notch fa-spin col-12" style="font-size: 3rem;"></i>';

                // Copy player selector template
                var player_element_template = document.getElementById('player_placeholder').cloneNode(true);

                // Fetch all active players
                db.collection("players")
                    .where("isActive", "==", true)
                    .get()
                    .then(function(querySnapshot) {
                        // Empty the chooser container
                        chooser.innerHTML = '';

                        chooser.innerHTML += player_header.outerHTML;

                        console.log(chooser);

                        // Store all players data
                        querySnapshot.forEach(function(doc) {
                            fetchedPlayers[doc.id] = doc.data();
                        });

                        // Get all teams available
                        var teamSet = new Set();

                        for (var p in fetchedPlayers) {
                            teamSet.add(fetchedPlayers[p].team);
                        }

                        var sortedPlayers = {};
                        // Sort players on team they belong
                        for (var team of teamSet) {
                            sortedPlayers[team] = {};
                            for (var playerID in fetchedPlayers)
                                if (fetchedPlayers[playerID].team === team)
                                    sortedPlayers[team][playerID] = fetchedPlayers[playerID];

                            // Store players data in array to sort alphabetically
                            var arr = [];
                            for (var playerID in sortedPlayers[team]) {
                                arr.push([team, playerID, sortedPlayers[team][playerID]]);
                            }

                            // Sort players alphabetically
                            arr.sort(function(a, b) {
                                if (a[2].name === b[2].name) {
                                    return 0;
                                } else {
                                    return a[2].name > b[2].name;
                                }
                            });

                            // Display team name
                            chooser.innerHTML += '<h2 class="col-12 mt-3">' + arr[0][0] + '</h2>';
                            // Display each player
                            for (var a = 0; a < arr.length; a++) {
                                player_element_template.id = arr[a][1]; // Change each div ID
                                player_element_template.querySelector('.pic').id = arr[a][1] + '_pic'; // Change each img ID
                                // Display picture if available
                                if (arr[a][2].photoURL != null)
                                    player_element_template.querySelector('.pic').src = arr[a][2].photoURL;
                                else
                                    player_element_template.querySelector('.pic').src = 'res/blank_profile.png';
                                // Display player name
                                player_element_template.querySelector('.player_selector_name').innerHTML = arr[a][2].name;
                                // Add copied node to chooser container
                                chooser.innerHTML += player_element_template.outerHTML;
                            }
                            // Add bottom margin between each team
                            chooser.innerHTML += '<div class="col-12"/>';
                        }


                        // Add click event listener to all player element
                        var elements = chooser.children;

                        for (var e = 0; e < elements.length; e++) {
                            elements[e].style.display = 'block'; // Display element
                            // Add click listener
                            elements[e].addEventListener('click', function(event) {
                                var player_container = event.target.closest('.player_placeholder');
                                var holders = chooser.getElementsByClassName('match_player_placeholder');

                                // If player is clicked
                                if (player_container != null) {
                                    // var selectorSrc = chooser.querySelector('.selected').querySelector('.pic').src;
                                    // Change placeholder source and name for selected player
                                    chooser.querySelector('.selected').querySelector('.pic').src = player_container.querySelector('.pic').src;
                                    chooser.querySelector('.selected').querySelector('.player_name').innerHTML = player_container.querySelector('.player_selector_name').innerHTML;
                                    chooser.querySelector('.selected').classList.remove('empty_selector');

                                    // Iterate cursor until last player
                                    if (parseInt(chooser.querySelector('.selected').id.split('player')[1].split('_')[0]) < 4) {
                                        chooser.querySelector('#player' + (parseInt(chooser.querySelector('.selected').id.split('player')[1].split('_')[0]) + 1) + '_placeholder').classList.add('selected');
                                        chooser.querySelector('#' + chooser.querySelector('.selected').id).classList.remove('selected');
                                    } else {
                                        chooser.querySelector('#player1_placeholder').classList.add('selected');
                                        chooser.querySelector('#player4_placeholder').classList.remove('selected');
                                    }

                                    // Refresh opacities for selected placeholder
                                    for (var holder of holders)
                                        if (holder.classList.contains('selected'))
                                            holder.querySelector('.pic').style.opacity = 1;
                                        else
                                            holder.querySelector('.pic').style.opacity = 0.25;

                                    // Fix for height animation
                                    player_container.querySelector('.img_container').style.minHeight = player_container.querySelector('.img_container').offsetHeight + 'px';

                                    // Animate height
                                    $('#' + player_container.id + ' .pic').animate({
                                        width: "95%"
                                    }, 35, function() {
                                        $(this).animate({
                                            width: "100%"
                                        }, 35);
                                    });
                                }
                                // If player placeholder is clicked
                                else {
                                    var player_container = event.target.closest('.match_player_placeholder');

                                    // If placeholder was not selected
                                    if (!player_container.classList.contains('selected')) {
                                        for (var holder of holders)
                                            holder.classList.remove('selected');

                                        player_container.classList.add('selected');

                                        for (var holder of holders)
                                            if (holder.classList.contains('selected'))
                                                holder.querySelector('.pic').style.opacity = 1;
                                            else
                                                holder.querySelector('.pic').style.opacity = 0.25;
                                    }
                                    // If placeholder was selected, delete player selected
                                    else {
                                        player_container.querySelector('.pic').src = './res/player' + player_container.id.split('player')[1].split('_')[0] + '.png';
                                        player_container.querySelector('.player_name').innerHTML = 'Joueur ' + player_container.id.split('player')[1].split('_')[0];
                                        player_container.classList.add('empty_selector');
                                    }
                                }
                            })
                        }
                    });
            },
            preConfirm: () => {
                var filledPlaceholders = $("#swal_container_chooser")[0].getElementsByClassName('match_player_placeholder');
                filledPlaceholders = Array.from(filledPlaceholders);

                var selectedPlayers = [];
                var noSelectedPlayers = [];
                for (var filledSelector of filledPlaceholders) {
                    if (!filledSelector.classList.contains('empty_selector')) {
                        selectedPlayers.push(filledSelector);
                    } else
                        noSelectedPlayers.push(filledSelector);
                }


                // If less than 2 players are selected
                if (selectedPlayers.length < 2)
                    swal.showValidationError('Veuillez selectionner au moins 2 joueurs <i class=\"em em-v\"></i>');
                // If only 2 players are selected
                else if (selectedPlayers.length == 2) {
                    // Verify if a player has been selected twice or more
                    for (var s = 0; s < selectedPlayers.length; s++) {
                        for (var p = s + 1; p < selectedPlayers.length; p++) {
                            if (selectedPlayers[s].querySelector('.player_name').innerHTML == selectedPlayers[p].querySelector('.player_name').innerHTML)
                                swal.showValidationError('Veuillez retirer les doublons');
                        }
                    }

                    // Verify if players are dispatched between teams
                    if (!((selectedPlayers[0].id.split('_')[0] == 'player1' ||
                                selectedPlayers[0].id.split('_')[0] == 'player2') &&
                            (selectedPlayers[1].id.split('_')[0] == 'player3' ||
                                selectedPlayers[1].id.split('_')[0] == 'player4'))) {
                        swal.showValidationError('Veuillez placer les joueurs dans deux équipes différentes');
                    } else {
                        for (var selectedPlayer of selectedPlayers) {
                            document.getElementById('players_container').querySelector('#' + selectedPlayer.id + ' .player_name').innerHTML = selectedPlayer.querySelector('.player_name').innerHTML;
                            document.getElementById('players_container').querySelector('#' + selectedPlayer.id + ' .pic').src = selectedPlayer.querySelector('.pic').src;
                        }
                        for (var noSelectedPlayer of noSelectedPlayers) {
                            document.getElementById('players_container').querySelector('#' + noSelectedPlayer.id + ' .player_name').innerHTML = '';
                            document.getElementById('players_container').querySelector('#' + noSelectedPlayer.id + ' .pic').src = './res/empty_pic.png';
                        }
                        document.getElementById("shuffle_container").style.display = "none";
                        document.getElementById("score_indicators").style.display = "block";
                    }
                    // If more than 2 players are selected
                } else if (selectedPlayers.length > 2) {
                    // Verify if a player has been selected twice or more
                    for (var s = 0; s < selectedPlayers.length; s++) {
                        for (var p = s + 1; p < selectedPlayers.length; p++) {
                            if (selectedPlayers[s].querySelector('.player_name').innerHTML == selectedPlayers[p].querySelector('.player_name').innerHTML)
                                swal.showValidationError('Veuillez retirer les doublons');
                        }
                    }

                    for (var selectedPlayer of selectedPlayers) {
                        document.getElementById('players_container').querySelector('#' + selectedPlayer.id + ' .player_name').innerHTML = selectedPlayer.querySelector('.player_name').innerHTML;
                        document.getElementById('players_container').querySelector('#' + selectedPlayer.id + ' .pic').src = selectedPlayer.querySelector('.pic').src;
                    }
                    for (var noSelectedPlayer of noSelectedPlayers) {
                        document.getElementById('players_container').querySelector('#' + noSelectedPlayer.id + ' .player_name').innerHTML = '';
                        document.getElementById('players_container').querySelector('#' + noSelectedPlayer.id + ' .pic').src = './res/empty_pic.png';
                    }
                    document.getElementById("shuffle_container").style.display = "none";
                    document.getElementById("score_indicators").style.display = "block";
                }
                updateButtons();
            }
        });
    });
}