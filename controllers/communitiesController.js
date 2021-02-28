import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
// const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
//     host: '',
//     dialect: 'mysql'
// });
const sequelize = new Sequelize('heroku_af8a97aef3ea006', 'b98e9436956d35', process.env.PASSWORD,{
    host: 'us-cdbr-east-03.cleardb.com',
    dialect: 'mysql'
});

// import sequelize from './dbConnection.js'

import CommunityConstructor from '../models/community.js'
import UserCommunityConstructor from '../models/userCommunity.js'
import UserConstructor from '../models/user.js';
import GivingConstructor from '../models/giving.js'
import StorageConstructor from '../models/storage.js'
import ItemConstructor from '../models/item.js'
import FolderConstructor from '../models/folder.js'
const Giving = GivingConstructor(sequelize, Sequelize)
const Item = ItemConstructor(sequelize, Sequelize)
const Folder = FolderConstructor(sequelize, Sequelize)
const Storage = StorageConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)
const Community = CommunityConstructor(sequelize, Sequelize)
const UserCommunity = UserCommunityConstructor(sequelize, Sequelize)

function getCommunity(req, res){
    Community.findOne({
        include: [User],
        where:{
            id: req.query.communityId
        }
    }).then(community=>{
        var responseObject = {
            id: community.id,
            name: community.name,
            user: {
                id: community.user.id,
                name: community.user.name,
                login: community.user.login
            }
        }
        res.json(responseObject)
    })
}

//GET - список пользователей коммьюнити
function getCommunityUsers(req, res){
    UserCommunity.findAll({
        include:[User],
        where: {communityId: req.query.selectedCommunity}
    }).then(userCommuties=>{
        //получили список пользователей в группе selectedCommunity
        console.log('писок пользователей в группе: ', userCommuties)
        var responseData = []
        userCommuties.forEach(element => {
            var responseObject = {
                id: element.id,
                userId: element.userId,
                communityId: element.communityId,
                user: {
                    id: element.user.id,
                    name: element.user.name,
                    login: element.user.login
                }
            }
            responseData.push(responseObject)
        });
        res.json(responseData)
    })
}

// [
//     {
//       "id": 5,
//       "userId": 1,
//       "communityId": 7,
//       "createdAt": "2021-01-28T06:37:39.000Z",
//       "updatedAt": "2021-01-28T06:37:39.000Z",
//       "user": {
//         "id": 1,
//         "name": "Admin",
//         "login": "vityapopov98@yandex.ru",
//         "password": "$2b$10$2CXC7ioZNybUfcsT2zHUL.juc0LgoRupcE0NLlxPF0B2Q45FKTVp2",
//         "selectedCommunity": 10,
//         "createdAt": "2021-01-26T10:14:01.000Z",
//         "updatedAt": "2021-02-08T13:57:35.000Z"
//       }
//     }
//   ]

//POST - создание
function createCommunity(req, res){
    Community.create({
        name: req.body.name,
        //userId: req.body.userId, //Пользователь - админ группы
        userId: req.user.id //Можно скорее всего так делать
    }).then(community=>{
        //Создали группу, теперь добавляем ее в список групп того, кто ее создал
        UserCommunity.create({
            userId: req.user.id,
            communityId: community.id
        }).then(userCommunity=>{
            // res.json(userCommunity)
            res.json(community)
        })
        //
    })
}
//PUT - Редактирование
function updateCommunity(req, res){
    Community.update({
        name: req.body.name,
        userId: req.body.userId,
    },{where: {id: req.body.id}}).then(community=>{
        res.json({status: 'ok', rowsAffected: community})
    })
}
//DELETE - Удаление (все вещи удалять - это же группа)
function deleteCommunity(req, res){
    //Найти все вещи удаляемой группы
    //удалить все givings найденных вещей
    //удалить все папки
    //удалить все хранилища
    //удалить все userCommunities где communityId = удаляемое комьюнити
    console.log('delete func')
    Item.findAll({
        where: {
            communityId:  req.query.communityId
        }
    }).then(items=>{
        console.log(items)
        console.log(items.length)
        if (items.length != 0){
            console.log(' if:(')
            Giving.destroy({where:{id: items.givingId}}).then(deletedGiving=>{})
            Storage.destroy({where:{id: items.storageId}}).then(deletedStorages=>{})
            Folder.destroy({where:{id: items.folderId}}).then(deletedFolders=>{
                UserCommunity.destroy({where:{communityId:  req.query.communityId}}).then(deletedUserCommunities=>{
                    Community.destroy({where:{id: req.body.communityId}}).then(deletedCommunity=>{
                        res.json({status: 'ok', deletedCommunity: deletedCommunity})
                    })
                })
            })
        }
        else{
            console.log('empty else :(')
            UserCommunity.destroy({where:{communityId:  req.query.communityId}}).then(deletedUserCommunities=>{
                console.log('user com ')
                Community.destroy({where:{id: req.query.communityId}}).then(deletedCommunity=>{
                    res.json({status: 'ok', deletedCommunity: deletedCommunity})
                })
            })
        }
    }).catch(error=>{
        console.log('deleting community ',  req.query.communityId)
        console.log('error occured :(')
        res.json({status: 'error', error: error})
    })
}

//GET нет смысла, мы получаем инфу о группе community из таблицы UserCommunities
export {
    getCommunity,
    getCommunityUsers,
    createCommunity,
    updateCommunity,
    deleteCommunity
}