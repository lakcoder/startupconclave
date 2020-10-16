var exports = module.exports = {};
//importing models
var models = require("../models");
var nodemailer = require('nodemailer');
var mailerhbs = require('nodemailer-express-handlebars');
var env = process.env.NODE_ENV || "development";
//load bcrypt
var bCrypt = require('bcrypt-nodejs');
var auth = require("../config/config.json")['auth'];
var crypto = require('crypto');
const google = require("googleapis").google;



var generateHash = function(password) {

    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

};


const OAuth2 = google.auth.OAuth2;


const oauth2Client = new OAuth2(
     "584428439259-msra4crq1dc1dcp3mn3fnd9l3hpr9t55.apps.googleusercontent.com", // ClientID
     "TiP_wiXYihI4tJP6VUCh3NuB", // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: "1//04b7KeWrpIE2zCgYIARAAGAQSNwF-L9IrylN_3AasYsHchEh0iRcT9o5nU9hAe_i3YTvJAL_hWP5svM93lcbrdv-X0p5i3ZQ6ImM"
});

const accessToken = oauth2Client.refreshAccessToken().then(function(res){
       res.credentials.access_token
     }).catch(function (reason) {
         console.log(reason);
});

var gMail = function(to,subject,template,context){

  var Config = {
       service: "gmail",
       auth: {
            type: "OAuth2",
            user: "contact@ecellvnit.org",
            clientId: "584428439259-msra4crq1dc1dcp3mn3fnd9l3hpr9t55.apps.googleusercontent.com",
            clientSecret: "TiP_wiXYihI4tJP6VUCh3NuB",
            refreshToken: "1//04b7KeWrpIE2zCgYIARAAGAQSNwF-L9IrylN_3AasYsHchEh0iRcT9o5nU9hAe_i3YTvJAL_hWP5svM93lcbrdv-X0p5i3ZQ6ImM",
            accessToken: accessToken
       }
  };


    var transporter = nodemailer.createTransport(Config);

    transporter.verify(function(err, success){
      if(err){
        console.log(err);
      }
      else{
        console.log("Connected!!!!!!!!!!!");
      }
    })

    transporter.use('compile', mailerhbs({
        viewEngine: {
          extName: '.hbs',
          partialsDir: 'app/views/emails',
          layoutsDir: 'app/views/emails',
          defaultLayout: ''
        },
        viewPath: 'app/views/emails', //Path to email template folder

        extName: '.hbs' //extendtion of email template
    }));

    var mailOptions = {
      from: auth.user,
      to: to,
      subject: subject,
      // html: html
      template: template,
      context: context
    };


    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

};




exports.home = function(req, res) {

    res.render('index');

};


exports.register = function(req, res) {
    req.session['nit'] = 1;
    res.render('register');

};

exports.registerother = function(req, res){
    req.session['nit'] = 0;
    res.render('registerother');
};



exports.question = function (req, res) {
    res.render('ques');
};

exports.verify = function (req, res) {
    res.render('verify', {"email": req.session['email']});
};

exports.partners = function (req, res) {
  res.render('partners');
}


exports.registeringnit = function (req, res) {

    var post = req.body;
    var teamname = post.teamname;
    var organisation = post.organisation;
    var teamemail = post.teamemail;
    var number = post.number;
    var password = post.password;


    if(!number){
        res.render('registerother', {"message":"Minimum two members required"});
    }

    else if(password.length < 8){
        res.render('registerother', {"message":"Minimum 8 digit password"});
    }
    else if(teamname && teamemail && number && password){

        console.log(req.body);
        var flag = 1;
        for(var i=1; i<= number; i++){

            var name = post['membername' + i];
            var email = post['memberemail' + i];
            var phone = post['memberphone' + i];
            if(!name || !email || !phone){
                flag = 0;
                break;
            }
        }

        if(flag==1){

            var Team = models.team;
            Team.findOne({
                where: {
                    teamEmail: teamemail
                }
            }).then(function(team) {

                if (team) {

                    // var teamname = team.teamname;
                    var Login = models.login;

                    Login.findOne({
                        where:{
                            loginEmail: teamemail
                        }
                    }).then(function(loginold){

                        if(!loginold){
                            req.session['email'] = teamemail;
                            req.session['name'] = teamname;
                            var random = Math.floor(100000 + Math.random() * 900000);
                            req.session['otp'] = random;
                            gMail(teamemail, "Verify Your Email","verify_email", {"name":teamname, "otp":random});
                            res.redirect("/verify");
                        }
                        else{
                            res.render('registerother', {"message":"Team Email is already registerd!"});
                        }

                    }).catch(function(err){
                        res.render('registerother', {"message":"Team Email is already registerd!"});
                    });

                }
                else {

                    var teampassword = generateHash(password);
                    req.session["pass"] = password;

                    var teamdata = {

                        teamName: teamname,
                        teamEmail: teamemail,
                        college: organisation,
                        isPaid:0,
                        isRone:0,
                        isRtwo:0,
                        isRthree:0,
                        isNIT:1,
                        password:teampassword

                    };

                    // creating new team..
                    Team.create(teamdata).then(function(newTeam, created) {

                        // Creating Members
                        for(var i=1; i<= number; i++){
                            var name = post['membername' + i];
                            var email = post['memberemail' + i];
                            var phone = post['memberphone' + i];

                            var memberdata ={
                                memberName : name,
                                memberEmail: email,
                                memberPhone: phone
                            };

                            var Member = models.member;
                            Member.create(memberdata).then(function(newMember, created){


                                var TeamMember = models.team_member;

                                TeamMember.create({teamfk:newTeam.teamId, memberfk: newMember.memberId}).catch(function(err){

                                    res.render('registerother', {"message":err});

                                });


                            }).catch(function(err){
                                res.render('registerother', {"message":"Can't Create :"+err});

                            });


                        }

                        //Send email to the team and then redirects to the page.
                        req.session['email'] = teamemail;
                        req.session['name'] = teamname;
                        var random = Math.floor(100000 + Math.random() * 900000);
                        req.session['otp'] = random;
                        gMail(teamemail, "Verify Your Email","verify_email", {"name":teamname, "otp":random});

                        res.redirect("/verify");




                    }).catch(function (reason) {
                        res.render('registerother', {"message":"Something Went Wrong: "+reason});
                    });




                }

            });

            // res.render('ques');
        }
        else{
            res.render('registerother', {"message":"Member Details can't be empty"});
        }

    }
    else{
        res.render('registerother', {"message":"Kindly Fill the form correctly"});
    }

};

exports.registering = function (req, res) {

    var post = req.body;
    var teamname = post.teamname;
    var organisation = post.organisation;
    var teamemail = post.teamemail;
    var number = post.number;
    var password = post.password;


    if(!number){
        res.render('register', {"message":"Minimum two members required"});
    }

    else if(password.length < 8){
        res.render('register', {"message":"Minimum 8 digit password"});
    }
    else if(teamname && teamemail && number && password){

        console.log(req.body);
        var flag = 1;
        for(var i=1; i<= number; i++){

            var name = post['membername' + i];
            var email = post['memberemail' + i];
            var phone = post['memberphone' + i];
            if(!name || !email || !phone){
                flag = 0;
                break;
            }
        }

        if(flag==1){

            var Team = models.team;
            Team.findOne({
                where: {
                    teamEmail: teamemail
                }
            }).then(function(team) {

                if (team) {

                    // var teamname = team.teamname;

                    var Login = models.login;

                    Login.findOne({
                        where:{
                            loginEmail: teamemail
                        }
                    }).then(function(loginold){

                        if(!loginold){
                            req.session['email'] = teamemail;
                            req.session['name'] = teamname;
                            var random = Math.floor(100000 + Math.random() * 900000);
                            req.session['otp'] = random;
                            gMail(teamemail, "Verify Your Email","verify_email", {"name":teamname, "otp":random});
                            res.redirect("/verify");
                        }
                        else{
                            res.render('register', {"message":"Team Email is already registerd!"});
                        }

                    }).catch(function(err){

                        res.render('register', {"message":"Team Email is already registerd!"});

                    });

                }
                else {

                    var teampassword = generateHash(password);
                    req.session['pass'] = password;

                    var teamdata = {

                        teamName: teamname,
                        teamEmail: teamemail,
                        college: organisation,
                        isPaid:0,
                        isRone:0,
                        isRtwo:0,
                        isRthree:0,
                        isNIT:0,
                        password:teampassword

                    };

                    // creating new team..
                    Team.create(teamdata).then(function(newTeam, created) {

                        // Creating Members
                        for(var i=1; i<= number; i++){
                            var name = post['membername' + i];
                            var email = post['memberemail' + i];
                            var phone = post['memberphone' + i];

                            var memberdata ={
                                memberName : name,
                                memberEmail: email,
                                memberPhone: phone
                            };

                            var Member = models.member;
                            Member.create(memberdata).then(function(newMember, created){


                                var TeamMember = models.team_member;

                                TeamMember.create({teamfk:newTeam.teamId, memberfk: newMember.memberId}).catch(function(err){

                                    res.render('register', {"message":err});

                                });


                            }).catch(function(err){
                                res.render('register', {"message":"Can't Create :"+err});

                            });


                        }

                        //Send email to the team and then redirects to the page.
                        req.session['email'] = teamemail;
                        req.session['name'] = teamname;
                        var random = Math.floor(100000 + Math.random() * 900000);
                        req.session['otp'] = random;
                        gMail(teamemail, "Verify Your Email","verify_email", {"name":teamname, "otp":random});
                        res.redirect("/verify");


                    }).catch(function (reason) {
                        res.render('register', {"message":"Something Went Wrong: "+reason});
                    });


                }

            });

            // res.render('ques');
        }
        else{
            res.render('register', {"message":"Member Details can't be empty"});
        }

    }
    else{
        res.render('register', {"message":"Kindly Fill the form correctly"});
    }

};



exports.verifyotp = function (req, res) {

    //if requested for OTP again...
    if(req.query.otp == 'resend'){
        //Send email to the team and then redirects to the page.
        var teamemail = req.session['email'];
        var teamname = req.session['name'];
        var random = Math.floor(100000 + Math.random() * 900000);
        //updates the OTP session
        req.session['otp'] = random;
        if(teamemail && teamname){
            gMail(teamemail, "Verify Your Email","verify_email", {"name":teamname, "otp":random});
            req.session['resend'] = "New OTP sent!";
        }

        else{
            req.session['resend'] = "Invalid Request!";
        }
        res.redirect("/verify");
    }
    else if(req.query.otp == req.session['otp']){

        var email = req.session.email;
        var teamname = req.session['name'];
        var Team = models.team;
        Team.findOne({
                where: {
                    teamEmail: email
                }
            }).then(function(team) {
                if(team){
                    var pass = team.password;

                    var Login = models.login;

                    Login.create({loginEmail: email, loginPassword:pass}).then(function (value) {

                        req.session['login'] = "Thank You for registering with us!. You can procced by Login below";
                        var teampass = req.session["pass"];
                        gMail(email, "Verification Done!","verification_complete", {"name":teamname,"email":email, "password":teampass});
                        delete req.session.otp;
                        delete req.session.resend;
                        delete req.session.email;
                        delete req.session.name;
                        delete req.session.pass;


                        if(req.session["refer"]){

                            var refername = req.session["refer"];

                            var Reference = models.reference;

                            Reference.create({teamName : teamname, referName : refername}).catch(function (err) {
                                res.redirect("/login");
                            });
                            delete req.session.refer;
                        }

                        res.redirect("/login");
                    }).catch(function (err) {
                        req.session['resend'] = "Invalid Request!";
                        res.redirect("/verify");
                    });


                }
        }).catch(function(err){
            req.session['resend'] = "Invalid Request!" + err;
            res.redirect("/verify");
        });


    }
    else{
        req.session['resend'] = "Kindly Enter the valid OTP";
        res.redirect("/verify");
    }

};



exports.logging = function(req,res){


    var Team = models.team;
    var Member = models.member;
    var Login = models.login;
    var TeamMember = models.team_member;
    console.log(req.body);
    var email = req.body.email;
    var pass = req.body.pass;
    req.session['teamemail'] = email;



    Login.findOne({

        where : {
            loginEmail: email
        }

    }).then(function (login) {

        console.log(login);
        var passwordCheck =  bCrypt.compareSync(pass, login.loginPassword);

        if (passwordCheck && login){

            req.session['isLoginEmail'] = login.teamemail;
            req.session['isLogin'] = true;

            Team.findOne({

                where : {
                    teamEmail: email
                }

            }).then(function(team) {

                //Members
                TeamMember.findAll({
                    where:{
                        teamfk : team.teamId
                    }
                }).then(function(totalmembers){

                    var len = totalmembers.length;
                    var memberlist = [];

                    for(var i=0; i<len ; i++){

                        Member.findOne({
                            where:{
                                memberId : totalmembers[i].memberfk
                            }
                        }).then(function (member) {

                            memberlist.push({"member":member.memberName});

                            console.log(memberlist);

                        });

                    }


                    if(team.isPaid == '1' && team.isRone == 1 && team.isRtwo == 1 && team.isRthree == 1){

                      console.log("Session: " + req.session['memberlist']);

                      console.log(memberlist);
                      req.session["isNIT"] = 0;
                      if(team.isNIT == 1){
                          req.session["isNIT"] = 1;
                      }

                      var Confirm = models.confirm;



                      Confirm.findOne({
                          where:{
                              teamEmail : team.teamEmail
                          }
                      }).then(function(found){
                          if(found){
                              console.log("Found bitch");
                               console.log("Val: "+req.session['confirmed']);
                               req.session['confirmed'] = 1;


                              req.session['paid'] = true;
                              req.session["teamname"] = team.teamName;
                              req.session["college"] = team.college;
                              req.session["round3"] = 1;


                              res.redirect("/dashboard");
                          }
                          else{
                              console.log("No bitch");
                              console.log("Val: "+req.session['confirmed']);
                              req.session['confirmed'] = 0;


                              req.session['paid'] = true;
                              req.session["teamname"] = team.teamName;
                              req.session["college"] = team.college;
                              req.session["round3"] = 1;


                              res.redirect("/dashboard");

                          }

                      });



                    }
                    else if(team.isPaid == 1 && team.isRone == 1 && team.isRtwo == 1 ){

                        req.session["memberlist"] = memberlist;

                        console.log("Session: " + req.session['memberlist']);

                        console.log(memberlist);


                        req.session['paid'] = true;

                        req.session["teamname"] = team.teamName;
                        req.session["college"] = team.college;
                        req.session["round2"] = 1;


                        res.redirect("/dashboard");

                    }

                    else if(team.isPaid == "1" && team.isRone == 1){

                        req.session["memberlist"] = memberlist;

                        console.log("Session: " + req.session['memberlist']);

                        console.log(memberlist);


                        req.session['paid'] = true;

                        req.session["teamname"] = team.teamName;
                        req.session["college"] = team.college;
                        res.redirect("/dashboard");
                    }
                    else{


                        var key = "4irpqgES";
                        // var salt = "L7AICEfYAD";
                        // var txnid = "SC19" + team.teamId+ 0 + Math.floor(Math.random()*1000);
                        // console.log(txnid);

                        var amount = 300;
                        var pinfo = "Registration Fees";
                        var fname = team.teamName;
                        var email = team.teamEmail;
                        // var mobile = "7758011192";
                        // var udf5 = "mywave";
                        // var cryp = crypto.createHash('sha512');
                        // var text = key+'|'+txnid+'|'+amount+'|'+pinfo+'|'+fname+'|'+email+'|||||'+udf5+'||||||'+salt;
                        // cryp.update(text);
                        // var hash = cryp.digest('hex');
                        req.session["payment"] = {
                            "key":key,
                            "amount":amount,
                            "pinfo":pinfo,
                            "fname":fname,
                            "email":email
                        };

                        res.redirect("/payment");
                    }

                }).catch(function (err) {
                    res.render("login", {"error": "Some Error"});
                });



            });

        }
        else {
            res.render("login", {"error": "Incorrect Password"});

        }
    }).catch(function(err){

        res.render("login", {"error": "Invalid Login Credentials"});
        console.log(err);
        console.log("HOO");
    });
};


exports.login = function(req,res){
    res.render('login');
};

exports.payment = function(req,res){

    if(req.session["payment"] && req.session['isLogin']){
        res.render("payment");
    }
    else{
        console.log("Redirecting to login");
        res.redirect("/login");
    }


};


exports.paymentverification = function(req,res){
    // var post = req.body;

        console.log(req.body);
        var key = req.body.key;
        var txnid = req.body.txnid;
        var amount = req.body.amount;
        var productinfo = req.body.productinfo;
        var firstname = req.body.firstname;
        var email = req.body.email;
        var mihpayid = req.body.mihpayid;
        var status = req.body.status;
        var resphash = req.body.hash;
        var txnStatus = req.body.txnStatus;
        var txnMessage = req.body.txnMessage;



        var Team = models.team;

        Team.findOne({
         where: {
             teamEmail: email
         }
        }).then(function(team){

             if(team){
                 team.update({
                     isRone: true,
                     isPaid: true
                 });

                 delete req.session["payment"];
                 gMail(email, "Welcome to StartUp Conclave","welcome_email", {"email":email});
                 var heading = "Congratulations!! Your team registration is successful for Startup Conclave 2019. Now, you can proceed to the filling of the questionnaire for the first round.";

                 res.render("payment_response", {"head":heading,"msg":txnMessage, "txnid": txnid, "amount":amount, "success":1, "email":email});
             }
             else{

                 res.render("payment_response", {"head": "We couldn't able to verify your payment beacuse you have just made the payment with the different email id. Kindly contact event managers regarding this failure and share the email id with which you have made the payment.", "msg":txnMessage, "txnid": txnid, "amount":amount,"success":1, "email":email});

             }

        }).catch(function (err) {
            res.render("payment_response", {"head": "We couldn't able to verify your payment","msg":txnMessage,"success":1,"txnid": err + " Please conatct event managers regarding this failure"});
        });



};



exports.paymentfailure = function(req,res){

    res.render("payment_response", {"msg":txnMessage, "txnid": txnid, "amount":amount, "success":0, "email":email});


};

exports.quessubmit = function(req, res){


    console.log(req.body);
    var data = req.body;
    var ques = data.name;
    var teamemail = req.session['teamemail'];

    var message;


    if(ques == 'description'){
        var q_description = models.q_description;

        q_description.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2,
                q3: data.q3

            };

            newone.update(qlist);


        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });

        message = "Changes Saved!";

	}
	else if(ques == 'problem'){
        var q_problem = models.q_problem;
        q_problem.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });

        message = "Changes Saved!";

	}
	else if(ques == 'solution' ){
        var q_solution = models.q_solution;
        q_solution.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });

        message = "Changes Saved!";

	}
	else if( ques == 'status'){
        var q_status = models.q_status;
        q_status.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });
        message = "Changes Saved!";

	}
	else if(ques == 'targetmarket'){
        var q_targetmarket = models.q_targetmarket;
        q_targetmarket.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2,
                q3: data.q3

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });
        message = "Changes Saved!";

	}
	else if(ques == 'competitors'){
        var q_competitors = models.q_competitors;
        q_competitors.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2,
                q3: data.q3

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });
        message = "Changes Saved!";

	}
	else if(ques == 'revenue'){
        var q_revenue = models.q_revenue;
        q_revenue.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2,
                q3: data.q3

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });
        message = "Changes Saved!";

	}

	else if(ques == 'social'){
        var q_social = models.q_social;
        q_social.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1
            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });
        message = "Changes Saved!";

	}
	else if(ques == 'marketing'){
        var q_marketing = models.q_marketing;
        q_marketing.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2

            };

            newone.update(qlist);

        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });
        message = "Changes Saved!";

	}
	else if(ques == 'qteam'){
        var q_team = models.q_team;
        q_team.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (newone) {

            var qlist = {
                q1: data.q1,
                q2: data.q2

            };

            newone.update(qlist);


        }).catch( function (reason) {
           console.log(reason);
           message = reason;
        });


        message = "Changes Saved!";


	}

	else{


        message = "Query is not valid";

	}


    console.log("message: " + message);

    res.send(message);


};

exports.dashboard = function(req,res){


    if(req.session["paid"] && req.session['teamemail']){

        //fetching email id from the session key
        var teamemail = req.session['teamemail'];
        var teamname = req.session['teamname'];
        console.log("In the dashboard function");


        // Loading models

        var q_description = models.q_description;
        var q_problem = models.q_problem;
        var q_solution = models.q_solution;
        var q_status = models.q_status;
        var q_targetmarket = models.q_targetmarket;
        var q_competitors = models.q_competitors;
        var q_revenue = models.q_revenue;
        var q_social = models.q_social;
        var q_marketing = models.q_marketing;
        var q_team = models.q_team;


        var descriptionlist = {};
        var problemlist = {};
        var solutionlist = {};
        var statuslist = {};
        var targetmarketlist = {};
        var competitorslist = {};
        var revenuelist = {};
        var sociallist = {};
        var marketinglist = {};
        var teamlist = {};


        var errorlist = {};

        var finallist = {};


        // Description

        q_description.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (description) {
            if(description){

                var qdescriptionlist = {
                    "q1" : description.q1,
                    "q2" : description.q2,
                    "q3" : description.q3
                };
                finallist['descriptionlist'] = qdescriptionlist;

            }
            else{

                descriptionlist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : "",
                    q3 : ""
                };

                q_description.create(descriptionlist).catch(function (value) {
                    errorlist["description"] = value;
                });



            }

        }).catch( function (reason) {
           console.log(reason);
        });

        //Problem

        q_problem.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (problem) {
            if(problem){

                var qproblemlist = {
                    "q1" : problem.q1,
                    "q2" : problem.q2
                };
                finallist['problemlist'] = qproblemlist;

            }
            else{

                problemlist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : ""
                };

                q_problem.create(problemlist).catch(function (value) {
                    errorlist["problem"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        // Solution

        q_solution.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (solution) {
            if(solution){

                var qsolutionlist = {
                    "q1" : solution.q1,
                    "q2" : solution.q2
                };
                finallist['solutionlist'] = qsolutionlist;

            }
            else{

                solutionlist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : ""
                };

                q_solution.create(solutionlist).catch(function (value) {
                    errorlist["solution"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Status

        q_status.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (status) {
            if(status){

                var qstatuslist = {
                    "q1" : status.q1,
                    "q2" : status.q2
                };
                finallist['statuslist'] = qstatuslist;

            }
            else{

                statuslist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : ""
                };

                q_status.create(statuslist).catch(function (value) {
                    errorlist["status"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Target Market

        q_targetmarket.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (targetmarket) {
            if(targetmarket){

                var qtargetmarketlist = {
                    "q1" : targetmarket.q1,
                    "q2" : targetmarket.q2,
                    "q3" : targetmarket.q3
                };
                finallist['targetmarketlist'] = qtargetmarketlist;

            }
            else{

                targetmarketlist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : "",
                    q3 : ""
                };

                q_targetmarket.create(targetmarketlist).catch(function (value) {
                    errorlist["targetmarket"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Competitors

        q_competitors.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (competitors) {
            if(competitors){

                var qcompetitorslist = {
                    "q1" : competitors.q1,
                    "q2" : competitors.q2,
                    "q3" : competitors.q3
                };
                finallist['competitorslist'] = qcompetitorslist;

            }
            else{

                competitorslist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : "",
                    q3 : ""
                };

                q_competitors.create(competitorslist).catch(function (value) {
                    errorlist["competitors"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Revenue Model

        q_revenue.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (revenue) {
            if(revenue){

                var qrevenuelist = {
                    "q1" : revenue.q1,
                    "q2" : revenue.q2,
                    "q3" : revenue.q3
                };
                finallist['revenuelist'] = qrevenuelist;

            }
            else{

                revenuelist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : "",
                    q3 : ""
                };

                q_revenue.create(revenuelist).catch(function (value) {
                    errorlist["revenue"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Social

        q_social.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (social) {
            if(social){

                var qsociallist = {

                    "q1" : social.q1
                };
                finallist['sociallist'] = qsociallist;

            }
            else{
                sociallist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : ""
                };

                q_social.create(sociallist).catch(function (value) {
                    errorlist["social"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Marketing Technique

        q_marketing.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (marketing) {
            if(marketing){

                var qmarketinglist = {
                    "q1" : marketing.q1,
                    "q2" : marketing.q2
                };
                finallist['marketinglist'] = qmarketinglist;

            }
            else{

                marketinglist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : ""
                };

                q_marketing.create(marketinglist).catch(function (value) {
                    errorlist["marketing"] = value;
                });

            }
        }).catch( function (reason) {
           console.log(reason);
        });

        //Team

        q_team.findOne({
            where:{
                teamEmail: teamemail
            }
        }).then(function (qteam) {
            if(qteam){

                var qteamlist = {
                    "q1" : qteam.q1,
                    "q2" : qteam.q2
                };
                finallist['teamlist'] = qteamlist;
            }
            else {

                teamlist = {
                    teamName : teamname,
                    teamEmail: teamemail,
                    q1 : "",
                    q2 : ""
                };

                q_team.create(teamlist).catch(function (value) {
                    errorlist["team"] = value;
                });

            }

            res.render('dashboard',{'finallist':finallist});


        }).catch( function (reason) {

            req.session['login'] = "error";
            res.redirect("/login");
           console.log(reason);
        });


    }
    else{
        req.session['login'] = "Kindly Pay Your registeration fee first";
        res.redirect("/login");
    }


};

exports.logout = function(req,res){
    delete req.session["paid"];
    delete req.session["memberlist"];
    delete req.session["payment"];
    delete req.session["isLogin"];
    delete req.session["teamname"];
    delete req.session["teamemail"];
    delete req.session.login;
    delete req.session.round2;
    delete req.session.round3;
    delete req.session.isNIT;
    req.session['login'] = "Logged Out!";

    res.redirect("/login");

};





exports.forgotpage = function(req, res){

    res.render("forgot_password");

};

exports.forgotvalidate = function(req, res){


		var teamemail= req.body.e;
		var isValid = false;
		var Login = models.login;

        Login.findOne({
            where:{
                loginEmail: teamemail
            }
        }).then(function(loginold){

            if(loginold){
                var random = Math.floor(100000 + Math.random() * 900000);
                req.session['otp'] = random;
                req.session['email'] = teamemail;
                gMail(teamemail, "Forgot Password?","verify_email", {"name":"", "otp":random});
                 res.render("forgot_password", {"stage2" : true});
            }
            else{

                res.render("forgot_password", {"message" : "Team doesn't exist"});

            }


        }).catch(function (reason) {
            console.log(reason);
            req.render("forgot_password", {"message" : "Something went wrong"});
        });


};




exports.forgototpreset = function (req, res) {

    if((req.body.otp == req.session['otp']) && req.session['email']){

        res.render("forgot_password", {"stage3" : true});

    }
    else{
        req.session['login'] = "We couldn't able to verify your identity.";
        res.redirect("/login");

    }

};


exports.forgotpasswordreset = function (req, res) {

    if(req.session.email){
       var password = req.body.pass;
       var teamemail = req.session.email;


       if(password.length <8){
           res.render("forgot_password", {"stage3" : true,"message":"Minimum 8 digit password" });
       }
       else{

           var teampassword = generateHash(password);

           var Login = models.login;

            Login.findOne({
                where:{
                    loginEmail: teamemail
                }
            }).then(function(loginold){

                if(loginold){
                    loginold.updateAttributes({
                         loginPassword: teampassword
                     });

                    delete req.session.email;
                    delete req.session.otp;
                    req.session['login'] = "Your password has been changed!";
                    res.redirect("/login");

                }
                else{
                    req.session['login'] = "We couldn't able to verify your identity.";
                    res.redirect("/login");
                }
            }).catch(function (reason) {
                req.session['login'] = "We couldn't able to verify your identity.";
                res.redirect("/login");
            });


       }


    }
    else{
        res.redirect("/login");
    }


};

exports.refer = function (req, res) {

    var referid = req.params.id;
    req.session["refer"] = referid;
    res.redirect("/");

};


exports.confirm = function (req, res) {

    var post = req.body;
    console.log(post);
    var teamname = req.session['teamname'];
    var teamemail = req.session['teamemail'];
    var number = post.number;
    var pnr = post.pnr;
    var arrival = post.arrival;
    var departure = post.departure;

    req.session['confirm'] = "";

    if(teamname && pnr && teamemail && number && arrival && departure && number>=2){
        var flag = 1;
        for(var i=1; i<= number; i++){

            var name = post['membername' + i];
            var email = post['memberad' + i];
            var phone = post['memberphone' + i];
            if(!name || !email || !phone){
                flag = 0;
                break;
            }
        }

        if(flag==1){

            var Team = models.team;
            Team.findOne({
                where: {
                    teamEmail: teamemail
                }
            }).then(function(team) {

                if (team) {

                    var Confirm = models.confirm;

                    var teamdata = {

                        teamName: teamname,
                        teamEmail: teamemail,
                        pnr: pnr,
                        members: number,
                        Arrival:arrival,
                        Departure:departure

                    };

                    // creating new team..
                    Confirm.create(teamdata).then(function(newTeam) {

                        // Creating Members
                        for(var i=1; i<= number; i++){
                            var name = post['membername' + i];
                            var ad = post['memberad' + i];
                            var phone = post['memberphone' + i];
                            var temail = newTeam.teamEmail;
                            console.log(temail);

                            var memberdata = {
                                teamEmail: temail,
                                memberName : name,
                                memberAd: ad,
                                memberPhone: phone
                            };

                            var Member = models.confirm_member;
                            Member.create(memberdata).then(function(newMember, created){

                                var details = {
                                    "email":teamemail,
                                    "name":teamname,
                                    "pnr": pnr,
                                    "number": number
                                };
                                gMail(email, "Thank You for confirming to Round 3 | StartUp Conclave","r3_email", details);
                                req.session['confirm'] = "Thanks! For confirming your journey to the VNIT Nagpur. Confirmation mail has been sent to you!";

                                res.redirect("/dashboard");

                            });
                        }

                    }).catch(function (reason) {
                        req.session['confirm'] = reason;
                        res.redirect("/dashboard");
                    });


                }
                else{
                    req.session['confirm'] = "Team Not registered";

                    res.redirect("/dashboard");
                }

            });

        }
        else{
            req.session['confirm'] = "Enter Valid Member Details";
            res.redirect("/dashboard");
        }
    }
    else{
        req.session['confirm'] = "Kindly fill all the details";
        res.redirect("/dashboard");
    }


};



// exports.sen = function(req, res){
//   // gMail("sagarbansal099@gmail.com", "Welcome to StartUp Conclave","welcome_email", {"email":"sagarbansal099@gmail.com", "password":req.session["pass"]});
//   // console.log("maildone");
//     gMail("sagarbansal099@gmail.com", "Greetings from StartUp Conclave!","verification_complete", {"name":"my team","email":"sagar@fuck.girls", "password":"yup"});
//
//   res.render("verification_complete");
// };
