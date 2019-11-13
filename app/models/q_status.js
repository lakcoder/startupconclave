module.exports = function(sequelize, Sequelize){
  var q_status = sequelize.define('q_status', {
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

    q2: {
      type: Sequelize.TEXT,
      notEmpty: false
    }
  });
  return q_status;
}
