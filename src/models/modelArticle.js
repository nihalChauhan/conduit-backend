const sequelize = require('sequelize')

let article = {
    slug: {
        type: sequelize.DataTypes.STRING, 
        unique: true, 
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: sequelize.DataTypes.STRING
    },
    description: {
        type: sequelize.DataTypes.STRING
    },
    body: {
        type: sequelize.DataTypes.STRING
    },
    favoritesCount: {
        type: sequelize.DataTypes.INTEGER,
        default: 0
    }
}

module.exports = {
    article
}