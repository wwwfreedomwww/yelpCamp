const express = require('express')
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn, isReviewOwner, validateReview} = require('../middleware')
const { create, updateForm, update, del} = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, wrapAsync(create))

router.get('/:reviewID/update', isLoggedIn, isReviewOwner, updateForm)

router.put('/:reviewID', isLoggedIn, isReviewOwner, validateReview, wrapAsync(update))

router.delete("/:reviewID", isLoggedIn, isReviewOwner, wrapAsync(del))

module.exports = router;