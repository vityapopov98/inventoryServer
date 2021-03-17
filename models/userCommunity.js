import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
// const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
//   host: '',
//   dialect: 'mysql'
// });

// const sequelize = new Sequelize('heroku_af8a97aef3ea006', 'b98e9436956d35', process.env.PASSWORD,{
//   host: 'us-cdbr-east-03.cleardb.com',
//   dialect: 'mysql'
// });

import {sequelize} from './dbConnection.js'

import CommunityConstructor from './community.js'
import UserConstructor from './user.js'

const Community = CommunityConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)

export default (sequelize, Sequelize)=>{
    const UserCommunity = sequelize.define('userCommunity', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {         // User hasMany WorkingDays n:n
              model: 'users',
              key: 'id'
            }
        },
        communityId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {         // WorkingDays hasMany Users n:n
              model: 'communities',
              key: 'id'
            }
        }
    })

    UserCommunity.belongsTo(Community, {foreignKey: 'communityId'});
    UserCommunity.belongsTo(User, {foreignKey: 'userId'});

    return UserCommunity;
}