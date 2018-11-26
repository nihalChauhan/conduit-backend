const sequelize = require('sequelize')

let tags = {
    name: {
        type: sequelize.DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    }
}

module.exports = {
    tags
}