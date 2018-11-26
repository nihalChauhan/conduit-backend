const { User } = require('../database/dbconfig')

let requestedProfile = function(req, res, next, username) {
    User.findByPk(username).then(user => {
        if(!user) {
            return res.sendStatus(404)
        }
        req.requestedProfile = user
        next()
        return
    })
}

let getProfile = function(req, res, next){
    if(req.payload){
        User.findByPk(req.payload.username).then(loggedUser => {
            if(!loggedUser) {return res.sendStatus(403)}
            req.requestedProfile.userToProfileJSON(loggedUser).then(profile => {
                return res.json({profile})
            })
        })
    } else {
        return req.requestedProfile.userToProfileJSON().then(profile => {
            return res.json({profile})
        })
    }
}

let followUser = function(req, res, next){
    User.findByPk(req.payload.username).then(loggedUser => {
        if(!loggedUser) {return res.sendStatus(403)}
        else{
            loggedUser.follow(req.requestedProfile).then(() => {
                req.requestedProfile.userToProfileJSON(loggedUser).then(profile => {
                    return res.json({profile})
                })
            })
        }
    })
}

let unfollowUser = function(req, res, next){
    User.findByPk(req.payload.username).then(loggedUser => {
        if(!loggedUser) {return res.sendStatus(403)}
        else{
            loggedUser.unFollow(req.requestedProfile).then(() => {
                req.requestedProfile.userToProfileJSON(loggedUser).then(profile => {
                    return res.json({profile})
                })
            })
        }
    })
}

module.exports = {
    requestedProfile,
    getProfile,
    followUser,
    unfollowUser
}