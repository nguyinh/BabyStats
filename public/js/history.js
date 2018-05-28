// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('profile_name').innerHTML = '<img id="profile_picture" alt="Photo" src="../blank_profile.png" style="width: 2rem; height:2rem; border-radius: 50%;" class="mr-2">' + user.displayName
        document.getElementById('profile_picture').src = user.photoURL;
    }
});

// --------------- Report match ---------------
// function reportMatch(P1, P2, P3, P4, S1, S2, match_number, date) {
function reportMatch(match, addToEnd) {

    var match_template = document.getElementById("template").cloneNode(true); // copy template node
    var history = document.getElementById("history"); // get history div element (contains all matches)
    match_template.id = match.id; // give id depending on match number

    // Add match informations
    match_template.querySelector("#player1").innerHTML = match.player1;
    match_template.querySelector("#player2").innerHTML = match.player2;
    match_template.querySelector("#player3").innerHTML = match.player3;
    match_template.querySelector("#player4").innerHTML = match.player4;
    match_template.querySelector("#player1_label").innerHTML = match.player1;
    match_template.querySelector("#player2_label").innerHTML = match.player2;
    match_template.querySelector("#player3_label").innerHTML = match.player3;
    match_template.querySelector("#player4_label").innerHTML = match.player4;
    match_template.querySelector("#team1score").innerHTML = match.score1;
    match_template.querySelector("#team2score").innerHTML = match.score2;
    match_template.querySelector("#timestamp").innerHTML = match.date;

    match_template.querySelector("#Charts").innerHTML = AddChartsHTML(match.id);
    match_template.querySelector("#players_details").id += '_' + match.id;

    // Define if match has been submitted to deletion
    if (match.reason == undefined) {
        match_template.querySelector(".cross_icon").style.display = "none";
    } else {
        if (match.reason == "")
            match_template.querySelector(".cross_icon").style.display = "none";
        else {
            match_template.querySelector(".cross_icon").style.display = "block";
        }
    }

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

    // Add match to bottom of history
    history.insertBefore(match_template, history.lastChild);

    addCharts(match);
}



// --------------- History ---------------
var matchs_buffer = [];
var DEFAULT_NUMBER = 5;
document.getElementById("load_more_button").innerHTML = 'Un petit instant <i class="em em-hand"></i>';
document.getElementById("load_more_button").disabled = true;

refreshHistory(matchs_buffer.length);




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

    refreshHistory(matchs_buffer.length);
});





// Delete functionnality on match element hold
function inputDown(e) {

    // Test if element e is not players details
    var node = e.target.parentNode;
    while (node != null) {
        if (node.id != undefined && node.id.includes('players_details')) {
            return;
        }
        node = node.parentNode;
    }

    // Change background color
    // $("#" + $(e.target)
    //         .parentsUntil(".match_container")
    //         .parent().attr('id'))
    //     .animate({
    //             opacity: 0.6,
    //             color: "rgb(240, 242, 217)",
    //             backgroundColor: "rgb(173, 59, 59)"
    //         },
    //         1000,
    //         'swing');

    // If timeout, restore background color
    // setTimeout(function() {
    //     $("#" + $(e.target)
    //             .parentsUntil(".match_container")
    //             .parent()
    //             .attr('id'))
    //         .animate({
    //                 opacity: 1,
    //                 color: "rgb(0, 0, 0)",
    //                 backgroundColor: "#FFFFFFFF"
    //             },
    //             100,
    //             'swing')
    // }, 1250);
}

function inputUp(e) {
    // Restore background color
    // $("#" + $(e.target)
    //         .parentsUntil(".match_container")
    //         .parent()
    //         .attr('id'))
    //     .animate({
    //             opacity: 1,
    //             color: "rgb(0, 0, 0)",
    //             backgroundColor: "#FFFFFFFF"
    //         },
    //         100,
    //         'swing');


    // Test if element e is not players details
    var node = e.target.parentNode;
    var match_number;
    while (node != null) {
        if (node.id != undefined) {
            if (node.id.includes("match")) {
                match_number = node.id;
            }
            if (node.id != undefined && node.id.includes('players_details')) {
                return;
            }
        }
        node = node.parentNode;
    }

    // Toggle specific match details
    var match_id = '#players_details_' + match_number;
    $(match_id).collapse('toggle');
    $('[id*="players_details"]').collapse('hide');
}








// Script to regulate tap and scroll on mobiles
var startX,
    startY,
    tap;

function getCoord(e, c) {
    return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
}

function setTap() {
    tap = true;
    setTimeout(function() {
        tap = false;
    }, 500);
}

var deleteTimeout;
var isErasing = false;
$("#history").on('touchstart', function(ev) {
    startX = getCoord(ev, 'X');
    startY = getCoord(ev, 'Y');
    deleteTimeout = setTimeout(function() {
        deleteMatch(ev);
        isErasing = true;
    }, 1000);
    // console.log("touchstart");
}).on('touchend', function(ev) {
    clearTimeout(deleteTimeout);
    // If movement is less than 20px, execute the handler
    if (Math.abs(getCoord(ev, 'X') - startX) < 20 && Math.abs(getCoord(ev, 'Y') - startY) < 20) {
        // Prevent emulated mouse events
        ev.preventDefault();
        if (!isErasing) {
            inputUp(ev);
        } else {
            isErasing = false;
        }
    }
    setTap();
}).mousedown(function(ev) {
    if (!tap) {
        // If handler was not called on touchend, call it on click;
        deleteTimeout = setTimeout(function() {
            deleteMatch(ev);
            isErasing = true;
        }, 1000);
        // inputUp(ev);
    }
    ev.preventDefault();
}).mouseup(function(ev) {
    clearTimeout(deleteTimeout);
    if (!isErasing) {
        inputUp(ev);
    } else {
        isErasing = false;
    }
});



// Method called to get matchs from database then display them in History container
function refreshHistory(previous_matchs_number) {
    db.collection("matches")
        .orderBy("invert_number")
        .limit(matchs_buffer.length + DEFAULT_NUMBER)
        .get()
        .then(function(querySnapshot) {
            matchs_buffer = []; // reset matchs buffer to re-import previous matchs and new ones
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
            for (var i = previous_matchs_number; i <= matchs_buffer.length - 1; i++) {
                reportMatch(matchs_buffer[i], true);
            }

            if (previous_matchs_number == matchs_buffer.length) {
                document.getElementById("load_more_button").innerHTML = 'Y\'a plus <i class="em em-cry"></i>'
            } else {
                document.getElementById("load_more_button").innerHTML = 'Afficher plus <i class="em em-point_down">'
                document.getElementById("load_more_button").disabled = false;
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}



function deleteMatch(e) {
    var match_id = $(e.target).parentsUntil(".match_container").parent().attr('id');

    if (new RegExp('match').test(match_id)) {
        swal({
            title: 'Confirmation',
            text: "Êtes vous sûr de vouloir supprimer ce match ?",
            type: 'warning',
            input: 'text',
            inputPlaceholder: "Quelle est la raison ?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui !',
            cancelButtonText: 'How about no.',
            confirmButtonClass: 'btn btn-success mr-1',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then((result) => {
            if (result.dismiss == "cancel")
                return;
            else if (result.value) {
                var user = firebase.auth().currentUser;

                // Check if user is connected in order to delete matchs
                if (user) {
                    db.collection("matches")
                        .doc(match_id)
                        .get()
                        .then(function(doc) {
                            if (doc.exists) {
                                submitted_match = doc.data();
                                submitted_match.reason = result.value;
                                db.collection("deleted_matchs")
                                    .doc(match_id)
                                    .set(submitted_match)
                                    .then(function(docRef) {
                                        db.collection("matches")
                                            .doc(match_id)
                                            .update({
                                                reason: submitted_match.reason
                                            });

                                        swal({
                                            html: 'Le match a été soumis à un modérateur ! Il sera supprimé si la justification est valide',
                                            type: 'success',
                                            toast: true,
                                            position: 'top-start',
                                            timer: 4500,
                                            showConfirmButton: false,
                                        });

                                        // Add cross icon
                                        $("#" + match_id + " .cross_icon")[0].style.display = "block";

                                    }).catch(function(error) {
                                        swal({
                                            type: 'error',
                                            text: 'Il y a eu un problème lors de la suppression du match',
                                            toast: true,
                                            position: 'top-start',
                                            timer: 3000,
                                            showConfirmButton: false
                                        });
                                    });
                            }
                        });
                } else {
                    swal({
                        type: 'error',
                        html: 'Vous devez vous authentifier pour supprimer des matchs <i class="em em-man-gesturing-no"></i>',
                        toast: true,
                        position: 'top-start',
                        timer: 4500,
                        showConfirmButton: false
                    });
                }
            } else {
                swal({
                    type: 'error',
                    text: 'Veuillez ajouter une raison pour cette suppression',
                    toast: true,
                    position: 'top-start',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        })
    }
}







function AddChartsHTML(n) {
    return '<div class="col-4 pr-2 pl-2">' +
        '<canvas id="doughnutChart' + n + '"></canvas>' +
        '</div>' +
        '<div class="col-4 pr-2 pl-2">' +
        '<canvas id="doughnutChart2' + n + '"></canvas>' +
        '</div>' +
        '<div class="col-4 pr-2 pl-2">' +
        '<canvas id="doughnutChart3' + n + '"></canvas>' +
        '</div>';
}


function addCharts(match) {
    var chart_goals_per_player = document.getElementById("doughnutChart" + match.id);
    var chart_gamelle_per_player = document.getElementById("doughnutChart2" + match.id);
    var chart_betray_per_player = document.getElementById("doughnutChart3" + match.id);

    var CHARTS_HEIGHT = 300; // pixels
    var P1_color = 'rgb(244, 121, 65)';
    var P2_color = 'rgb(244, 196, 65)';
    var P3_color = 'rgb(65, 116, 244)';
    var P4_color = 'rgb(91, 65, 244)';
    chart_goals_per_player.height = chart_gamelle_per_player.height = chart_betray_per_player.height = CHARTS_HEIGHT;

    new Chart(chart_goals_per_player, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    match.player4_goals,
                    match.player3_goals,
                    match.player2_goals,
                    match.player1_goals
                ],
                backgroundColor: [
                    P4_color,
                    P3_color,
                    P2_color,
                    P1_color
                ]
            }],
            labels: [
                "J4",
                "J3",
                "J2",
                "J1"
            ]
        },
        options: {
            legend: {
                display: false
            }
        }
    });

    new Chart(chart_gamelle_per_player, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    match.player4_gamelles,
                    match.player3_gamelles,
                    match.player2_gamelles,
                    match.player1_gamelles
                ],
                backgroundColor: [
                    P4_color,
                    P3_color,
                    P2_color,
                    P1_color
                ]
            }],
            labels: [
                "J4",
                "J3",
                "J2",
                "J1"
            ]
        },
        options: {
            legend: {
                display: false
            }
        }
    });

    new Chart(chart_betray_per_player, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    match.player4_betray,
                    match.player3_betray,
                    match.player2_betray,
                    match.player1_betray
                ],
                backgroundColor: [
                    P4_color,
                    P3_color,
                    P2_color,
                    P1_color
                ]
            }],
            labels: [
                "J4",
                "J3",
                "J2",
                "J1"
            ]
        },
        options: {
            legend: {
                display: false
            }
        }
    });
}