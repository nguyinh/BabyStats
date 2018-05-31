// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('profile_name').innerHTML = '<img id="profile_picture" alt="Photo" src="../blank_profile.png" style="width: 2rem; height:2rem; border-radius: 50%;" class="mr-2">' + user.displayName
        document.getElementById('profile_picture').src = (user.photoURL != null ? user.photoURL : "../blank_profile.png");
    }
});

function emojization(from, to) {
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

RefreshPlayerList();

// Get all players from database and PSA teams then fill 'select' elements with it
function RefreshPlayerList() {
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
                if (!data.isActive)
                    return;

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
}






// Button add player listener
document.getElementById("add_player").addEventListener("click", function() {

    // Clear color inputs
    $("#name_input").removeClass("is-invalid");
    $("#lastname_input").removeClass("is-invalid");
    $("#team_input").removeClass("is-invalid");

    var name = document.getElementById("name_input").value.trim();
    var lastname = document.getElementById("lastname_input").value.trim();
    var team = document.getElementById("team_input").value.toUpperCase().trim();

    // If inputs are not empty (=valid)
    if (name != "" && lastname != "" && team != "") {
        // Change to loading button
        document.getElementById("add_player").disabled = true;
        document.getElementById("add_player").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";

        name = name.charAt(0).toUpperCase() + name.slice(1);
        var fullname = name + " " + lastname.charAt(0).toUpperCase() + ".";

        // Add player to database
        db.collection("players")
            .orderBy("number")
            .get()
            .then(docSnapshot => {

                // Change name if already present
                sorted_names = [];
                for (i = 0; i < docSnapshot.docs.length; i++) {
                    sorted_names.push(docSnapshot.docs[i].data().name); // get all names
                }
                sorted_names = sorted_names.sort(); // sort alphabetically

                var past_names = [];
                var n = lastname.length - 2;
                for (i = 0; i < sorted_names.length; i++) {
                    if (!past_names.includes(sorted_names[i])) { // if name has already been compared, pass
                        while (sorted_names[i] == fullname) {
                            // Add a letter to the last name until it is different from others
                            if (lastname.slice(lastname.length - n - 1, lastname.length - n) == " ")
                                n--;
                            fullname = name.charAt(0).toUpperCase() + name.slice(1) + " " + lastname.charAt(0).toUpperCase() + lastname.slice(1, lastname.length - n--) + ".";
                            if (n < 0) { // if all letters failed, return error
                                swal({
                                    html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                    type: 'error',
                                    toast: true,
                                    position: 'top-start',
                                    timer: 3000,
                                    showConfirmButton: false
                                });

                                // Remove loading button
                                document.getElementById("add_player").disabled = false;
                                document.getElementById("add_player").innerHTML = "Valider";
                                return;
                            }
                        }
                        past_names.push(sorted_names[i]);
                    }
                }

                // New player object
                var added_player = {
                    number: 1, // used to sort data when is get
                    invert_number: -1,
                    name: fullname,
                    last_name: lastname,
                    first_name: name,
                    team: team,
                    goals: 0,
                    gamelles: 0,
                    betrays: 0,
                    wins: 0,
                    defeats: 0,
                    isActive: true,
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
                                        html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                        type: 'error',
                                        toast: true,
                                        position: 'top-start',
                                        timer: 3000,
                                        showConfirmButton: false
                                    });
                                });

                            // Clear inputs
                            document.getElementById("name_input").value = "";
                            document.getElementById("lastname_input").value = "";
                            document.getElementById("team_input").value = "";

                            // Remove loading button
                            document.getElementById("add_player").disabled = false;
                            document.getElementById("add_player").innerHTML = "Valider";

                            var quotes = [name + ", c'est un joli prénom <i class=\"em em-smirk\"></i>",
                                "Salut " + name + ", que la force soit avec toi <i class=\"em em-pray\"></i>",
                                "Ah " + name + " ! On t'attendait <i class=\"em em-wink\"></i>",
                                "Penses à bien t'échauffer les poignets " + name + " <i class=\"em em-raised_hands\"></i>"
                            ]

                            swal({
                                html: quotes[Math.floor(Math.random() * quotes.length)],
                                type: 'success',
                                toast: true,
                                position: 'top-start',
                                timer: 3000,
                                showConfirmButton: false
                            });
                        }, 200);
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                        swal({
                            html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                            type: 'error',
                            toast: true,
                            position: 'top-start',
                            timer: 3000,
                            showConfirmButton: false
                        });
                    });



            })
            .catch(function(error) {
                console.log("Error getting document:", error);
                swal({
                    html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                    type: 'error',
                    toast: true,
                    position: 'top-start',
                    timer: 3000,
                    showConfirmButton: false
                });
            });

    } else {
        // Put inputs in red if missing
        if (name == "")
            $("#name_input").addClass("is-invalid");
        if (name == "")
            $("#lastname_input").addClass("is-invalid");
        if (team == "")
            $("#team_input").addClass("is-invalid");
    }
});




// Delete functionnality on match element hold
// var pressTimer;

// Computer navigation
// $("#history").mouseup(function(e) {
//     if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
//         inputUp(e);
//     }
//
//
//     return false;
//
// }).mousedown(function(e) {
//     if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
//         inputDown(e);
//     }
//     return false;
// });




// Mobile navigation
// $("#players_list").on("touchstart", function(e) {
//     inputDown(e);
// });
//
// $("#players_list").on("touchend", function(e) {
//     inputUp(e);
// });


// function inputDown(e) {
//     pressTimer = window.setTimeout(function() {
//         // Check if element is a player name
//         var playerName;
//         if (e.target.tagName == "P")
//             if (e.target.innerHTML.includes("</i>"))
//                 playerName = e.target.innerHTML.split("</i>")[1];
//             else
//                 playerName = e.target.innerHTML;
//         else if (e.target.tagName == "I")
//             if (e.target.parentElement.innerHTML.includes("</i>"))
//                 playerName = e.target.parentElement.innerHTML.split("</i>")[1];
//             else
//                 playerName = e.target.parentElement.innerHTML;
//         else
//             return;
//
//         // Display delete confirmation
//         swal({
//             title: 'Confirmation',
//             text: "Êtes vous sûr de vouloir supprimer " + playerName + " ?",
//             type: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Définitivement',
//             cancelButtonText: 'Non',
//             confirmButtonClass: 'btn btn-success mr-1',
//             cancelButtonClass: 'btn btn-danger',
//             buttonsStyling: false
//         }).then((result) => {
//             if (result.value) {
//                 var playerId;
//                 // Search for player document id
//                 var ref = db.collection("players")
//                     .where("name", "==", playerName)
//                     .get()
//                     .then(function(querySnapshot) {
//                         querySnapshot.forEach(function(doc) {
//                             playerId = doc.id;
//
//                             // Delete player depending on its player Id
//                             if (playerId != "") {
//                                 db.collection("players").doc(playerId).delete().then(function() {
//                                     swal(
//                                         'Succès',
//                                         'Adieu ' + doc.data().first_name + ' ' + doc.data().last_name + ' <i class="em em-wave"></i><i class="em em-cry"></i>',
//                                         'success'
//                                     );
//
//
//                                     RefreshPlayerList();
//
//
//                                 }).catch(function(error) {
//                                     swal({
//                                         type: 'error',
//                                         title: 'Erreur',
//                                         text: 'Erreur lors de la suppression du joueur ' + doc.data().first_name + ' ' + doc.data().last_name
//                                     });
//                                 });
//                             }
//                         }) // querySnapshot.forEach(function(doc) {
//                     }); // .then(function(querySnapshot) {
//             } // if () {
//         }) //.then((result) => {
//     }, 1000);
// }


// function inputUp(e) {
//     // $({
//     //     blurRadius: 0
//     // }).animate({
//     //     blurRadius: 10
//     // }, {
//     //     duration: 500,
//     //     easing: 'swing', // or "linear"
//     //     // use jQuery UI or Easing plugin for more options
//     //     step: function() {
//     //         $(e.target).css({
//     //             "-webkit-filter": "blur(" + this.blurRadius + "px)",
//     //             "filter": "blur(" + this.blurRadius + "px)"
//     //         });
//     //     }
//     // });
//     clearTimeout(pressTimer);
// }