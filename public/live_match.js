// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();



// --------------- Players list ---------------
var player1select = document.getElementById('player1_input');
var player2select = document.getElementById('player2_input');
var player3select = document.getElementById('player3_input');
var player4select = document.getElementById('player4_input');

var selectsElements = [player1select, player2select, player3select, player4select];

// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players")
    .orderBy("team")
    .get()
    .then(function(querySnapshot) {
        // Query players list
        var team_id = null;
        querySnapshot.forEach(function(doc) {
            data = doc.data();

            // If new docSnapshot of if new team in doc
            if ((team_id == null) || (team_id != data.team)) {
                team_id = data.team;
                for (var i = 0; i < selectsElements.length; i++) {
                    selectsElements[i].insertAdjacentHTML('beforeend', "<optgroup label=\"" + team_id + "\">"); // insert PSA team name as title
                }
            }
            // If same team as before, do nothing particular
            for (var i = 0; i < selectsElements.length; i++) {
                var opt = document.createElement('option');
                opt.value = data.name;
                opt.innerHTML = data.name;
                selectsElements[i].appendChild(opt);
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
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
        else {
            // console.log(this.id.split("|"));
            updateScore(this.id.split("|")[0], this.id.split("|")[1], this.id.split("|")[2]);
        }
    });
};


function validate() {

    // Get all inputs
    var inputs = [
        document.getElementById("player1_input"),
        document.getElementById("player2_input"),
        document.getElementById("player3_input"),
        document.getElementById("player4_input")
    ];

    // Clear color for all inputs
    for (var i = 0; i < inputs.length; i++) {
        $("#" + inputs[i].id).removeClass("is-invalid");
        document.getElementsByClassName("score_border").item(0).style.borderColor = "rgb(121, 121, 121)";
        document.getElementsByClassName("score_border").item(1).style.borderColor = "rgb(121, 121, 121)";
    }

    // Check for errors
    if ((inputs[0].options[inputs[0].selectedIndex].value == "" && inputs[1].options[inputs[1].selectedIndex].value == "") ||
        (inputs[2].options[inputs[2].selectedIndex].value == "" && inputs[3].options[inputs[3].selectedIndex].value == "") ||
        ((int(score1) == 10) && (int(score2) == 10)) ||
        ((int(score1) != 10) && (int(score2) != 10))) {

        if ((inputs[0].options[inputs[0].selectedIndex].value == "" && inputs[1].options[inputs[1].selectedIndex].value == "")) {
            $("#player1_input").addClass("is-invalid");
            $("#player2_input").addClass("is-invalid");
        }
        if (((int(score1) == 10) && (int(score2) == 10)) ||
            ((int(score1) != 10) && (int(score2) != 10))) {
            document.getElementsByClassName("score_border").item(0).style.borderColor = "rgb(194, 57, 57)";
            document.getElementsByClassName("score_border").item(1).style.borderColor = "rgb(194, 57, 57)";
        }
        if ((inputs[2].options[inputs[2].selectedIndex].value == "" && inputs[3].options[inputs[3].selectedIndex].value == "")) {
            $("#player3_input").addClass("is-invalid");
            $("#player4_input").addClass("is-invalid");
        }

        // Exit method if error(s)
        return;
    }



    // Disable button while match not added
    document.getElementById("validate_button").disabled = true;
    document.getElementById("validate_button").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";

    // Create match object
    var reported_match = {
        player1: inputs[0].options[inputs[0].selectedIndex].value,
        player2: inputs[1].options[inputs[1].selectedIndex].value,
        player3: inputs[2].options[inputs[2].selectedIndex].value,
        player4: inputs[3].options[inputs[3].selectedIndex].value,
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
                    swal(
                        'Succès',
                        'Le match a bien été ajouté !',
                        'success'
                    );

                    setTimeout(function() {
                        document.getElementById("validate_button").disabled = false;
                        document.getElementById("validate_button").innerHTML = "Valider";
                        var indicators = document.getElementsByClassName("score_indicator");
                        for (i = 0; i < indicators.length; i++)
                            indicators[i].innerHTML = 0;
                    }, 500);
                })

            for (var i = 0; i < inputs.length; i++) {
                $("#" + inputs[i].id).removeClass("is-invalid");
                inputs[i].value = "";
            }
        });
}
