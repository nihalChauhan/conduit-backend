const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { user, password } = require('../models/modelUser')
const { article } = require('../models/modelArticle')
const { tags } = require('../models/modelTag')
const { comment } = require('../models/modelComment')
const { follow } = require('../models/modelFollow')

const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/blogV1.db'
})

// Define tables
const User = db.define('user', user);
const Password = db.define('password', password)
const Follow = db.define('follows', follow)
const Article = db.define('article', article)
const Tag = db.define('tag', tags)
const Comment = db.define('comment', comment)

// Generate JWT based on id, date, username and email, and private key
User.prototype.generateJWT = function() {
    var today = new Date();    
    return jwt.sign({
        id: this.id,
        date: today,
        username: this.username,
        email: this.email
    }, process.env.AUTH_KEY_SECRET)
}

// Create user object to be sent
User.prototype.userToJSON = function () {  
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    }
}

// Create Profile Object to be sent
User.prototype.userToProfileJSON = async function (loggedUser = false) {
    var following = loggedUser? await loggedUser.isFollowing(this.username) : false
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following
    }
}

// Create article Object to be sent
Article.prototype.articleToJSON = async function (tagList, user, loggedUser = false) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: typeof(tagList[0]) == 'string' ? tagList : tagList.map(tag => tag.name),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: await user.userToProfileJSON(loggedUser)
    }
}

// Create comment object to be sent
Comment.prototype.commentToJson = async function (user, loggedUser = false) {
    return {
        id: this.id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: await user.userToProfileJSON(loggedUser)
    }
}

// Check if calling user follows passed user
User.prototype.isFollowing = async function (followedUsername) {
    var following = await this.getUsersFollowed({where: {followedUsername}})
    if(following.length !== 0){
        return true
    }
    return false
}

// Create hash
User.prototype.createHash = async function(password) {
    var hash = await bcrypt.hash(password, 10)
    return hash
}

// Validate Password
User.prototype.validatePassword = async function(textPassword) {
    var password = await this.getPassword()
    const result = await bcrypt.compare(textPassword, password.hash)
    return result
}

// Follow user
User.prototype.follow = async function(user) {
    var followedUserInstance = await Follow.findOne({where: {
        followedUsername: user.username,
        username: this.username
    }})
    if(followedUserInstance) {
        console.log('warn', 'Follow link already exists on follow request')
        return
    }
    else {
        await Follow.create({
            followedUsername: user.username
        }).then(createdFollowedUser => {
            console.log('info', 'Follow link created on follow request')
            this.addUsersFollowed(createdFollowedUser)
        })
    }
    return
}

// Unfollow user
User.prototype.unFollow = async function(user) {
    var followedUserInstance = await Follow.findOne({where: {
        followedUsername: user.username,
        username: this.username
    }})
    if(!followedUserInstance) {
        console.log('warn', 'Follow link to unfollow not found')
        return
    }
    else {
        followedUserInstance.destroy()
        console.log('info', 'Follow link destroyed on unfollow request')
    }
    return
}

// Create Associations
User.hasOne(Password, {foreignKey: 'username', as: 'Password'})
User.hasMany(Follow, {foreignKey: 'username', as: 'UsersFollowed'})
User.hasMany(Article, {foreignKey: 'username', as: 'Articles'})
Tag.belongsToMany(Article, {through: 'articleTag'})
Article.belongsToMany(Tag, {through: 'articletag'})
Article.hasMany(Comment)
User.hasMany(Comment, {foreignKey: 'username'})

module.exports = {
    db, 
    User,
    Password,
    Tag,
    Article,
    Comment
}