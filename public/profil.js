// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Button add player listener
document.getElementById("log_in").addEventListener("click", function() {
    // Clear color inputs
    $("#ID_input").removeClass("is-invalid");
    $("#password_input").removeClass("is-invalid");

    var id = document.getElementById("ID_input").value;
    var password = document.getElementById("password_input").value;

    if (id != "" && password != "") {     // if inputs are not empty
        // Change to loading button
        document.getElementById("log_in").disabled = true;
        document.getElementById("log_in").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        // AUTH ici gros

        //...

    }
    else {
        // Put inputs in red if missing
        if (id == "")
            $("#ID_input").addClass("is-invalid");
        if (password == "")
            $("#password_input").addClass("is-invalid");
    }
});
