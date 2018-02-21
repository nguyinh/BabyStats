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




// --------------- Scores list ---------------
var score1select = document.getElementById("score1_input");
var score2select = document.getElementById("score2_input");

for (var i = 10; i >= -10; i--) {
    var opt1 = document.createElement('option');
    var opt2 = document.createElement('option');
    opt1.value = i;
    opt1.innerHTML = i;
    opt2.value = i;
    opt2.innerHTML = i;
    score1select.appendChild(opt1);
    score2select.appendChild(opt2);
}




// --------------- Report match ---------------
function reportMatch(P1, P2, P3, P4, S1, S2, match_number) {

    var match_template = document.getElementById("template").cloneNode(true); // copy template node
    var history = document.getElementById("history"); // get history div element (contains all matches)
    match_template.id = match_number; // give id depending on match number

    // Add match informations
    match_template.querySelector("#player1").innerHTML = P1;
    match_template.querySelector("#player2").innerHTML = P2;
    match_template.querySelector("#player3").innerHTML = P3;
    match_template.querySelector("#player4").innerHTML = P4;
    match_template.querySelector("#team1score").innerHTML = S1;
    match_template.querySelector("#team2score").innerHTML = S2;

    // Give status to match depending on score
    node = match_template.querySelector("#status");
    if (parseInt(match_template.querySelector("#team1score").innerHTML) > parseInt(match_template.querySelector("#team2score").innerHTML)) {
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-success disabled\">Victoire</button>");
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-danger disabled\">Défaite</button>");
    } else if (parseInt(match_template.querySelector("#team1score").innerHTML) < parseInt(match_template.querySelector("#team2score").innerHTML)) {
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-danger disabled\">Défaite</button>");
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-success disabled\">Victoire</button>");
    } else {
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-warning disabled\">Erreur</button>");
    }

    if (history.firstChild != null) {
        match_template.insertAdjacentHTML('beforeend', "<hr/>");
    }

    // add match to history
    history.insertBefore(match_template, history.firstChild);
}





// --------------- History ---------------
// Get all matches, order from oldest to most recent and display them
var test = db.collection("matches")
    .orderBy("number")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data();
            reportMatch(data.player1, data.player2, data.player3, data.player4, data.score1, data.score2, doc.id);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


// Delete functionnality on match element hold
var pressTimer;

// Computer navigation
$("#history").mouseup(function(e) {
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        inputUp(e);
    }


    return false;

}).mousedown(function(e) {
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        inputDown(e);
    }
    return false;
});




// Mobile navigation
$("#history").on("touchstart", function(e) {
    inputDown(e);
});

$("#history").on("touchend", function(e) {
    inputUp(e);
});

function inputDown(e) {
    // Change background color
    $("#" + $(e.target)
            .parentsUntil(".match_container")
            .parent().attr('id'))
        .animate({
                opacity: 0.6,
                backgroundColor: "rgba(251, 0, 0)"
            },
            1000,
            'linear');

    // If timeout, restore background color
    setTimeout(function() {
        $("#" + $(e.target)
                .parentsUntil(".match_container")
                .parent()
                .attr('id'))
            .animate({
                    opacity: 1,
                    backgroundColor: "#FFFFFFFF"
                },
                100,
                'linear')
    }, 1250);

    pressTimer = window.setTimeout(function() {
        var match_id = $(e.target).parentsUntil(".match_container").parent().attr('id');
        console.log(match_id);
        if (new RegExp('match').test(match_id))
            if (confirm("Supprimer ce match ?")) {
                db.collection("matches")
                    .doc(match_id)
                    .get()
                    .then(function(doc) {
                        if (doc.exists) {
                            db.collection("matches")
                                .doc(match_id)
                                .delete()
                                .then(function() {
                                    console.log(match_id + " successfully deleted!");

                                    var match = document.getElementById(match_id);
                                    match.parentNode.removeChild(match);
                                }).catch(function(error) {
                                    console.error("Error removing " + match_id + ": ", error);
                                });
                        } else {
                            console.log("No such document!");
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });
            } else {
                // Do nothing
            }
    }, 1000);
}

function inputUp(e) {
    // Restore background color
    $("#" + $(e.target)
            .parentsUntil(".match_container")
            .parent()
            .attr('id'))
        .animate({
                opacity: 1,
                backgroundColor: "#FFFFFFFF"
            },
            100,
            'linear');

    clearTimeout(pressTimer);
}







// --------------- Validate button listener ---------------
document.getElementById("validate_button").addEventListener("click", function() {

    // Get all inputs
    var inputs = [
        document.getElementById("player1_input"),
        document.getElementById("player2_input"),
        document.getElementById("player3_input"),
        document.getElementById("player4_input"),
        document.getElementById("score1_input"),
        document.getElementById("score2_input")
    ];

    // Clear color for all inputs
    for (var i = 0; i < inputs.length; i++) {
        $("#" + inputs[i].id).removeClass("is-invalid");
    }

    // Check for errors
    if ((inputs[0].options[inputs[0].selectedIndex].value == "" && inputs[1].options[inputs[1].selectedIndex].value == "") ||
        inputs[4].options[inputs[4].selectedIndex].value == "" ||
        inputs[5].options[inputs[5].selectedIndex].value == "" ||
        (inputs[2].options[inputs[2].selectedIndex].value == "" && inputs[3].options[inputs[3].selectedIndex].value == "")) {

        if ((inputs[0].options[inputs[0].selectedIndex].value == "" && inputs[1].options[inputs[1].selectedIndex].value == "")) {
            $("#player1_input").addClass("is-invalid");
            $("#player2_input").addClass("is-invalid");
        }
        if (inputs[4].options[inputs[4].selectedIndex].value == "")
            $("#score1_input").addClass("is-invalid");
        if (inputs[5].options[inputs[5].selectedIndex].value == "")
            $("#score2_input").addClass("is-invalid");
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
        score1: parseInt(inputs[4].options[inputs[4].selectedIndex].value),
        score2: parseInt(inputs[5].options[inputs[5].selectedIndex].value),
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
                    setTimeout(function() {
                        // Get this match and display it
                        db.collection("matches").doc("match" + (parseInt(lastVisible.id.split("match")[1]) + 1)).get().then(function(doc) {
                            if (doc.exists) {
                                data = doc.data();
                                reportMatch(data.player1, data.player2, data.player3, data.player4, data.score1, data.score2, doc.id);
                            } else {
                                console.log("match" + (parseInt(lastVisible.id.split("match")[1]) + 1) + "doesn't exist");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        document.getElementById("validate_button").disabled = false;
                        document.getElementById("validate_button").innerHTML = "Valider";
                    }, 500);
                })

            for (var i = 0; i < inputs.length; i++) {
                $("#" + inputs[i].id).removeClass("is-invalid");
                inputs[i].value = "";
            }
        });
});
