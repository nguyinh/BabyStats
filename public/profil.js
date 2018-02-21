// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
document.getElementById("affiche_confirm").style.display ="none"

$('input[type=radio]').change( function() {
   var signin = document.getElementById('signin').checked;
   if(signin == false){
     document.getElementById("affiche_confirm").style.display ="block";
   }
   else {
     document.getElementById("affiche_confirm").style.display ="none";
   }
});

// Button add player listener
document.getElementById("log_in").addEventListener("click", function() {
    // Clear color inputs
    $("#ID_input").removeClass("is-invalid");
    $("#password_input").removeClass("is-invalid");
    $("#password_confirm_input").removeClass("is-invalid");
    // Clear color inputs
    var id = document.getElementById("ID_input").value;
    var password = document.getElementById("password_input").value;
    var password_confirm = document.getElementById("password_confirm_input").value;
    var signin = document.getElementById('signin').checked;
    console.log(id + password + password_confirm);
    document.getElementById("log_in").disabled = false;
    //SIGN IN
    if (id != "" && password != "" && signin == true) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    }
    else if (id != "" && password != ""  && signin == false) {     // if inputs are not empty and the password is not the same of password confirm
        // AUTH ici gros
        if(password == password_confirm){
          firebase.auth().createUserWithEmailAndPassword(id, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("error_info").style.display ="block";
            document.getElementById("error_message").style.display ="block";
            $("#error_message").removeClass("text-success");
            $("#error_message").addClass("text-danger");
            var errortxt = document.getElementById("error_message");
            errortxt.textContent = errorMessage;
            console.log(errorCode);
            if (errorCode == "auth/invalid-email"){
              $("#ID_input").addClass("is-invalid");
            }
            if (errorCode == "auth/weak-password"){
              $("#password_input").addClass("is-invalid");
              $("#password_confirm_input").addClass("is-invalid");
            }});
            document.getElementById("error_info").style.display ="block";
            document.getElementById("error_message").style.display ="block";
            $("#error_message").removeClass("text-danger");
            $("#error_message").addClass("text-success");
            var errortxt = document.getElementById("error_message");
            errortxt.textContent = "Successfull profil creation.";
        }
        else {
            document.getElementById("error_info").style.display ="block";
            document.getElementById("error_message").style.display ="block";
            var errortxt = document.getElementById("error_message");
            errortxt.textContent = "Password and Password confirmation must be the same.";
            $("#password_input").addClass("is-invalid");
            $("#password_confirm_input").addClass("is-invalid");
        }}
    else {
    if (id == "")
        $("#ID_input").addClass("is-invalid");
    if (password == "")
        $("#password_input").addClass("is-invalid");
    if (password == "")
        $("#password_confirm_input").addClass("is-invalid");
    }
});
