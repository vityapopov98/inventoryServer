export default (sequelize, Sequelize)=>{

    const Giving = sequelize.define('giving',{
        date:{
            type: Sequelize.DATE
        },
        returnDate:{
            type: Sequelize.DATE
        },
        userId:{
            type: Sequelize.INTEGER
        },
        whoTakeName:{
            type: Sequelize.STRING
        },
        whoTakePhone:{
            type: Sequelize.STRING
        },
        pledge:{
            type: Sequelize.INTEGER
        }
    });

    return Giving;
}