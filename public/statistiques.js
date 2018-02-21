// Initialize Cloud Firestore through Firebase
// Script.js avec set : ajouter à la base de données


var db = firebase.firestore();
var data
var test = ["okokok"]
var final_data
db.collection("players").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    data = doc.data();
    // console.log(players);
    // console.log(doc.id);
    // console.log(data["player1"]);
    // console.log(data.player1);
    // for (var player in players) {
    //   console.log(player)
    // }
    test.push(data)
    return test
  })
});
console.log(test)




// Comment faire rentrer des variables dans le code R ?
ocpu.seturl("//public.opencpu.org/ocpu/library/base/R")
var code_R = $("#code_R").load("test.txt", function() {
  // console.log(code_R.innerHTML);
})[0];

var mysnippet = new ocpu.Snippet("");
var req = ocpu.call("identity", {
  "x": mysnippet
}, function(session) {
  session.getConsole(function(outtxt) {
    $("#output").text(outtxt);
  });
});


//because identity is in base


//document.getElementbyId("submitbutton").addEventListener("click", function {})



  //if R returns an error, alert the error message
  req.fail(function() {
    alert("Server error: " + req.responseText);
  });

  req.always(function() {
    $("button").removeAttr("disabled");
  });
