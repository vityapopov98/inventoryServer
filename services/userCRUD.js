import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
    host: '',
    dialect: 'mysql'
});

// import sequelize from './dbConnection.js'

import bcrypt from 'bcrypt'
import CommunityConstructor from '../models/community.js'
import UserConstructor from '../models/user.js'
import UserCommunityConstructor from '../models/userCommunity.js'

const Community = CommunityConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)
const UserCommunity = UserCommunityConstructor(sequelize, Sequelize)

function registerUser(user){
    return new Promise(function(resolve, reject){
        createUser(user).then(user=>{
            //Creating Community
            createCommunity(user).then(community=>{
                //Creating UserCommunity
                createUserCommunity(user, community).then(()=>{
                    resolve(user)
                })
            })
        }).catch(error=>{
            console.log(error)
            reject(error)
        })
    })
    
}

function createUser(user){
    return new Promise(function(resolve, reject){
        bcrypt.genSalt().then(salt=>{
            bcrypt.hash(user.password, salt).then(hashedPassword=>{
                
                User.create({
                    name: user.name,
                    login: user.login,
                    password: hashedPassword,
                    selectedCommunity: user.selectedCommunity
                }).then(user=>{
                    console.log(user.get()); //создали пользователя
                    createCommunity(user)
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
                userId: user.id
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

export {
    registerUser,
    createUser,
    createCommunity,
    createUserCommunity
}