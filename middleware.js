const ExpressError = require('./utils/expressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema } = require('./joiSchema')
const { reviewSchema } = require('./joiSchema')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewID } = req.params
    const review = await Review.findById(reviewID)
    if (!review.owner.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error){
        const errorMessages = error.details.map(el => el.message).join(',')
        throw new ExpressError(errorMessages, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error){
        const errorMessages = error.details.map(el => el.message).join(',')
        throw new ExpressError(errorMessages, 400)
    } else {
        next()
    }
}




