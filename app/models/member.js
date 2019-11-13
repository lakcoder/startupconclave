module.exports = function (sequelize, Sequelize) {
    var member = sequelize.define('member',{
        memberId:{
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        memberName:{
            type: Sequelize.STRING,
            notEmpty: true
        },
        memberEmail:{
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            },
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
    return member
}