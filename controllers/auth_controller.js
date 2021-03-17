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

import {generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken} from '../services/jwt_helper.js'
import UserConstructor from '../models/user.js'

const User = UserConstructor(sequelize, Sequelize)
import bcrypt from 'bcrypt'

import {registerUser} from '../services/userCRUD.js'

//register
function register(req, res) {
    if(req.body.user == undefined) res.status(404)
    if (req.body.user.login === undefined || req.body.user.password == undefined || req.body.user.name == undefined) res.status(404)
    //Проверить, нет ли такого пользователя
    console.log('Hi, from register route', req.body)
    User.findOne({
        where: {login: req.body.user.login}
    }).then(userFound=>{
        if (userFound) {
            //Такой пользователь есть. Вернуть ошибку
            console.log('userfound: ', userFound)
            res.send('Already exist')
        }
        else{
            //Такого пользователя нет. Создаем
            registerUser(req.body.user).then(user=>{
                var accessToken;
                var refreshToken;
                generateAccessToken(user).then(acc=>{
                    accessToken = acc;
                    generateRefreshToken(user).then(ref=>{
                        refreshToken = ref;
                        res.json({accessToken: accessToken, refreshToken: refreshToken})
                    })
                }).catch(err=>{
                    console.log('cannot generate token ', err)
                })
            }).catch(err=>{
                console.log('cannot register token: ', err)
            })
        }
    }).catch(err=>{
        console.log('error in finding to register: ', err)
    })
}

//login
function login(req, res) {
    console.log('login route', req.body)
    //Ищем юзера
    User.findOne({
        where:{login: req.body.email},
        raw:true
    }).then(user=>{
        //сравниваем пароли
        console.log('user: ', user)
        if(user != null){

            bcrypt.compare(req.body.password, user.password).then(checked=>{
                if (checked) {
                    //если норм, то выдаем токены
                    var accessToken;
                    var refreshToken;
                    console.log('user in login func', user)
                    generateAccessToken(user).then(acc=>{
                        accessToken = acc;
                        generateRefreshToken(user).then(ref=>{
                            refreshToken = ref;
                            res.json({accessToken: accessToken, refreshToken: refreshToken})
                        })
                    }).catch(err=>{
                        console.log('cannot generate token ', err)
                    })
                }
                else{
                    console.log('wrong password')
                    res.json({accessToken: '', refreshToken: ''})
                    res.json({status: 'Wrong password'})
                }
            })

        }
        else{
            console.log('user is not found')
            res.json({status: 'Cannot find user'})
        }
    }).catch(err=>{
        console.log('error in finding: ', err)
    })
}

//refresh token
function refreshToken(req, res) {
    //получаем рефреш токен
    console.log('this is body : ', req.body.refreshToken)
    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
        console.log('Error No token')
    }
    //проверяем его 
    verifyRefreshToken(refreshToken).then(user=>{
        console.log(user)
        const payload = {
            id: user.id,
            name: user.name,
            login: user.login
        };
        //выдаем новые токены
        var accessToken;
        var refreshToken;
        generateAccessToken(payload).then(acc=>{
            accessToken = acc;
            generateRefreshToken(payload).then(ref=>{
                refreshToken = ref;
                res.json({accessToken: accessToken, refreshToken: refreshToken})
            }).catch(err=>{
                console.log('cannot generate refresh token ', err)
            })
        }).catch(err=>{
            console.log('cannot generate access token ', err)
        })
    }).catch(err=>{
        console.log('cannot refresh token ', err)
        res.json({status: err})
    })

}

//logout
function logout(req, res) {
    //получаем рефреш токен
    //проверяем рефреш токен 

    //Заносим в черный список
}

export{
    register,
    login, 
    refreshToken,
    logout
}