const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')


const Rider = sequelize.define('Rider', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
name: {
    type: DataTypes.STRING,
    allowNull: false

},
latitude: {
    type: DataTypes.STRING,
    allowNull: false
},
longitude: {
    type: DataTypes.STRING,
    allowNull: false
    },
    last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

})


module.exports = Rider