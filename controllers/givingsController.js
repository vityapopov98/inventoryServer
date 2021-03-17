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

//POST
import GivingConstructor from '../models/giving.js'
import ItemConstructor from '../models/item.js'
const Giving = GivingConstructor(sequelize, Sequelize)
const Item = ItemConstructor(sequelize, Sequelize)

// module.exports.createGiving = function createGiving(req, res) {
function createGiving(req, res) {
    //записать в таблицу Giving
        // полученный айди добавить к вещи
        console.log('Creating givinf: ', req.body)
        Giving.create({
            date: req.body.date,
            returnDate: req.body.returnDate,
            userId: req.body.userId, //Кто дал
            whoTakeName: req.body.whoTakeName,
            whoTakePhone: req.body.whoTakePhone,
            pledge: req.body.pledge
        }).then(giving=>{
            console.log('😂', giving.id) 
            //Тепрь добавляем эту инфорамацию в отданную вещь
            Item.update({givingId: giving.id}, {
                where: {
                    id: req.body.itemId
                }
            })
            res.json({givingCreatedId: giving.id})
        })
}
//DELETE
function deleteGiving(req, res) {
    //когда нажимаем на кнопку "вернуть"
    console.log('DELETING GIVING', req.query)
        //находим вещь с giving айди
        Item.findOne({
            where:{
                givingId: req.query.givingId
            },
            raw: true
        }).then(item=>{
            console.log('found item', item)
            //ставим в это поле в вещи null
            Item.update({
                givingId: null
            },{
                where: {
                    id: item.id
                }
            }).then(()=>{
                //потом удаляем сам giving
                Giving.destroy({where:{
                    id: req.query.givingId
                }}).then(()=>{
                    console.log('Destroyed 🤯💥')
                    res.json({status: 'ok'})
                })
            })
        })    
}

//GET и PUT не имеют смысла. (Получаем мы этот объект вместе с вещью, изменять его не нужно)
export {
    createGiving,
    deleteGiving
}