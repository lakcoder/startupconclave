module.exports = function (sequelize, Sequelize) {
    var confirm_member = sequelize.define('confirm_member',{
        memberId:{
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        teamEmail:{
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            }
        },
        memberName:{
            type: Sequelize.STRING,
            notEmpty: true
        },
        memberAd:{
            type: Sequelize.STRING,
            notEmpty: true
        },
        memberPhone:{
            type: Sequelize.STRING,
            validate:{
                not: ["[a-z]",'i']
            },
            notEmpty: true
        }

    });
    return confirm_member
}