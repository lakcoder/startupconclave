var exports = module.exports = {};
var nodemailer = require('nodemailer');
const fs = require('fs');
const google = require("googleapis").google;
const csv = require('fast-csv');





const OAuth2 = google.auth.OAuth2;


const oauth2Client = new OAuth2(
     "584428439259-msra4crq1dc1dcp3mn3fnd9l3hpr9t55.apps.googleusercontent.com", // ClientID
     "TiP_wiXYihI4tJP6VUCh3NuB", // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: "1//04G1YHofhe33WCgYIARAAGAQSNwF-L9IrTnCppHxH1CKPuotWt4w0t4QmFC2KaIx4lmUVrLqbnAgDLL-i4Ge2Q7Jln6N0JQfELFk"
});
// const accessToken = oauth2Client.getAccessToken()

const accessToken = oauth2Client.refreshAccessToken().then(function(res){
       res.credentials.access_token
     }).catch(function (reason) {
         console.log(reason);
});

var htmlMail = function(to,subject, html){

    var Config = {
         service: "gmail",
         auth: {
              type: "OAuth2",
              user: "contact@ecellvnit.org",
              clientId: "584428439259-msra4crq1dc1dcp3mn3fnd9l3hpr9t55.apps.googleusercontent.com",
              clientSecret: "TiP_wiXYihI4tJP6VUCh3NuB",
              refreshToken: "1//04G1YHofhe33WCgYIARAAGAQSNwF-L9IrTnCppHxH1CKPuotWt4w0t4QmFC2KaIx4lmUVrLqbnAgDLL-i4Ge2Q7Jln6N0JQfELFk",
              accessToken: accessToken
         }
    };


    var transporter = nodemailer.createTransport(Config);

    // transporter.use('compile', mailerhbs({
    //     viewPath: 'app/views/emails', //Path to email template folder
    //     extName: '.hbs' //extendtion of email template
    // }));

    var mailOptions = {
      from: "contact@ecellvnit.org",
      to: to,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


};





exports.htmlhome = function (req, res) {

    res.render("html-home.hbs");
};


exports.finish = function (req, res) {

    return res.render("html-finish");

};


exports.htmlemail = function (req, res) {

    var subject = req.body.subject;
    var html = req.body.html;
    var pass = req.body.pass;

    console.log(html);
    console.log(subject);


    if(pass == "21Cont@ct22"){
        const fileRows = [];

      // open uploaded file
        csv.fromPath(req.file.path)
        .on("data", function (data) {
          fileRows.push(data); // push each row
        })
        .on("end", function () {
          // console.log(fileRows);

            for(var i=0; i<fileRows.length; i++){
                console.log(i + ": " + fileRows[i]);
                htmlMail(fileRows[i], subject, html);
                console.log("Mail Sent");

            }


          fs.unlinkSync(req.file.path);   // remove temp file
          //process "fileRows" and respond
        });

        return res.redirect("/htmlfinish");
    }
    else{
        return res.redirect("/html");
    }



};


exports.sendemail = function (req, res) {

    var subject = req.body.subject;
    var email = req.body.email;
    var html = req.body.html;
    var pass = req.body.pass;

    console.log(html);
    console.log(subject);


    if(pass == "21Cont@ct22"){

        htmlMail(email, subject, html);
        console.log("Mail Sent");

        return res.send("Done");
    }
    else{
        return res.send("Fail");
    }

};
