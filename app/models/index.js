"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..','..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


//Make Relationships
const Team = db['team'];
const Member = db['member'];
const TeamMember = sequelize.define('team_member',{});


TeamMember.belongsTo(Team, {foreignKey:"teamfk"});
TeamMember.belongsTo(Member, {foreignKey:"memberfk"});



//Sync Database
sequelize.sync({force:false}).then(function() {

    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});



db.sequelize = sequelize;
db.Sequelize = Sequelize;


db['team_member'] = TeamMember;
module.exports = db;
