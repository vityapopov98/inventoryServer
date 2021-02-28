import express from 'express';
const app = express();
import bodyParser from 'body-parser';//для парсинга в роутинге
const urlencodedParser = bodyParser.urlencoded({extended: false}) //включение парсера
app.use(bodyParser.json());
import Sequelize from 'sequelize';

import dotenv from 'dotenv'
dotenv.config()

//mysql://b98e9436956d35:ee533ed1@us-cdbr-east-03.cleardb.com/heroku_af8a97aef3ea006?reconnect=true
//username: b98e9436956d35
const sequelize = new Sequelize('heroku_af8a97aef3ea006', 'b98e9436956d35', process.env.PASSWORD,{
    host: 'us-cdbr-east-03.cleardb.com',
    dialect: 'mysql'
});


//----testing connection-----
sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

// import initDB from './models/initDB.js'
// initDB()

app.use('/uploads', express.static('uploads'))
app.use(express.static(__dirname + "/dist/"));

import authRoutes from './auth_routing.js'

authRoutes(app);
import routing from './routing.js'
routing(app)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port APP_PRIVATE_IP_ADDRESS ${PORT}.`);
});

