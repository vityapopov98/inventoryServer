import { unlink } from 'fs';
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
import ItemConstructor from '../models/item.js'
import FolderConstructor from '../models/folder.js'
import StorageConstructor from '../models/storage.js'
import GivingConstructor from '../models/giving.js'
import CommunityConstructor from '../models/community.js'

const Community = CommunityConstructor(sequelize, Sequelize)
const Item = ItemConstructor(sequelize, Sequelize)
const Folder = FolderConstructor(sequelize, Sequelize)
const Storage = StorageConstructor(sequelize, Sequelize)
const Giving = GivingConstructor(sequelize, Sequelize)


function getItems(req, res){
    if(req.query.folderId != undefined){ //если есть folderId
        console.log('---Items in folder---')
        getItemsInFolder(req).then(table=>{
            res.json(table)
        })
    }
    else if(req.query.storageId != undefined){ //если указан storageId
        console.log('---Items in storage---')
        getItemsInStorage(req).then(table=>{
            res.json(table)
        })
    }
    else if(req.query.communityId != undefined){ //если указан communityId (ВСЕ вещи)
        console.log('---Items in community---')
        getItemsInCommunity(req).then(table=>{
            res.json(table)
        })
    }
    else if(req.query.trash != undefined){
        console.log('---Items in trash---')
        getItemsInTrash(req).then(table=>{
            res.json(table)
        })
    }
    else if(req.query.giving != undefined){
        console.log('---Items in giving---')
        getItemsInGivings(req).then(table=>{
            res.json(table)
        })
    }
}


function getItemsInFolder(req){
    return new Promise((resolve, reject)=>{
        Folder.findOne({where:{ 
            id: req.query.folderId
        }}).then(folder=>{
            //выводит все записи с вещами
            Item.findAll({
                include: [Storage, Folder, Giving, Community],
                where: {
                    folderId: folder.id
                }
            }).then(table=>{
                resolve(table)
            }).catch(err=>{
                console.log('cannot find items in folder: ', err)
            })
        }).catch(error=>{
            reject(error)
        })
    })
}
function getItemsInStorage(req){
    return new Promise((resolve, reject)=>{
        Storage.findOne({where:{
            id: req.query.storageId
        }}).then(storage=>{
            Item.findAll({
                include: [Storage, Folder, Giving, Community],
                where: {
                    storageId: storage.id
                }
            }).then(table=>{
                resolve(table)
            }).catch(err=>{
                console.log('cannot find items in storages: ', err)
            })
        }).catch(error=>{
            reject(error)
        })
    })
}
//Вообще все вещи (Папка "Все вещи") по communityId
function getItemsInCommunity(req){
    return new Promise((resolve, reject)=>{
       
        Item.findAll({
            include: [Storage, Folder, Giving, Community],
            where: {
                communityId: req.query.communityId
            }
        }).then(table=>{
            resolve(table)
        }).catch(err=>{
            console.log('cannot find items in All Folder: ', err)
        })
        
    })
}

//Вещи утилизированные (Папка "Корзина") по непустым полям utilizeDate && utilizeReason
function getItemsInTrash(req){
    //where communityId = комьюнити пользователя текущее
    return new Promise((resolve, reject)=>{
        const Op = Sequelize.Op;
        Item.findAll({include: [Storage, Folder, Giving, Community], where:{
            communityId: req.query.trash,
            utilizeDate: {
                [Op.ne]: null
            }, 
            utilizeReason:{
                [Op.ne]: null
            }
        }}).then(table=>{
            resolve(table)
        }).catch(err=>{
            console.log('cannot find items in Trash: ', err)
        })
    })
    
}
//Отданные на время вещи (Папка "Отданное") по полю givings (если оно не пустое)
function getItemsInGivings(req){
    //where communityId = комьюнити пользователя текущее
    return new Promise((resolve, reject)=>{
        const Op = Sequelize.Op;
        Item.findAll({include: [Storage, Folder, Giving, Community], where:{
            communityId: req.query.giving,
            givingId: {
                [Op.ne]: null
            }
        }}).then(table=>{
            resolve(table)
        }).catch(error=>{
            reject(error)
        })
    })
    
}

//POST
function createItem(req, res){
    console.log('request with file: ', req.file)
    console.log('request with file: ', req.body)
    if(req.body.purchaseDate == 'null' || req.body.purchaseDate == '' || req.body.purchaseDate == undefined){
        req.body.purchaseDate = new Date()
    }
    Item.create({
        name: req.body.name,
        description: req.body.description,
        image: 'http://localhost:3000/'+req.file.path,
        purchaseDate: req.body.purchaseDate,
        guarantee: req.body.guarantee,
        cost: req.body.cost,
        count: req.body.count,
        untilizeDate: req.body.untilizeDate, 
        utilizeReason: req.body.utilizeReason,
        storageId: req.body.storageId,
        folderId: req.body.folderId,
        communityId: req.body.communityId
    }).then(item=>{
        console.log(item)
        res.json({status: 'ok'})
    }).catch(err=>{
        console.log('cannot create item: ', err)
    })
}
//PUT
function updateItem(req, res){
    console.log('request with file: ', req.file)
    console.log('request with file: ', req.body)
    if(req.body.purchaseDate == 'null' || req.body.purchaseDate == '' || req.body.purchaseDate == undefined){
        req.body.purchaseDate = new Date()
    }
    if(req.body.utilizeReason == 'null' || req.body.utilizeReason == '' || req.body.utilizeReason == undefined){
        req.body.utilizeReason = null
        req.body.utilizeDate = null
    }
    var updateItem = {
        name: req.body.name,
        description: req.body.description,
        purchaseDate: req.body.purchaseDate,
        guarantee: req.body.guarantee,
        cost: req.body.cost,
        count: req.body.count,
        utilizeDate: req.body.utilizeDate, 
        utilizeReason: req.body.utilizeReason,
        storageId: req.body.storageId,
        folderId: req.body.folderId
    }
    if(req.file != undefined){
        updateItem.image = 'http://localhost:3000/'+req.file.path
    }
    Item.update(updateItem, {where: {id: req.body.id}}).then(updated=>{
        console.log(updated)
        res.json({status: 'ok', rowsAffected: updated})
    }).catch(err=>{
        console.log('cannot update item: ', err)
    })
}
//DELETE
function deleteItem(req, res){
    Item.findOne({where: {id: req.query.id}}).then(item=>{
        var file = '.'+item.image.slice(21)
        console.log('this is file ', file)
        unlink(file, (err) => {
            if (err) {
                console.log('deleting error: ', err)
                res.json({status: err})
                return
            }
            console.log('successfully deleted /tmp/hello');
            Item.destroy({
                where: {
                    // id: req.body.folder
                    id: req.query.id
                }
            }).then(result=>{
                
                res.json({status: 'ok', rowsAffected: result})
            }).catch(err=>{
                console.log('cannot delete item: ', err)
            })
          });
    })
    
}


export {
    getItems,
    getItemsInTrash,
    getItemsInGivings,
    createItem, 
    updateItem, 
    deleteItem
}

//GET
//Все вещи в папке по folderId
// function getItemsInFolder(req, res){
//     Folder.findOne({where:{ 
//         id: req.query.folderId
//     }}).then(folder=>{
//         //выводит все записи с вещами
//         Item.findAll({
//             include: [Storage, Folder, Giving],
//             where: {
//                 folderId: folder.id
//             }
//         }).then(table=>{
//             res.json(table)
//         })
//     })
// }

//Все вещи в  хранилище по storageId
// function getItemsInStorage(req, res){
//     Storage.findOne({where:{
//         id: req.query.storageId
//     }}).then(storage=>{
//         Item.findAll({
//             include: [Storage, Folder, Giving],
//             where: {
//                 storageId: storage.id
//             }
//         }).then(table=>{
//             res.json(table)
//         })
//     })
// }