const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken})
const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.show = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('author')
    if(!campground) {
        req.flash('error', 'Campground not found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.create = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    newCampground.author = req.user._id
    console.log(newCampground)
    await newCampground.save()
    req.flash('success', 'New campground created!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.updateForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error', 'Campground not found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/update', { campground })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Campground updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.del = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    console.log(campground)
    if (campground.images.length){
        for (let img of campground.images){
            await cloudinary.uploader.destroy(img.filename)
        }
    }
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
}
