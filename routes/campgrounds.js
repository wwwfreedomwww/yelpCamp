const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const { index, newForm, show, create, updateForm, update, del} = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary') 
const upload = multer({storage})

router.route('/')
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(create))

router.get('/new', isLoggedIn, newForm)

router.route('/:id')
    .get(wrapAsync(show))  
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(update))
    .delete(wrapAsync(del))

router.get('/:id/update', isLoggedIn, isAuthor, wrapAsync(updateForm))

module.exports = router;