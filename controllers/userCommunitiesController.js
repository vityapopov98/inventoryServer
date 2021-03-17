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

import {sequelize} from '../models/dbConnection.js'

import UserCommunityConstructor from '../models/userCommunity.js'
import CommunityConstructor from '../models/community.js'
import UserConstructor from '../models/user.js';

const UserCommunity = UserCommunityConstructor(sequelize, Sequelize)
const Community = CommunityConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)

//GET - список community пользователя 
//(select * from userCommunities where userId = 'Заданный пользователь')
function getUserCommunities(req, res){
    UserCommunity.findAll({
        include: [Community],
        where: {
            userId: req.user.id
        }
    }).then(userCommunities=>{
        res.json(userCommunities)
    })
}
//POST - добавление новго community в список пользователя
function createUserCommunity(req, res){
    UserCommunity.create({
        userId: req.user.id,
        communityId: req.body.communityId
    }).then(userCommunity=>{
        res.json(userCommunity)
    })
}

function addUserToCommunity(req, res){
    User.findOne({
        where: {login: req.body.login}
    }).then(user=>{
        UserCommunity.create({
            userId: user.id,
            communityId: req.body.communityId
        }).then(userCommunity=>{
            res.json(userCommunity)
        })
    })
}
//DELETE - удаление community из списка пользователя
function deleteUserCommunity(req, res){
    UserCommunity.destroy({
        where: {
            id: req.query.id
        }
    }).then(userCommunities=>{
        res.json({status: 'ok', rowsAfected: userCommunities})
    })
}
//Ну PUT тут вообще не имеет смысла

export {
    getUserCommunities,
    createUserCommunity,
    addUserToCommunity,
    deleteUserCommunity
}