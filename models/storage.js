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

import CommunityConstructor from './community.js'
const Community = CommunityConstructor(sequelize, Sequelize)

export default (sequelize, Sequelize)=>{

    const Storage = sequelize.define('storage', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
        },
        color: {
            type: Sequelize.STRING,
        },
        communityId: {
            type: Sequelize.INTEGER
        }
    })
    
    Storage.belongsTo(Community);
    return Storage;
}