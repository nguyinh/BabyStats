// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


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

            // If new docSnapshot or if new team in doc
            if ((team_id == null) || (team_id != data.team)) {
                team_id = data.team;
                list.insertAdjacentHTML('beforeend', "<h2>" + team_id + "</h2><hr/>");
            }
            // If same team as before, do nothing particular

            switch (data.name) {
                case "Claire L.":
                    list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ambulance\"></i>  " + data.name + "</p>");
                    break;
                case "Mitsuaki V.":
                    list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-rage\"></i>  " + data.name + "  <i class=\"em em-anger\"></i></p>");
                    break;
                case "Jérémy D.":
                    list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ice_hockey_stick_and_puck\"></i>  " + data.name + "</p>");
                    break;
                case "Nicolas E.":
                    list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-lying_face\"></i>  " + data.name + "</p>");
                    break;
                default:
                    list.insertAdjacentHTML('beforeend', "<p>" + data.name + "</p>");
                    break;
            }
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

    if (name != "" && team != "") { // if inputs are not empty
        // Change to loading button
        document.getElementById("add_player").disabled = true;
        document.getElementById("add_player").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";




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

                                        switch (data.name) {
                                            case "Claire L.":
                                                list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ambulance\"></i>  " + data.name + "</p>");
                                                break;
                                            case "Mitsuaki V.":
                                                list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-rage\"></i>  " + data.name + "  <i class=\"em em-anger\"></i></p>");
                                                break;
                                            case "Jérémy D.":
                                                list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ice_hockey_stick_and_puck\"></i>  " + data.name + "</p>");
                                                break;
                                            case "Nicolas E.":
                                                list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-lying_face\"></i>  " + data.name + "</p>");
                                                break;
                                            default:
                                                list.insertAdjacentHTML('beforeend', "<p>" + data.name + "</p>");
                                                break;
                                        }
                                    });
                                })
                                .catch(function(error) {
                                    console.log("Error getting documents: ", error);
                                });

                            // Clear inputs
                            document.getElementById("name_input").value = "";
                            document.getElementById("team_input").value = "";

                            // Remove loading button
                            document.getElementById("add_player").disabled = false;
                            document.getElementById("add_player").innerHTML = "Valider";
                        }, 200);
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
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
