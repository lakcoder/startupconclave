module.exports = function(sequelize, Sequelize){
    var Team = sequelize.define('team', {
        teamId: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        teamName: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        teamEmail:{
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            }
        },
        college:{
            type: Sequelize.STRING
        },
        isPaid:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isRone:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isRtwo:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isRthree:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isNIT:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }

    });
    return Team;
}