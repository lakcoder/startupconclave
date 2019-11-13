var max_fields      = 10;
var wrapper         = $(".input_fields_wrap");
var add_button      = $(".add_field_button");
var remove_button   = $(".remove_field_button");

$(add_button).click(function(e){
	e.preventDefault();
	var total_fields = wrapper[0].childNodes.length;
	if(total_fields < max_fields){
		$(wrapper).append('<input type="text" name="answer[]" class="field-long" />');
	}
});
$(remove_button).click(function(e){
	e.preventDefault();
	var total_fields = wrapper[0].childNodes.length;
	if(total_fields>1){
		wrapper[0].childNodes[total_fields-1].remove();
	}
});



var members = $("#members");
var permanent = $(".permanent");
var lock = $("#lock:checked");
var temp = $(".temp");
const my = '<div class="temp row g-margin-b-50--xs">'
                            + '<div class="col-sm-6 g-margin-b-30--xs g-margin-b-0--md">'
                                +'<input type="text" class="form-control s-form-v3__input" placeholder="* Member 1">'
                            +'</div>'
                            +'<div class="col-sm-6">'
                              +'  <input type="text" class="form-control s-form-v3__input" placeholder="* Phone 1">'
                            +'</div>'
                        +'</div>';

function stringvalue(i){
	return '<div class="temp row g-margin-b-50--xs">'
                            + '<div class="col-sm-4 g-margin-b-30--xs g-margin-b-0--md">'
                                +'<input type="text" class="form-control s-form-v3__input" name="membername'+i+'" placeholder="* Member '+i+'">'
                            +'</div>'
                            +'<div class="col-sm-4">'
                              +'  <input type="text" class="form-control s-form-v3__input" name="memberemail'+i+'" placeholder="* Email '+i+'">'
                            +'</div>'
							+'<div class="col-sm-4">'
                              +'  <input type="text" class="form-control s-form-v3__input" name="memberphone'+i+'" placeholder="* Phone '+i+'">'
                            +'</div>'
                        +'</div>';
}

// alert(members.val());
$(document).ready(function(){
	members.on("change", function(e){

		e.preventDefault();
		$(".temp").remove();
		// permanent.append("<div class='temp'></div>");
		for(var i=1; i<= members.val(); i++){
			permanent.append(stringvalue(i));
		}

	});



$("#forgot").on("click", function(){

	var email = $("#e").val();


	var re = /^(\".*\"|[A-Za-z]\w*)@(\[\d{1,3}(\.\d{1,3}){3}]|[A-Za-z]\w*(\.[A-Za-z]\w*)+)$/;
	var match  = re.test(email);
	var error =  $("#error");

	if (match == false){


		error.html("Kindly enter valid email");
		error.css({"display": "block"});
		return false;
	}
	else{
		error.css({"display": "none"});
		console.log("ffefe");
		return true;
	}


});


});
	// lock.toggle();

	$(".cbp-caption-defaultWrap").click(function(){
		var par = $(this).parent(".cbp-caption");
		par.children(".faq_con").toggle({"display":"block"});
});



function letAjax(e){var t,r=$("#"+e);if("description"==e||"targetmarket"==e||"competitors"==e||"revenue"==e){var n=$("#"+e+" .q1").val(),l=$("#"+e+" .q2").val(),a=$("#"+e+" .q3").val();if(""==n||""==l||""==a)return r.children("p").html("Fields can't be empty"),!1;t={name:e,q1:n,q2:l,q3:a}}else if("problem"==e||"solution"==e||"status"==e||"marketing"==e||"qteam"==e){n=$("#"+e+" .q1").val(),l=$("#"+e+" .q2").val();if(""==n||""==l)return r.children("p").html("Fields can't be empty"),!1;t={name:e,q1:n,q2:l}}else{if(""==(n=$("#"+e+" .q1").val()))return r.children("p").html("Fields can't be empty"),!1;t={name:e,q1:n}}var i=$.ajax({url:"/ques-submit",type:"POST",data:t});return i.done(function(e){console.log(e),r.parent().parent().parent().children().children("h4").css({color:"#bd2620","text-decoration":"line-through"}),r.children("p").html(e)}),i.fail(function(e,t){r.children("p").html("Some Error Occured: "+t)}),!1}



var membersFinal = $("#members-final");
var permanentFinal = $(".permanent-final");
var lock = $("#lock:checked");



function stringvalue2(i){
	return '<div class="temp row g-margin-b-50--xs">'
                            + '<div class="col-sm-4 g-margin-b-30--xs g-margin-b-0--md">'
                                +'<input type="text" class="form-control s-form-v3__input" name="membername'+i+'" placeholder="* Member Name '+i+'">'
                            +'</div>'
                            +'<div class="col-sm-4">'
                              +'  <input type="text" class="form-control s-form-v3__input" name="memberad'+i+'" placeholder="* Adhaar Number '+i+'">'
                            +'</div>'
							+'<div class="col-sm-4">'
                              +'  <input type="text" class="form-control s-form-v3__input" name="memberphone'+i+'" placeholder="* Mobile '+i+'">'
                            +'</div>'
                        +'</div>';
}

// alert(members.val());
$(document).ready(function(){
	membersFinal.on("change", function(e){

		e.preventDefault();
		$(".temp").remove();
		// permanent.append("<div class='temp'></div>");
		for(var i=1; i<= membersFinal.val(); i++){
			permanentFinal.append(stringvalue2(i));
		}

	});
});


