module.exports = function (sequelize, Sequelize) {
    var confirm = sequelize.define('confirm',{
        conId:{
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        teamName:{
          type: Sequelize.STRING,
          notEmpty: true
        },
        teamEmail:{
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            }
        },
        pnr:{
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: false
        },
        members:{
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: false
        },
        Arrival:{
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: false
        },
        Departure:{
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: false
        }

    });
    return confirm;
}
