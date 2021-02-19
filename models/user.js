
export default (sequelize, Sequelize)=>{
    const User = sequelize.define('user', {
        id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true, 
            primaryKey: true
        },
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        selectedCommunity: {
            type: Sequelize.INTEGER
        }
    });

    return User
}