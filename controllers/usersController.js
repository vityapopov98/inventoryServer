import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
    host: '',
    dialect: 'mysql'
});

import UserConstructor from '../models/user.js';
const User = UserConstructor(sequelize, Sequelize)
//GET
//Просто пользователь
function getUser(req, res){
    console.log('getting user', req.user)
    User.findOne({where: {id: req.user.id}}).then(user=>{
        var response = {
            id: user.id,
            name: user.name,
            login: user.login,
            selectedCommunity: user.selectedCommunity
        }
        res.json(response)
    }).catch(error=>{
        res.json(error)
    })
}
//---???? может в commmunitiesController? УЖЕ СДЕЛАЛ
//Список пользователей группы (Select users from UserCommunities where communityId = 'Заданная группа')
//---????

//POST - регистрация (В auth_controller)

//👉🏼 PUT - изменение пароля/имейла
function updateSelectedCommunity(req, res){
    
    User.update({
        selectedCommunity: req.body.selectedCommunity
    }, {
        where: {
            id: req.user.id
        }
    }).then(user=>{
        res.json({status: 'ok', rowsAffected: user})
    }).catch(error=>{
        res.json(error)
    })
    
}

//👉🏼 DELETE - удаление аккаунта и всех вещей пользователя (с его личной группы Community, и community где он админ)

export {
    getUser,
    updateSelectedCommunity
}