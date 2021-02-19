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

import CommunityConstructor from './community.js'

const Folder = FolderConstructor(sequelize, Sequelize)
const Storage = StorageConstructor(sequelize, Sequelize)
const Giving = GivingConstructor(sequelize, Sequelize)

const Community = CommunityConstructor(sequelize, Sequelize)

export default (sequelize, Sequelize)=>{

    const Item = sequelize.define('item', {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING
        },
        image:{
            type: Sequelize.STRING
        },
        purchaseDate:{
            type: Sequelize.DATE
        },
        guarantee:{
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.INTEGER
        },
        count: {
            type: Sequelize.INTEGER
        },
        utilizeDate:{
            type: Sequelize.STRING
        },
        utilizeReason:{
            type: Sequelize.STRING
        }
    })

    Item.belongsTo(Storage); // storageId
    Item.belongsTo(Folder); // folderId
    Item.belongsTo(Giving); // givingId

    Item.belongsTo(Community); // communityId

    return Item;
}
