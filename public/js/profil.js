// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

function afficheProfil() {
    var user = firebase.auth().currentUser;
    if (user) {
        // User is signed in.
        clearArea();
        document.getElementById('affiche_connect').style.display = 'none';
        document.getElementById('affiche_profil').style.display = 'block';
        var name_dispayer = document.getElementById("player_name")
        name_dispayer.innerHTML = user.displayName;
    } else {
        // No user is signed in.
        console.log('Grave erreur dans la fonction afficheProfil');
    }
}

document.getElementById('signup').addEventListener('click', function() {
    $(".signin_form").css("display", "block");
    $("#signin").removeClass("mb-3");
    clearArea();
    this.style.display = "none";
    document.getElementById('signin').style.display = "block";
    document.getElementById('error_info').style.display = 'none';
    document.getElementById('error_message').style.display = 'none';
    document.getElementById('affiche_confirm').style.display = 'block';
    document.getElementById('affiche_name').style.display = 'block';
});

document.getElementById('signin').addEventListener('click', function() {
    $(".signin_form").css("display", "block");
    $("#signin").removeClass("mb-3");
    clearArea();
    this.style.display = "none";
    document.getElementById('signup').style.display = "block";
    document.getElementById('error_info').style.display = 'none';
    document.getElementById('error_message').style.display = 'none';
    document.getElementById('affiche_confirm').style.display = 'none';
    document.getElementById('affiche_name').style.display = 'none';
});

document.getElementById('log_out').addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        $(".signin_form").css("display", "block");
        $("#signin").removeClass("mb-3");
        clearArea();
        this.style.display = "none";
        document.getElementById('signup').style.display = "block";
        document.getElementById('error_info').style.display = 'none';
        document.getElementById('error_message').style.display = 'none';
        document.getElementById('affiche_confirm').style.display = 'none';
        document.getElementById('affiche_name').style.display = 'none';
    }).catch(function(error) {
        // An error happened.
    });
});

// Button add player listener
document.getElementById('log_in').addEventListener('click', function() {
    // Clear color inputs
    $('#ID_input').removeClass('is-invalid');
    $('#password_input').removeClass('is-invalid');
    $('#password_confirm_input').removeClass('is-invalid');
    // $('#password_input').removeClass('is-invalid');
    // $('#password_confirm_input').removeClass('is-invalid');
    // Get informations
    var name = document.getElementById('name_input').value;
    var last_name = document.getElementById('lastname_input').value;
    var email = document.getElementById('ID_input').value;
    var password = document.getElementById('password_input').value;
    var password_confirm = document.getElementById('password_confirm_input').value;
    var signin = document.getElementById('signup').style.display == "block";
    document.getElementById('log_in').disabled = false;
    //SIGN IN
    if (email != '' && password != '' && signin == true) {
        document.getElementById("log_in").disabled = true;
        document.getElementById("log_in").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            $('#ID_input').addClass('is-invalid');
            $('#password_input').addClass('is-invalid');
            $('#error_message').removeClass('text-success');
            $('#error_message').addClass('text-danger');
            var errortxt = document.getElementById('error_message');
            document.getElementById('error_info').style.display = 'block';
            document.getElementById('error_message').style.display = 'block';
            errortxt.textContent = 'Adresse e-mail ou mot de passe incorrect';
        });
    } else if (email != '' && password != '' && signin == false) {
        //SIGN UP code is executed when signin radio button isn't checked, and that ID and Password is not empty
        //The first thing to create an account is to put a name, a mail and a proper password
        if (password == password_confirm) {
            document.getElementById("log_in").disabled = true;
            document.getElementById("log_in").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                document.getElementById('error_info').style.display = 'block';
                document.getElementById('error_message').style.display = 'block';
                $('#error_message').removeClass('text-success');
                $('#error_message').addClass('text-danger');
                var errortxt = document.getElementById('error_message');
                errortxt.textContent = errorMessage;
                if (errorCode == 'auth/invalid-email') {
                    $('#ID_input').addClass('is-invalid');
                }
                if (errorCode == 'auth/weak-password') {
                    $('#password_input').addClass('is-invalid');
                    $('#password_confirm_input').addClass('is-invalid');
                }
            });
        } else {
            document.getElementById('error_info').style.display = 'block';
            document.getElementById('error_message').style.display = 'block';
            var errortxt = document.getElementById('error_message');
            errortxt.textContent = 'Les mots de passe sont différents';
            $('#password_input').addClass('is-invalid');
            $('#password_confirm_input').addClass('is-invalid');
        }
    } else {
        if (name == '')
            $('name_input').addClass('is-invalid');
        if (last_name == '')
            $('#lastname_input').addClass('is-invalid');
        if (email == '')
            $('#ID_input').addClass('is-invalid');
        if (password == '')
            $('#password_input').addClass('is-invalid');
        if (password == '')
            $('#password_confirm_input').addClass('is-invalid');
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        document.getElementById("log_in").disabled = false;
        document.getElementById("log_in").innerHTML = "Se connecter";
        if (document.getElementById('signin').style.display == "none") {
            afficheProfil();
            clearArea();
        } else {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: document.getElementById('name_input').value,
            }).then(function() {
                document.getElementById('error_info').style.display = 'block';
                document.getElementById('error_message').style.display = 'block';
                $('#error_message').removeClass('text-danger');
                $('#error_message').addClass('text-success');
                var errortxt = document.getElementById('error_message');
                errortxt.textContent = 'Successfull profil creation.';
                afficheProfil();

            }).catch(function(error) {
                document.getElementById('error_info').style.display = 'block';
                document.getElementById('error_message').style.display = 'block';
                $('#error_message').removeClass('text-success');
                $('#error_message').addClass('text-danger');
                var errortxt = document.getElementById('error_message');
                console.log(error.message);
                errortxt.textContent = error.errorMessage;
            });
        }
    } else {
        afficheSignin();
        clearArea();
    }
});

function afficheSignin() {
    document.getElementById('affiche_profil').style.display = 'none';
    document.getElementById('affiche_connect').style.display = 'block';
}

function clearArea() {
    $('#name_input').val('');
    $('#lastname_input').val('');
    $('#ID_input').val('');
    $('#password_input').val('');
    $('#password_confirm_input').val('');
    $('#name_input').removeClass('is-invalid');
    $('#lastname_input').removeClass('is-invalid');
    $('#ID_input').removeClass('is-invalid');
    $('#password_input').removeClass('is-invalid');
    $('#password_confirm_input').removeClass('is-invalid');
}







// db.collection("matches")
//     .doc("match46")
//     .get()
//     .then(function(docRef) {
//         db.collection("deleted_matchs")
//             .doc(docRef.id)
//             .set(docRef.data())
//             .then(function() {
//                 console.log("sucess");
//             }).catch(function(error) {
//                 console.log("Error getting documents: ", error);
//             });
//     });



var matchs_buffer = [];
refreshHistory(matchs_buffer.length);



// Method called to get matchs from database then display them in History container
function refreshHistory(previous_matchs_number) {
    db.collection("deleted_matchs")
        .orderBy("invert_number")
        .get()
        .then(function(querySnapshot) {
            // Reveal deleted matchs ONLY if user is admin (he would receive matchs data)
            document.getElementById("submit_card").style.display = "block";

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
        })
        .catch(function(error) {
            // If user is not admin, don't display deleted matchs
            console.log("Error getting documents: ", error);
        });
}


function reportMatch(match, addToEnd) {

    var match_template = document.getElementById("template").cloneNode(true); // copy template node
    var history = document.getElementById("history"); // get history div element (contains all matches)
    match_template.id = match.id; // give id depending on match number

    // Add match informations
    match_template.querySelector("#player1").innerHTML = match.player1;
    match_template.querySelector("#player2").innerHTML = match.player2;
    match_template.querySelector("#player3").innerHTML = match.player3;
    match_template.querySelector("#player4").innerHTML = match.player4;
    match_template.querySelector("#team1score").innerHTML = match.score1;
    match_template.querySelector("#team2score").innerHTML = match.score2;
    match_template.querySelector("#timestamp").innerHTML = match.date;
    match_template.querySelector(".reason").innerHTML = match.reason;

    match_template.querySelector("#delete_button").addEventListener("click", function(e) {
        swal({
            title: 'Supression',
            text: 'C\'est irréversible ! Est-ce votre dernier mot ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui Jean-Pierre',
            cancelButtonText: 'Non'
        }).then((result) => {
            if (result.value) {
                e.path[4].children[0].children[1].innerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:3rem"></i>';

                db.collection("deleted_matchs")
                    .doc(e.path[4].id)
                    .delete()
                    .then(function() {
                        db.collection("matches")
                            .doc(e.path[4].id)
                            .delete()
                            .then(function() {
                                swal(
                                    'Adieu',
                                    'Le match a bien été supprimé !',
                                    'success'
                                );
                            });
                        // Remove match from html
                        e.path[4].parentNode.removeChild(e.path[4]);
                    }).catch(function(error) {
                        swal(
                            'Oops',
                            'Une erreur est survenue pendant la supression ...',
                            'error'
                        )
                    });
            }
        })
    });

    match_template.querySelector("#restore_button").addEventListener("click", function(e) {
        e.path[4].children[0].children[1].innerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:3rem"></i>';

        db.collection("deleted_matchs")
            .doc(e.path[4].id)
            .delete()
            .then(function() {                
                db.collection("matches")
                    .doc(e.path[4].id)
                    .update({
                        reason: ""
                    })
                    .then(function() {
                        swal(
                            'C\'est fait !',
                            'Le match a bien été restauré !',
                            'success'
                        );

                        // Remove match from html
                        e.path[4].parentNode.removeChild(e.path[4]);
                    });
            }).catch(function(error) {
                swal(
                    'Oops',
                    'Une erreur est survenue pendant la restauration ...',
                    'error'
                )
            });
    });

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
}
