import express from 'express';
const app = express();
import bodyParser from 'body-parser';//для парсинга в роутинге
const urlencodedParser = bodyParser.urlencoded({extended: false}) //включение парсера
app.use(bodyParser.json());
import Sequelize from 'sequelize';

import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize('estrynode', 'root', process.env.PASSWORD,{
    host: '',
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
app.use(express.static('dist'));

import authRoutes from './auth_routing.js'

authRoutes(app);
import routing from './routing.js'
routing(app)
app.listen(3000, () => {
    console.log(`Server is running on port 3000.`);
});

