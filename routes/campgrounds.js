const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground.js');
const { validateCampground, isLoggedIn } = require("../middleware");


router.get('/', wrapAsync(async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
}))
  
router.post('/',isLoggedIn ,validateCampground, wrapAsync(async(req, res, next)=>{
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newCamp._id}`)
}))
  
router.get('/new', isLoggedIn,(req, res)=>{

    res.render('campgrounds/new')
})
  
router.get('/:id', wrapAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', {campground})
}))

router.put('/:id', isLoggedIn, validateCampground, wrapAsync(async(req, res, next)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully edited campground');
    res.redirect(`/campgrounds/${id}`)
}))
  
router.delete('/:id', isLoggedIn, wrapAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect(`/campgrounds`)
}))
  
router.get('/:id/edit', isLoggedIn, wrapAsync(async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs', {campground})
}))

module.exports = router;