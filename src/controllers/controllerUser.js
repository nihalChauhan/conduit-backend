const { User, Password } = require('../database/dbconfig')

let getCurrentUser = (req, res, next) => {
    User.findByPk(req.payload.username).then(user => {
        console.log('user = ' + user );
        if(!user){ res.sendStatus(404); }
        
        return res.json({
            user: user.userToJSON()
        })
    }).catch(function(e) {
        next(`authorization failed or user doesn't exists`)
    });
}

let createUser = async (req, res, next) => {
    //Invalid format of the request
    if(!req.body.user){ 
        return res.status(422).json({errors: {format: 'Invalid Format'} })
    }
    if(!req.body.user.username){ 
        return res.status(422).json({errors: {username: `can't be blank`} })
    }
    if(!req.body.user.email){
        return res.status(422).json({errors: {email: `can't be blank`} })
    }
    if(!req.body.user.password){ 
        return res.status(422).json({errors: {password: `can't be blank`} })
    }


    await User.create({
        username: req.body.user.username,
        email: req.body.user.email,
    })
    .then(function(createdUser) {
        createdUser.createHash(req.body.user.password)
            .then( generatedHash => {
                Password.create({
                    hash: generatedHash,
                })
                .then( generatedPassword => {
                    createdUser.setPassword(generatedPassword)
                })
            })
            .then(function() {
                console.log('info', 'User created')                
                res.status(201).json({
                    user: createdUser.userToJSON()
                })
            })
    }).catch(function(e) {
        console.log('error', e)
        if(e.errors[0].type == 'unique violation'){
            next(e.errors[0].path + ' is already taken')
        }
        if(e.errors[0].type == 'Validation error'){
            next(e.errors[0].path + ' is not valid')
        }
    }) 
}

let updateUser = (req, res, next) => {
    User.findByPk(req.payload.username).then(user => {
        if(!user){ return res.sendStatus(404); }

        if(req.body.user.bio){
            user.bio = req.body.user.bio
        }
        if(req.body.user.image){
            user.image = req.body.user.image
        }
        if(req.body.user.email){
            user.email = req.body.user.email
        }
        if(req.body.user.username){
            user.username = req.body.user.username
        }
        if(req.body.user.password){
            user.createHash(req.body.user.password)
            .then( generatedHash => {
                user.getPassword()
                        .then(password => {
                            password.hash = generatedHash
                            password.save()
                        })
            })
        }

        user.save().then(() => {
            return res.json({
                user: user.userToJSON()
            })
        })

    })
}

let userLogin = (req, res, next) => {
    if(!req.body.user){
      return res.status(422).json({errors: {format: "Invalid Format"}});
    }

    if(!req.body.user.email){
      return res.status(422).json({errors: {email: "can't be blank"}});
    }
  
    if(!req.body.user.password){
      return res.status(422).json({errors: {password: "can't be blank"}});
    }

    User.findOne({where: {
        email: req.body.user.email
    }}).then(user => {
            user.validatePassword(req.body.user.password)
                .then(result => {
                    if(result){
                        console.log('info', 'User logged in')
                        return res.json({
                            user: user.userToJSON()
                        })
                    }
                    else {
                        return res.status(404).json({errors: {login: `invalid credentials`}});
                    }
                })
    }).catch((error) => {
        console.log('error', error)
        return res.status(404).json({errors: {login: `invalid credentials`}});
    })

}

module.exports = {
    getCurrentUser,
    createUser,
    updateUser,
    userLogin
}