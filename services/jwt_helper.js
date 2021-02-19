import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()

function generateAccessToken(user){
    return new Promise((resolve, reject)=>{
        const payload = {
            id: user.id,
            name: user.name,
            login: user.login
        };
        console.log('user in gen ac tok:', user)
        console.log('payload ac', payload)
        //Сюда приходит юзер в неправильном формате
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {expiresIn: '1h'};

        jwt.sign(payload, secret, options, (err, token)=>{
            if (err) {
                console.log('Error While generate access token : ', err)
                reject('Error')
                return
            }
            resolve(token);
        })
    })
}

//Middleware
function verifyAccessToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log('Headre: ', req.headers)
    const token = authHeader && authHeader.split(' ')[1]
    console.log('Token: ', token)
    if(token == null) return res.sendStatus(401) //access denied

    //Короче просто работает. Magic !!!
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        console.log('this is err: ', err)
        if (err) {
            return res.sendStatus(403) //Your token is no longer valid
        }

        req.user = user //токен оказался верным, поэтому next() пропускает на роут, а в req.user инфа о юзере в нормальном виде
        console.log('this is user from verify', user)
        next() //Если норм, то пропускаем
    })
}

function generateRefreshToken(user) {
    return new Promise((resolve, reject)=>{
        const payload = {
            id: user.id,
            name: user.name,
            login: user.login
        };
        console.log(payload)
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {expiresIn: '1y'};

        jwt.sign(payload, secret, options, (err, token)=>{
            if (err) {
                console.log('Error While generate access token : ', err)
                reject('Error')
                return
            }
            resolve(token);
        })
    })
}

function verifyRefreshToken(refreshToken) {
    return new Promise ((resolve, reject)=>{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload)=>{
            if (err) {
                //NOT authorized
                return reject('not auth')
            }
            const user = payload;
            //Ищем в черном списке есть ли там токен
            //если нет, то 
            return resolve(user)
        })
    })
}

export {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken, 
    verifyRefreshToken
}