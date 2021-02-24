import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
    host: '',
    dialect: 'mysql'
});

// import sequelize from './dbConnection.js'

import bcrypt from 'bcrypt'

import FolderConstructor from '../models/folder.js'
import StorageConstructor from '../models/storage.js'
import GivingConstructor from '../models/giving.js'

import CommunityConstructor from './community.js'
import UserConstructor from '../models/user.js'
import UserCommunityConstructor from './userCommunity.js'
import ItemConstructor from '../models/item.js'
import index from '../models/index.js' // relations



const Folder = FolderConstructor(sequelize, Sequelize)
const Storage = StorageConstructor(sequelize, Sequelize)
const Giving = GivingConstructor(sequelize, Sequelize)



const Community = CommunityConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)
const UserCommunity = UserCommunityConstructor(sequelize, Sequelize)
const Item = ItemConstructor(sequelize, Sequelize)
index() // execute (creating) relations

export default ()=>{

    console.log('👾😶creationg user')
    //Creating User
    createUser().then(user=>{
        //Creating Community
        createCommunity(user).then(community=>{

            //Creating UserCommunity
            createUserCommunity(user, community).then(()=>{
                //Creating Test Storage
                createStorage(community).then(storage=>{
                    //Creationg Test Folder
                    createFolder(community).then(folder=>{
                        //Creation test giving (optional)
                        Giving.sync()
                        //Creating Test Item
                        createItem(storage, folder, community).then(item=>{
                            console.log('Initialization id done')
                        })

                    })
                })
            })
        })
    })

    
}

function createUser(){
    return new Promise(function(resolve, reject){
        bcrypt.genSalt().then(salt=>{
            bcrypt.hash('qwerty', salt).then(hashedPassword=>{
                User.sync().then(()=>{
                    return User.create({
                        name: 'Victor',
                        login: 'vityapopov98@yandex.ru',
                        password: hashedPassword,
                        selectedCommunity: null
                    })
                }).then(user=>{
                    console.log(user.get()); //создали пользователя
                    resolve(user)
                }).catch(error=>{
                    reject(error)
                })
            })
        })
    })
}

function createCommunity(user){
    console.log('In fun user input , ', user)
    return new Promise(function(resolve, reject){
        Community.sync().then(()=>{
            return Community.create({
                name: user.name,
                // name: 'Admin',
                userId: user.id
                // userId: 1
            })
        }).then(community=>{
            console.log(community.get())
            User.update({selectedCommunity: community.id}, {
                where: {id: user.id}
            })
            resolve(community)
        }).catch(error=>{
            console.log(error)
            reject(error)
        })
    })
}

function createUserCommunity(user, community){
    return new Promise(function(resolve, reject){
        UserCommunity.sync().then(()=>{
            return UserCommunity.create({
                userId: user.id,
                communityId: community.id
                // userId: 1,
                // groupId: 1
            })
        }).then(userCommunity=>{
            console.log(userCommunity.get())
            resolve(userCommunity)
        }).catch(error=>{
            console.log(error)
            reject(error)
        })
    })
}

function createStorage(community){
    return new Promise(function(resolve, reject){
        Storage.sync().then(()=>{
            return Storage.create({
                name: 'Test Storage',
                image: 'icon-all.png',
                color: 'yellow',
                communityId: community.id
                // groupId: 1
            })
        }).then(storage=>{
            console.log(storage.get())
            resolve(storage)
        }).catch(error=>{
            console.log(error)
            reject(error)
        })
    })
}

function createFolder(community){
    return new Promise(function(resolve, reject){
        Folder.sync().then(()=>{
            return Folder.create({
                name: 'Test Folder',
                image: 'icon-all.png',
                color: 'yellow',
                communityId: community.id
                // groupId: 1
            })
        }).then(folder=>{
            console.log(folder.get())
            resolve(folder)
        }).catch(error=>{
            console.log(error)
            reject(error)
        })
    })
}


function createItem(storage, folder, community){
    return new Promise(function(resolve, reject){
        Item.sync().then(()=>{
            return Item.create({
                name: 'Test Item',
                description: 'You can edit this item or remove it.',
                image: 'http://localhost:3000/test.jpg',
                cost: 100,
                count: 1,
                storageId: storage.id,
                folderId: folder.id,
                communityId: community.id
                // storageId: 1,
                // folderId: 1,
                // groupId: 1
            })
        }).then(item=>{
            console.log(item.get())
            resolve(item)
        }).catch(error=>{
            console.log(error)
            reject(error)
        })
    })
}