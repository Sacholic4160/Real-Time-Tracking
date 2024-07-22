const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('Real-Time-Location','postgres',
    'Fablo@143', {
        host: 'localhost',
        dialect: 'postgres'
    }
)

module.exports = sequelize