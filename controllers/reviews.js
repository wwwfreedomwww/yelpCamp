const Review = require('../models/review')
const Campground = require('../models/campground');

module.exports.create = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const newReview = new Review(req.body.review)
    newReview.owner = req.user._id 
    campground.reviews.push(newReview)
    await newReview.save()
    await campground.save()
    req.flash('success', 'Review added!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.updateForm = async (req, res) => {
    const { id, reviewID } = req.params
    const review = await Review.findById(reviewID)
    if(!review) {
        req.flash('error', 'Review not found!')
        return res.redirect(`/campgrounds/${id}`)
    }
    res.render('reviews/update', { id, review })
}

module.exports.update = async (req, res) => {
    const { id, reviewID } = req.params
    const review = await Review.findByIdAndUpdate(reviewID, { ...req.body.review }, {runValidators: true, new: true}) 
    console.log(review)
    req.flash('success', 'Review updated!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.del = async (req, res) => {
    const { id, reviewID } = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}})
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Review deleted!')
    res.redirect(`/campgrounds/${id}`)
}

