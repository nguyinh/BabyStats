// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();



// --------------- Report match ---------------
function reportMatch(P1, P2, P3, P4, S1, S2, match_number, date) {

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
    match_template.querySelector("#timestamp").innerHTML = date;

    // Give status to match depending on score
    node_team1 = match_template.querySelector("#status_team1");
    node_team2 = match_template.querySelector("#status_team2");
    if (parseInt(match_template.querySelector("#team1score").innerHTML) > parseInt(match_template.querySelector("#team2score").innerHTML)) {
        node_team1.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-success disabled\">Victoire</button>");
        node_team2.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-danger disabled\">Défaite</button>");
    } else if (parseInt(match_template.querySelector("#team1score").innerHTML) < parseInt(match_template.querySelector("#team2score").innerHTML)) {
        node_team1.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-danger disabled\">Défaite</button>");
        node_team2.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-success disabled\">Victoire</button>");
    } else {
        node_team1.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-warning disabled\">Erreur</button>");
        node_team2.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-warning disabled\">Erreur</button>");
    }

    if (history.firstChild != null) {
        match_template.insertAdjacentHTML('beforeend', "<hr/>");
    }

    match_template.style.display = 'block';

    // add match to history
    history.insertBefore(match_template, history.firstChild);
}



// --------------- History ---------------
var matchs_buffer = [];
var DEFAULT_NUMBER = 5;

// Get all matches, order from oldest to newest and display them
db.collection("matches")
    .orderBy("invert_number")
    .limit(DEFAULT_NUMBER)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data();
            data.id = doc.id;
            data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").locale('fr').fromNow();
            // data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").add(2, 'hours').locale('fr').fromNow();
            if (data.date == "• Invalid date")
                data.date = "•";
            matchs_buffer.push(data);
        });

        // Invert match order to display newest on top
        for (var i = matchs_buffer.length - 1; i >= 0; i--) {
            reportMatch(matchs_buffer[i].player1, matchs_buffer[i].player2, matchs_buffer[i].player3, matchs_buffer[i].player4, matchs_buffer[i].score1, matchs_buffer[i].score2, matchs_buffer[i].id, matchs_buffer[i].date);
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


var REFRESH_INTERVAL = 10;
// Refresh FromNow every REFRESH_INTERVAL seconds
setInterval(function() {
    for (var i = 0; i < matchs_buffer.length; i++) {
        var tempDate = "• " + moment(matchs_buffer[i].timestamp, "YYYY-MM-DDThh:mm:ss").locale('fr').fromNow();
        // data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").add(2, 'hours').locale('fr').fromNow();
        if (tempDate == "• Invalid date")
            $('#' + matchs_buffer[i].id + ' #timestamp')[0].innerHTML = "•";
        else
            $('#' + matchs_buffer[i].id + ' #timestamp')[0].innerHTML = tempDate;
    }
}, REFRESH_INTERVAL * 1000);


document.getElementById("load_more_button").addEventListener("click", function() {
    var button = this;
    button.innerHTML = 'Un petit instant <i class="em em-hand"></i>';
    this.disabled = true;
    var previous_matchs_number = matchs_buffer.length;

    db.collection("matches")
        .orderBy("invert_number")
        .limit(matchs_buffer.length + DEFAULT_NUMBER)
        .get()
        .then(function(querySnapshot) {
            matchs_buffer = [];     // reset matchs buffer to re-import previous matchs and new ones
            querySnapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").locale('fr').fromNow();
                // data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").add(2, 'hours').locale('fr').fromNow();
                if (data.date == "• Invalid date")
                    data.date = "•";
                matchs_buffer.push(data);
            });

            document.getElementById("history").innerHTML = "";

            // Invert match order to display newest on top
            for (var i = matchs_buffer.length - 1; i >= 0; i--) {
                reportMatch(matchs_buffer[i].player1, matchs_buffer[i].player2, matchs_buffer[i].player3, matchs_buffer[i].player4, matchs_buffer[i].score1, matchs_buffer[i].score2, matchs_buffer[i].id, matchs_buffer[i].date);
            }

            if (previous_matchs_number == matchs_buffer.length) {
                button.innerHTML = 'Y\'a plus <i class="em em-cry"></i>'
            }
            else {
                button.innerHTML = 'Afficher plus <i class="em em-point_down">'
                button.disabled = false;
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
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
                color: "rgb(240, 242, 217)",
                backgroundColor: "rgb(173, 59, 59)"
            },
            1000,
            'swing');

    // If timeout, restore background color
    setTimeout(function() {
        $("#" + $(e.target)
                .parentsUntil(".match_container")
                .parent()
                .attr('id'))
            .animate({
                    opacity: 1,
                    color: "rgb(0, 0, 0)",
                    backgroundColor: "#FFFFFFFF"
                },
                100,
                'swing')
    }, 1250);

    pressTimer = window.setTimeout(function() {
        var match_id = $(e.target).parentsUntil(".match_container").parent().attr('id');

        if (new RegExp('match').test(match_id)) {
            swal({
                title: 'Confirmation',
                text: "Êtes vous sûr de vouloir supprimer ce match ?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui !',
                cancelButtonText: 'How about no.',
                confirmButtonClass: 'btn btn-success mr-1',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    // Add loading icon
                    var thisMatch = $("#" + $(e.target)
                        .parentsUntil(".match_container")
                        .parent().attr('id')).find("#scores");
                    console.log();
                    thisMatch[0].innerHTML = "";
                    thisMatch.addClass('fa fa-circle-o-notch fa-spin');
                    thisMatch.css("font-size", "1.75rem");

                    db.collection("matches")
                        .doc(match_id)
                        .get()
                        .then(function(doc) {
                            if (doc.exists) {
                                db.collection("matches")
                                    .doc(match_id)
                                    .delete()
                                    .then(function() {
                                        var match = document.getElementById(match_id);
                                        match.parentNode.removeChild(match);

                                        swal(
                                            'Succès',
                                            'Le match a bien été supprimé !',
                                            'success'
                                        );
                                    }).catch(function(error) {
                                        swal({
                                            type: 'error',
                                            title: 'Erreur',
                                            text: 'Il y a eu un problème lors de la suppression du match'
                                        });
                                    });
                            } else {
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });
                }
            })
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
                color: "rgb(0, 0, 0)",
                backgroundColor: "#FFFFFFFF"
            },
            100,
            'swing');

    clearTimeout(pressTimer);
}
