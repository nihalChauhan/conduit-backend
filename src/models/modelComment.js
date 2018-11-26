const sequelize = require('sequelize')

var comment = {
    body: {
        type: sequelize.DataTypes.STRING,
        allowNull: false    
    }
}

module.exports = {
    comment
}