import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
    host: '',
    dialect: 'mysql'
});

// import sequelize from './dbConnection.js'

import FolderConstructor from '../models/folder.js'
import StorageConstructor from '../models/storage.js'
import GivingConstructor from '../models/giving.js'
import UserConstructor from '../models/user.js'
import CommunityConstructor from './community.js'
import UserCommunityConstructor from './userCommunity.js'

const Folder = FolderConstructor(sequelize, Sequelize)
const Storage = StorageConstructor(sequelize, Sequelize)
const Giving = GivingConstructor(sequelize, Sequelize)
const Community = CommunityConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)
const UserCommunity = UserCommunityConstructor(sequelize, Sequelize)



export default ()=>{
    User.belongsToMany(Community, {through: 'userCommunity', foreignKey: 'userId'});
    Community.belongsToMany(User, {through: 'userCommunity', foreignKey: 'communityId'});
    UserCommunity.belongsTo(Community);
    UserCommunity.belongsTo(User);
}