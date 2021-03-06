import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
// const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
//     host: '',
//     dialect: 'mysql'
// });

// const sequelize = new Sequelize('heroku_af8a97aef3ea006', 'b98e9436956d35', process.env.PASSWORD,{
//     host: 'us-cdbr-east-03.cleardb.com',
//     dialect: 'mysql'
// });

import {sequelize} from './dbConnection.js'

import UserConstructor from './user.js'
const User = UserConstructor(sequelize, Sequelize)

export default (sequelize, Sequelize)=>{
    const Community = sequelize.define('community', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        userId: { //Admin of the group
            type: Sequelize.INTEGER
        }
    });

    Community.belongsTo(User, {foreignKey: 'userId'}) //For admin  userId
    return Community;
}