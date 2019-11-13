var authController = require('../controllers/authcontroller.js');
var emailController = require('../controllers/emailController.js');
var dbController = require('../controllers/dbController.js');
const multer = require('multer');

const upload = multer({ dest: 'tmp/csv/' });

module.exports = function (app) {

    app.get('/', authController.home);
    app.get('/register',authController.register);
    app.get('/registerother',authController.registerother);
    app.get('/login',authController.login);
    app.get('/logout',authController.logout);
    app.get('/dashboard', authController.dashboard);
    app.get('/partners', authController.partners);
    // app.get('/ques', authController.question);
    app.post('/register',authController.registeringnit);
    app.post('/registerother',authController.registering);
    app.get('/verify',authController.verify);
    app.get('/verify/otp',authController.verifyotp);
    app.post('/login',authController.logging);
    app.get('/payment',authController.payment);
    app.post('/payment-success',authController.paymentverification);
    app.post('/payment-failure',authController.paymentfailure);
    app.get('/forgot',authController.forgotpage);
    app.post('/forgot',authController.forgotvalidate);
    app.post('/forgot-password',authController.forgototpreset);
    app.post('/forgot-done',authController.forgotpasswordreset);
    app.post('/confirm',authController.confirm);
    // app.post('/ques-submit',authController.quessubmit);

    app.get('/refer/:id', authController.refer);


    app.get('/html', emailController.htmlhome);
    app.get('/htmlfinish', emailController.finish);
    app.post('/html', upload.single('file'),emailController.htmlemail);
    app.post('/send', emailController.sendemail);


    app.get('/thisisouradmin', dbController.databaseget);
    app.post('/thisisouradmin', dbController.databasepost);
    app.get('/database-team', dbController.databaseteam);
    app.get('/database-member', dbController.databasemember);
    app.get('/database-refer', dbController.databaserefer);
    app.get('/database-ques', dbController.databaseques);
    app.post('/getques', dbController.getques);
    app.post('/updateround', dbController.updateround);

    // app.get('/email',authController.sen);
};
