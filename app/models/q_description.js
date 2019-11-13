module.exports = function(sequelize, Sequelize){
  var q_description = sequelize.define('q_description', {
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
    },

    q3: {
      type: Sequelize.TEXT,
      notEmpty: false
    }

  });
  return q_description;
}
