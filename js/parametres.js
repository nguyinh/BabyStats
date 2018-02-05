// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data = doc.data();
            console.log(doc.id);
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


// Button add player listener
document.getElementById("add_player").addEventListener("click", function() {

    var name = document.getElementById("name_input").value;
    var team = document.getElementById("team_input").value.toUpperCase();

    if (name != "" && team != "") {
        db.collection("players").doc(team)
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) { // if document with team tag exists
                    db.collection("players")
                        .doc(team)
                        .get()
                        .then(function(doc) {
                            data = doc.data();
                            var player_list = Object.keys(data);
                            data["player" + (parseInt(player_list[player_list.length - 1].split("player")[1]) + 1)] = name;

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
                        })
                } else { // if document doesn't exist
                    var data = {
                        "player1": name
                    };

                    db.collection("players").doc(team).set(data)
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
                }

                setTimeout(function() {
                    // Update player list display
                    var list = document.getElementById("players_list").innerHTML = "";

                    db.collection("players")
                        .get()
                        .then(function(querySnapshot) {
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
                }, 200);

            })
            .catch(function(error) {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("Veuillez remplir tous les champs");
    }
});
