//
// function validateData(){
//
//     console.log("innn");
//
//
//   // initializing
//   var college = document.getElementById('college').value;
//   var team_name = document.getElementById('team_name').value;
//   var team_email = document.getElementById('team_email').value;
//   var members = document.getElementById('members').value;
//   var password = document.getElementById('password').value;
//   var message = "";
//
//   // checking empty fields
//
//   if (college == ""){
//     message = "College/Organisation Can't be empty";
//   }
//
//   else if (team_name == ""){
//     message = "Enter your team name";
//
//   }
//   else if (team_email == ""){
//     message = "Enter team's email";
//
//   }
//   else if (team_email != ""){
//       var emailPat = /^(\".*\"|[A-Za-z]\w*)@(\[\d{1,3}(\.\d{1,3}){3}]|[A-Za-z]\w*(\.[A-Za-z]\w*)+)$/
//      var EmailmatchArray = team_email.match(emailPat);
//
//      if (EmailmatchArray == false){
//           message += "Your email address seems incorrect. Please try again.";
//      }
//   }
//   else if(members == ""){
//    message = "Minimum 2 members required";
//  }
//  else if (password.length < 8){
//    message = "Minimum 8 digit password";
//  }
//
//
//   if(message == ""){
//       return true;
//   }
//   else{
//
//      $("#message").html(message);
//      return false;
//   }
//
// }


// Making Ajax Request

//
// function letAjax(ques){
//
// 	var question = $('#'+ques);
// 	var answers;
//
//
// 	if(ques == 'description' || ques == 'targetmarket' || ques == 'competitors' || ques == 'revenue'  ){
//
// 		var q1 = $('#'+ques +" .q1").val();
// 		var q2 = $('#'+ques +" .q2").val();
// 		var q3 = $('#'+ques +" .q3").val();
//
// 		if(q1 == '' ||  q2 == '' || q3 == ''){
// 			question.children("p").html("Fields can't be empty");
// 			return false;
// 		}
//
// 		answers = {
// 			name : ques,
// 			q1 : q1,
// 			q2 : q2,
// 			q3 : q3
// 		};
//
//
// 	}
//
// 	else if(ques == 'problem' || ques == 'solution' || ques == 'status' || ques == 'marketing' || ques == 'qteam'){
//
// 		var q1 = $('#'+ques +" .q1").val();
// 		var q2 = $('#'+ques +" .q2").val();
//
// 		if(q1 == '' ||  q2 == '' ){
// 			question.children("p").html("Fields can't be empty");
// 			return false;
// 		}
//
//
// 		answers = {
// 			name : ques,
// 			q1 : q1,
// 			q2 : q2
// 		};
// 	}
// 	else{
//
// 		var q1 = $('#'+ques +" .q1").val();
//
// 		if(q1 == ''){
// 			question.children("p").html("Fields can't be empty");
// 			return false;
// 		}
//
// 		answers = {
// 			name : ques,
// 			q1 : q1
// 		};
// 	}
//
// 	var req = $.ajax({
// 		url : "/ques-submit",
// 		type: "POST",
// 		data : answers
// 	});
//
// 	req.done(function (data) {
//
// 		console.log(data);
//
//
// 		var main = question.parent().parent().parent();
// 		main.children().children("h4").css({"color":"#bd2620",
// 		"text-decoration": "line-through"});
//
// 		question.children("p").html(data);
//     });
//
// 	req.fail(function(jqXHR, textStatus) {
// 		question.children("p").html("Some Error Occured: "+textStatus);
// 	});
// 	return false;
// }
// function refine(){
//
//                 var nit = document.getElementById("nit").checked;
//                 var paid = document.getElementById("paid").checked;
//
//                 // var table = document.getElementById("table_id");
//
//
//                 if(nit && paid){
//
//                     // console.log("Both");
//
//
//                     $('#table_id tbody tr').each(function(){
//
//
//
//                         var p = $(this).children('.isPaid').html();
//                         var n = $(this).children('.isNIT').html();
//                         console.log(p);
//
//                         if(p=="false" || n == "false"){
//                             $(this).css({"display":"none"});
//                         }
//                         else{
//                             $(this).css({"display":"table-row"});
//                         }
//                     });
//                 }
//                 else if(nit){
//
//                     // console.log("NIT");
//                     $('#table_id tbody tr').each(function(){
//                         var n = $(this).children('.isNIT').html();
//
//                         if(n == "false"){
//                             $(this).css({"display":"none"});
//                         }
//                         else{
//                             $(this).css({"display":"table-row"});
//                         }
//                     });
//
//                 }
//                 else if(paid){
//                     // console.log("PAID");
//                     $('#table_id tbody tr').each(function(){
//                         var p = $(this).children('.isPaid').html();
//
//                         if(p=="false"){
//                             $(this).css({"display":"none"});
//                         }
//                         else{
//                             $(this).css({"display":"table-row"});
//                         }
//                     });
//                 }
//                 else{
//                    // console.log("None");
//                     $('#table_id tbody tr').each(function(){
//
//                         $(this).css({"display":"table-row"});
//
//                     });
//
//                 }
//             }