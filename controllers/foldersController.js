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
import UserConstructor from '../models/user.js';

const Item = ItemConstructor(sequelize, Sequelize)
const Folder = FolderConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)

//GET
//Вернуть все папки по заданной communityId
function getFolders(req, res){
    //берем пользователя(после аутентификации его подпись {id, name, login} хранится в req.user).
    //Ищем пользователя в таблице, что бы извлечь поле selectedCommunity
    User.findOne({where:{id: req.user.id}}).then(user=>{
        //По полю selectedCommunity ищем папки у которых communityId = selectedCommunity
        Folder.findAll({where:{communityId: user.selectedCommunity}}).then(folders=>{
            //Считаем сколько вещей в каждой папке, формируем ответ и отправляем
            itemsCounterFolder(folders).then(respondFolders=>{
                console.log('А тут', JSON.stringify(respondFolders))
                res.json(respondFolders)
            })
        }).catch(err=>{
            console.log('cannot find folder: ', err)
        })
    }).catch(err=>{
        console.log('cannot find user: ', err)
    })

}
//POST
function createFolder(req, res){
    Folder.create({
        name: req.body.name,
        image: req.body.image,
        color: req.body.color,

        communityId: req.body.communityId
    }).then(()=>{
        res.json({status: 'ok'})
    }).catch(err=>{
        console.log('cannot create folder: ', err)
    })
}
//PUT
function updateFolder(req, res) {
    console.log('Hey there =)')
        Folder.update({
            name: req.body.name,
            image: req.body.image, 
            color: req.body.color
        },{
                where: {
                    id: req.body.id
                }
            }).then(()=>{
                res.json({status: 'ok'})
        }).catch(err=>{
            console.log('cannot update folder: ', err)
            res.json({status: err})
        })
}
//DELETE
function deleteFolder(req, res) {

    Item.findAll({where: {folderId: req.query.folderId}}).then(items=>{
        if(items.length == 0){
            //удаляем
            Folder.destroy({
                where: {
                    // id: req.body.folder
                    id: req.query.folderId
                }
            }).then(result=>{
                res.json({status: 'ok', rowsAffected: result})
            }).catch(err=>{
                console.log('cannot delete folder: ', err)
                res.json({status: err})
            })
        }
        else{
            res.json({status: 'folder is not empty', rowsAffected: result})
        }
    })
    
}

//Функия для подсчета количества вещей в папке
function itemsCounterFolder(folderArray){
    console.log('store array', folderArray)

    return new Promise((resolve)=>{
        //Вешаем на кажый обработанный элемент промис
        //с помощью Promise.all создаем массив промисов, в которых хранилища с количесвтом вещей
        //и всю эту констврукцию помещаем в промис, так как мы получили ассинхронный map()
        Promise.all(folderArray.map(element => {
        console.log('element:', element)

            return new Promise(resolve=>{
            var newElem = {
                folder: Folder,
                itemCount: Number
            }
                Item.count({
                    where: {folderId: element.id},
                    distinct: true
                }).then(count=>{
                    
                    newElem.folder = element
                    newElem.itemCount = count // добавляем к свойствам хранилища свойство count
                    resolve(newElem)
                })
            })
        })).then(values=>{
            console.log('Hope 🙏🏻', values)
            resolve(values)
        })
    }) 
}

export {
    getFolders,
    createFolder,
    updateFolder, 
    deleteFolder
}