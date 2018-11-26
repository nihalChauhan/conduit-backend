const sequelize = require('sequelize')

let user = {
    email: {
        type: sequelize.DataTypes.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false,
        unique: true
    },
    username: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    bio: {
        type: sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    image: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: process.env.DEFAULT_PROFILE_IMAGE_URL,
        validate: {
            isUrl: true
        }
    }
}

let password = {
    hash: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    }
}

module.exports = {
    user,
    password
}