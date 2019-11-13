var exports = module.exports = {};
//importing models
var models = require("../models");


exports.databaseget = function (req, res) {


    res.render("logindb");

};


exports.databasepost = function (req, res) {

    var body = req.body;

    var email = body.email;
    var pass = body.pass;
    var type = body.type;

    if(email == "admin@ecellvnit.org" && pass == "butintheend"){

        req.session["db"] = true;

        if(type == 0){
            res.redirect("/database-team");
        }
        else if( type == 1){
            res.redirect("/database-member");
        }
        else if( type == 2){
            res.redirect("/database-refer");
        }
        else{
            res.redirect("/database-ques");
        }
    }
    else if(email == "startupbyte@ecellvnit.org" && pass == "startupbyte" && type==3){
        req.session["db"] = true;
        res.redirect("/database-ques");
    }
    else{

        res.redirect("/thisisouradmin");

    }


};

exports.databaseteam = function (req, res) {


    if(req.session["db"] == true){

        var Team = models.team;

        Team.findAll({

            attributes: { exclude: ['password'] }

        }).then(function(teams) {

            res.render("database",{"teams": teams});

        }).catch(function (reason) {
            res.redirect("/thisisouradmin");
        });

    }
    else{

        res.redirect("/thisisouradmin");
    }

};



exports.databasemember = function (req, res) {


    if(req.session["db"] == true){

        var Team = models.team;
        var Member = models.member;
        var TeamMember = models.team_member;


        var list = [];
        Team.findAll({
                attributes: ['teamId', 'teamName', 'teamEmail']
            }).each(function(team){


                   var teamname = team.teamName;
                   var teamemail = team.teamEmail;

                   console.log(team.teamId);


                   return TeamMember.findAll({
                       where :{
                                teamfk : team.teamId
                            }
                       }).each(function (totalmember) {
                          // var len1 = totalmembers.length;

                           // for(var j=0; j<len1 ; j++){

                            return Member.findOne({
                                    where:{
                                        memberId : totalmember.memberfk
                                    }
                                }).then(function (member) {

                                    list.push({
                                        "teamName" : teamname,
                                        "teamEmail" : teamemail,
                                        "memberName" : member.memberName,
                                        "memberPhone" : member.memberPhone,
                                        "memberEmail" : member.memberEmail
                                    });
                                    // console.log(list);

                                });
                       });
            }).then(function(){

                res.render("databasem", {"members":list});
        }).catch(function (reason) {
            res.redirect("/thisisouradmin");
        });

    }
    else{

        res.redirect("/thisisouradmin");
    }

};


exports.databaserefer = function (req, res) {


    if(req.session["db"] == true){

        var Reference = models.reference;

        Reference.findAll({

            attributes: { exclude: ['referId'] }

        }).then(function(refers) {

            res.render("databaserefer",{"refers": refers});

        }).catch(function (reason) {
            res.redirect("/thisisouradmin");
        });

    }
    else{

        res.redirect("/thisisouradmin");
    }

};


exports.databaseques = function (req, res) {
    if(req.session["db"] == true){

        var Team = models.team;

        Team.findAll({

            attributes: { exclude: ['password'] },
            where: {isRtwo: true}

        }).then(function(teams) {

            res.render("databaseques",{"teams": teams});

        }).catch(function (reason) {
            res.redirect("/thisisouradmin");
        });

    }
    else{

        res.redirect("/thisisouradmin");
    }
};

exports.getques = function (req, res) {


    if(req.session["db"] == true){

        var teamemail = req.body.email;

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


        var finallist = {};

        q_description.find({
                where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['description'] = des;
        });
        q_problem.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['problem'] = des;
        });

        q_solution.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['solution'] = des;
        });

        q_status.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['status'] = des;
        });

        q_targetmarket.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['targetmarket'] = des;
        });


        q_competitors.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['competitors'] = des;
        });


        q_revenue.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['revenue'] = des;
        });

        q_social.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['social'] = des;
        });


        q_marketing.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['marketing'] = des;
        });

        q_team.find({
            where:{teamEmail:teamemail
            }
        }).then(function(des) {

            finallist['team'] = des;

            // console.log(finallist);

            res.send(finallist);
        });


    }
    else{

        res.redirect("/thisisouradmin");
    }

};



exports.updateround = function (req, res) {


    if(req.session["db"] == true){

        var teamemail = req.body.email;
        var value = req.body.value;
        var Team = models.team;


        Team.find({
            where:{
                teamEmail : teamemail
            }
        }).then(function(team){
                team.update({isRthree: value}).then(function (val) {
                if(value == 1){
                    res.send("Updated: <span style=\"color: forestgreen;\">Qualified to 3rd Round</span>");
                }
                else{
                   res.send("Updated: <span style=\"color: red;\">Not Qualified</span>");
                }
            });
        }).catch(function (reason) {
            res.send(reason);
        });


    }
    else{

        res.redirect("/thisisouradmin");
    }
};
