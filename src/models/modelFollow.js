const sequelize = require('sequelize')

let follow = {
    followedUsername: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    }
}

module.exports = {
    follow
}