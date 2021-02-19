import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()
const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
    host: '',
    dialect: 'mysql'
});


import ItemConstructor from '../models/item.js'
import StorageConstructor from '../models/storage.js'
import UserConstructor from '../models/user.js';

const Item = ItemConstructor(sequelize, Sequelize)
const Storage = StorageConstructor(sequelize, Sequelize)
const User = UserConstructor(sequelize, Sequelize)
//GET
//Вернуть все хранилища по заданной communityId
function getStorages(req, res){
    //берем пользователя(после аутентификации его подпись {id, name, login} хранится в req.user).
    //Ищем пользователя в таблице, что бы извлечь поле selectedCommunity
    User.findOne({where:{id: req.user.id}}).then(user=>{
        //По полю selectedCommunity ищем папки у которых communityId = selectedCommunity
        Storage.findAll({where:{communityId: user.selectedCommunity}}).then(storages=>{
            //Считаем сколько вещей в каждой папке, формируем ответ и отправляем
            itemsCounterStorage(storages).then(respondStorages=>{
                console.log('А тут', JSON.stringify(respondStorages))
                res.json(respondStorages)
            })
        })
    })

}
//POST
function createStorage(req, res){
    Storage.create({
        name: req.body.name,
        image: req.body.image,
        color: req.body.color,

        communityId: req.body.communityId
    }).then(()=>{
        res.json({status: 'ok'})
    })
}
//PUT
function updateStorage(req, res) {
    console.log('Hey there =)')
        Storage.update({
            name: req.body.name,
            image: req.body.image, 
            color: req.body.color
        },{
            where: {
                id: req.body.id
            }
        }).then(()=>{
        })
        res.json({status: 'ok'})
}
//DELETE
function deleteStorage(req, res) {

    Item.findAll({where: {storageId: req.query.storageId}}).then(items=>{
        if(items.length == 0){
            //удаляем
            Storage.destroy({
                where: {
                    id: req.query.storageId
                }
            }).then(result=>{
                res.json({status: 'ok', rowsAffected: result})
            })
        }
        else{
            res.json({status: 'Storage is not empty', rowsAffected: result})
        }
    })
    
}
//Функия для подсчета количества вещей в хранилище
function itemsCounterStorage(storageArray){
    console.log('store array', storageArray)

    return new Promise((resolve)=>{
        //Вешаем на кажый обработанный элемент промис
        //с помощью Promise.all создаем массив промисов, в которых хранилища с количесвтом вещей
        //и всю эту констврукцию помещаем в промис, так как мы получили ассинхронный map()
        Promise.all(storageArray.map(element => {
        console.log('element:', element)

            return new Promise(resolve=>{
            var newElem = {
                storage: Storage,
                itemCount: Number
            }
                Item.count({
                    where: {storageId: element.id},
                    distinct: true
                }).then(count=>{
                    
                    newElem.storage = element
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
    getStorages,
    createStorage, 
    updateStorage,
    deleteStorage
}