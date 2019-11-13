module.exports = function(sequelize, Sequelize){
    var login = sequelize.define('login',{
       loginId: {
           autoIncrement: true,
           primaryKey: true,
           type: Sequelize.INTEGER
       },

        loginEmail: {
           type: Sequelize.STRING,
            validate:{
               isEmail:true
            },
            allowNull:false
        },

        loginPassword: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return login;
}