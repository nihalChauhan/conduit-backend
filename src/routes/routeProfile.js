const { Router } = require('express')
const { authorizeRequest, authorizeRequestOptional } = require('../middlewares/middlewareAuthCheck')
const {
    requestedProfile,
    getProfile,
    followUser,
    unfollowUser
} = require('../controllers/controllerProfile')
const router = Router()

// Preload the profile required in req.requestedProfile
router.param('username', requestedProfile)
// GET: profile of :username
router.get('/:username', authorizeRequestOptional, getProfile)
// POST: make current user follow :username
router.post('/:username/follow', authorizeRequest, followUser)
// DELETE: make current user unfollow :username
router.delete('/:username/follow', authorizeRequest, unfollowUser)

module.exports = router