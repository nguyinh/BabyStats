// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


function emojization(from, to) {
    console.log(from);
    switch (from) {
        case "Elise G.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-cheese_wedge\"></i>  " + from + "</p>");
            break;
        case "Claire L.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ambulance\"></i>  " + from + "</p>");
            break;
        case "Mitsuaki V.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-anger\"></i>  " + from + "  </p>");
            break;
        case "Jérémy D.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ice_hockey_stick_and_puck\"></i>  " + from + "</p>");
            break;
        case "Nicolas E.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-lying_face\"></i>  " + from + "</p>");
            break;
        default:
            to.insertAdjacentHTML('beforeend', "<p>" + from + "</p>");
            break;
    }
}


// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players")
    .orderBy("team")
    .get()
    .then(function(querySnapshot) {
        // Clear list
        document.getElementById("players_list").innerHTML = "";

        // Query players list
        var team_id = null;
        querySnapshot.forEach(function(doc) {
            var list = document.getElementById("players_list");
            data = doc.data();

            // If new docSnapshot
            if (team_id == null) {
                team_id = data.team;
                list.insertAdjacentHTML('beforeend', "<h2>" + team_id + "</h2><hr/>");
            }
            // If new team, add some margin
            else if (team_id != data.team) {
                team_id = data.team;
                list.insertAdjacentHTML('beforeend', "<h2 class=\"mt-3\">" + team_id + "</h2><hr/>");
            }
            // Emoji tag
            emojization(data.name, list);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });






// Button add player listener
document.getElementById("add_player").addEventListener("click", function() {

    // Clear color inputs
    $("#name_input").removeClass("is-invalid");
    $("#team_input").removeClass("is-invalid");

    var name = document.getElementById("name_input").value;
    var team = document.getElementById("team_input").value.toUpperCase();

    // If inputs are not empty (=valid)
    if (name != "" && team != "") {
        // Change to loading button
        document.getElementById("add_player").disabled = true;
        document.getElementById("add_player").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";


        // Add player to database
        db.collection("players")
            .orderBy("number")
            .get()
            .then(docSnapshot => {

                // New player object
                var added_player = {
                    number: 1, // used to sort data when is get
                    invert_number: -1,
                    name: name,
                    team: team,
                    goals: 0,
                    gamelles: 0,
                    betrays: 0,
                    wins: 0,
                    defeats: 0,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                // If there is at least one player in "players" collection
                if (docSnapshot.docs.length != 0) {
                    // Get the last visible document (= last match played)
                    added_player.number = docSnapshot.docs[docSnapshot.docs.length - 1].data().number + 1;
                    added_player.invert_number = -docSnapshot.docs[docSnapshot.docs.length - 1].data().number - 1;
                }

                db.collection("players")
                    .doc("player" + added_player.number)
                    .set(added_player)
                    .then(function() {
                        // Update player list display
                        setTimeout(function() {
                            db.collection("players")
                                .orderBy("team")
                                .get()
                                .then(function(querySnapshot) {
                                    // Clear list
                                    document.getElementById("players_list").innerHTML = "";

                                    // Query players list
                                    var team_id = null;
                                    querySnapshot.forEach(function(doc) {
                                        var list = document.getElementById("players_list");
                                        data = doc.data();

                                        // If new docSnapshot or if new team in doc
                                        if ((team_id == null) || (team_id != data.team)) {
                                            team_id = data.team;
                                            list.insertAdjacentHTML('beforeend', "<h2>" + team_id + "</h2><hr/>");
                                        }
                                        // If same team as before, do nothing particular

                                        // Emoji tag
                                        emojization(data.name, list);
                                    });
                                })
                                .catch(function(error) {
                                    console.log("Error getting documents: ", error);
                                    swal({
                                        type: 'error',
                                        title: 'Erreur',
                                        text: 'Il semble que l\'ajout du joueur a échoué <i class=\"em em-confused\"></i>'
                                    });
                                });

                            // Clear inputs
                            document.getElementById("name_input").value = "";
                            document.getElementById("team_input").value = "";

                            // Remove loading button
                            document.getElementById("add_player").disabled = false;
                            document.getElementById("add_player").innerHTML = "Valider";

                            swal(
                                'Succès',
                                'On dirait qu\'on a un nouveau joueur <i class=\"em em-wink\"></i>',
                                'success'
                            );
                        }, 200);
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                        swal({
                            type: 'error',
                            title: 'Erreur',
                            text: 'Il semble que l\'ajout du joueur a échoué <i class=\"em em-confused\"></i>'
                        });
                    });



            })
            .catch(function(error) {
                console.log("Error getting document:", error);
            });

    } else {
        // Put inputs in red if missing
        if (name == "")
            $("#name_input").addClass("is-invalid");
        if (team == "")
            $("#team_input").addClass("is-invalid");
    }
});
