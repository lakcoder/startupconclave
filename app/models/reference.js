module.exports = function(sequelize, Sequelize){
    var Reference = sequelize.define('reference', {
        referId: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        referName:{
            type: Sequelize.STRING

        },
        teamName: {
            type: Sequelize.STRING,
            notEmpty: true
        }

    });
    return Reference;
}