// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


// --------------- Players list ---------------
var player1select = document.getElementById('player1_input');
var player2select = document.getElementById('player2_input');
var player3select = document.getElementById('player3_input');
var player4select = document.getElementById('player4_input');

var selectsElements = [player1select, player2select, player3select, player4select];

// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data = doc.data();
            console.log(doc.id);

            for (var i = 0; i < selectsElements.length; i++) {
                selectsElements[i].insertAdjacentHTML('beforeend', "<optgroup label=\"" + doc.id + "\">"); // insert PSA team name as title
                for (var propertyName in data) {
                    var opt = document.createElement('option');
                    opt.value = data[propertyName];
                    opt.innerHTML = data[propertyName];
                    selectsElements[i].appendChild(opt);
                }
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });




// --------------- Scores list ---------------
var score1select = document.getElementById("score1_input");
var score2select = document.getElementById("score2_input");

var opt1 = document.createElement('option');
var opt2 = document.createElement('option');
opt1.value = "";
opt1.innerHTML = "";
opt2.value = "";
opt2.innerHTML = "";
score1select.appendChild(opt1);
score2select.appendChild(opt2);

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
var match_number = 1;

function reportMatch(P1, P2, P3, P4, S1, S2) {

    var match_template = document.getElementById("template").cloneNode(true); // copy template node
    var history = document.getElementById("history"); // get history div element (contains all matches)
    match_template.id = "match" + (parseInt(history.children.length) + 1); // give id depending on match number

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
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-success\" disabled>Victoire</button>");
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-danger\" disabled>Défaite</button>");
    } else {
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-danger\" disabled>Défaite</button>");
        node.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-sm btn-success\" disabled>Victoire</button>");
    }

    if (history.firstChild != null) {
        match_template.insertAdjacentHTML('beforeend', "<hr/>");
    }

    // add match to history
    history.insertBefore(match_template, history.firstChild);
}





// --------------- History ---------------
// Get all matches and display them
db.collection("matches")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data();
            console.log(doc.id, " => ", data);
            reportMatch(data.player1, data.player2, data.player3, data.player4, data.score1, data.score2);
            // match_number = data.id
            match_number = parseInt(doc.id.split("match")[1]);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });



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

    // Check for errors (ex: name not specified)
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].options[inputs[i].selectedIndex].text == "") {
            console.log("ERREUR INPUTS");
            return;
        }
    }

    // Create match object
    var reported_match = {
        player1: inputs[0].options[inputs[0].selectedIndex].text,
        player2: inputs[1].options[inputs[1].selectedIndex].text,
        player3: inputs[2].options[inputs[2].selectedIndex].text,
        player4: inputs[3].options[inputs[3].selectedIndex].text,
        score1: parseInt(inputs[4].options[inputs[4].selectedIndex].text),
        score2: parseInt(inputs[5].options[inputs[5].selectedIndex].text)
    };

    // Publish to Database
    // TODO : Check if exists, if not ADD document
    db.collection("matches")
        .get()
        .then(function(documentSnapshots) {
            // Get the last visible document
            var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

            console.log("match" + (parseInt(lastVisible.id.split("match")[1])+1));
            console.log(reported_match);

            db.collection("matches")
                .doc("match" + (parseInt(lastVisible.id.split("match")[1])+1))
                .set(reported_match)
                .then(function(docRef) {
                    // console.log("Document written with ID: ", docRef.id);

                    setTimeout(function() {
                        // Get this match and display it
                        db.collection("matches").doc("match" + (parseInt(lastVisible.id.split("match")[1])+1)).get().then(function(doc) {
                            if (doc.exists) {
                                data = doc.data();
                                reportMatch(data.player1, data.player2, data.player3, data.player4, data.score1, data.score2);
                            } else {
                                console.log("match" + match_number);
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });
                    }, 500);
                })


        });


    //     db.collection("matches").doc("match" + ++match_number).set(reported_match)
    //         .then(function(docRef) {
    //             console.log("Document written with ID: ", docRef.id);
    //
    //                 // Get this match and display it
    //                 db.collection("matches").doc("match" + (parseInt(match_number)).toString()).get().then(function(doc) {
    //                     if (doc.exists) {
    //                         data = doc.data();
    //                         reportMatch(data.player1, data.player2, data.player3, data.player4, data.score1, data.score2);
    //                     } else {
    //                         console.log("match" + match_number);
    //                         console.log("No such document!");
    //                     }
    //                 }).catch(function(error) {
    //                     console.log("Error getting document:", error);
    //                 });
    //
    //         })
    //         .catch(function(error) {
    //             console.error("Error adding document: ", error);
    //
    //             console.log(match_number);
    //
    //             // Get this match and display it
    //             db.collection("matches").doc("match" + (parseInt(match_number)).toString())
    //                 .get()
    //                 .then(function(doc) {
    //                     if (doc.exists) {
    //                         data = doc.data();
    //                         reportMatch(data.player1, data.player2, data.player3, data.player4, data.score1, data.score2);
    //                     } else {
    //                         console.log("match" + match_number);
    //                         console.log("No such document!");
    //                     }
    //                 }).catch(function(error) {
    //                     console.log("Error getting document:", error);
    //                 });
});



// TODO : clean inputs when validate
// TODO : Add error messages when wrong thing happens when validate
// TODO : Limit history match number to display
