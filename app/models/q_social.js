module.exports = function(sequelize, Sequelize){
  var q_social = sequelize.define('q_social', {
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

    q1: {
      type: Sequelize.TEXT,
      notEmpty: false
    },

  });
  return q_social;
}
