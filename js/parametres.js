// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data = doc.data();
            var list = document.getElementById("players_list");
            list.insertAdjacentHTML('beforeend', "<h2>" + doc.id + "</h2><hr />");
            for (var propertyName in data) {
                switch (data[propertyName]) {
                    case "Claire L.":
                        list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ambulance\"></i>  " + data[propertyName] + "</p>");
                        break;
                    case "Mitsuaki V.":
                        list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-rage\"></i>  " + data[propertyName] + "  <i class=\"em em-anger\"></i></p>");
                        break;
                    // case "Rémi F.":
                    //     list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-turtle\"></i>  " + data[propertyName] + "</p>");
                    //     break;
                    case "Nicolas E.":
                        list.insertAdjacentHTML('beforeend', "<p><i class=\"em em-lying_face\"></i>  " + data[propertyName] + "</p>");
                        break;
                    default:
                        list.insertAdjacentHTML('beforeend', "<p>" + data[propertyName] + "</p>");
                        break;
                }
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

    if (name != "" && team != "") {     // if inputs are not empty
        // Change to loading button
        document.getElementById("add_player").disabled = true;
        document.getElementById("add_player").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";

        db.collection("players").doc(team)  // get document depending on team tag
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {       // if document with team tag exists
                    db.collection("players")
                        .doc(team)
                        .get()
                        .then(function(doc) {
                            data = doc.data();
                            var player_list = Object.keys(data);

                            // Add a player with a new property name
                            data["player" + (parseInt(player_list[player_list.length - 1].split("player")[1]) + 1)] = name;

                            // Set data (previous data + new player) in database
                            db.collection("players").doc(team).set(data)
                                .then(function() {
                                    console.log("Document successfully written!");
                                })
                                .catch(function(error) {
                                    console.error("Error writing document: ", error);
                                });
                        })
                        .catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                } else {    // if document doesn't exist
                    // Create player object
                    var data = {
                        "player1": name
                    };

                    // Add player in database
                    db.collection("players").doc(team).set(data)
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                }

                // Update player list display
                setTimeout(function() {
                    db.collection("players")
                        .get()
                        .then(function(querySnapshot) {
                            // Clear list
                            var list = document.getElementById("players_list").innerHTML = "";

                            // Query player list
                            querySnapshot.forEach(function(doc) {
                                data = doc.data();
                                var list = document.getElementById("players_list");
                                list.insertAdjacentHTML('beforeend', "<h2>" + doc.id + "</h2><hr />");
                                for (var propertyName in data) {
                                    list.insertAdjacentHTML('beforeend', "<p>" + data[propertyName] + "</p>");
                                }
                            });
                        })
                        .catch(function(error) {
                            console.log("Error getting documents: ", error);
                        });

                    // Remove loading button
                    document.getElementById("add_player").disabled = false;
                    document.getElementById("add_player").innerHTML = "Valider";
                }, 200);

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
