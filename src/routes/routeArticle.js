const { Router } = require('express')
const { authorizeRequest, authorizeRequestOptional } = require('../middlewares/middlewareAuthCheck')
const { 
    postArticle, 
    getArticles,    
    getSingleArticle, 
    deleteArticle, 
    getComments,
    postComment,
    deleteComment 
} = require('../controllers/controllerArticle')

const router = Router()

// POST: article
router.post('/', authorizeRequest, postArticle)
// GET: articles
router.get('/', authorizeRequestOptional, getArticles)
// GET: article
router.get('/:article', authorizeRequestOptional, getSingleArticle)
// DELETE: article
router.delete('/:article', authorizeRequest, deleteArticle)
// GET: article comments
router.get('/:article/comments', authorizeRequestOptional, getComments)
// POST: new Comment
router.post('/:article/comments', authorizeRequest, postComment)
// DELETE: comment
router.delete('/:article/comments/:comment', authorizeRequest, deleteComment)

module.exports = router