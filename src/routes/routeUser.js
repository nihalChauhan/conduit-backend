const { Router } = require('express')
const { authorizeRequest } = require('../middlewares/middlewareAuthCheck')
const {
    getCurrentUser,
    createUser,
    updateUser,
    userLogin
} = require('../controllers/controllerUser')

const router = Router()

// GET current user
router.get('/', authorizeRequest, getCurrentUser)
// POST Create and save new user, return created user on success, call error handler on error
router.post('/', createUser)
// PUT update user information
router.put('/', authorizeRequest, updateUser)
// POST Login user
router.post('/login', userLogin)

module.exports = router