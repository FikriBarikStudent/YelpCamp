const ExpressError = require('./utils/ExpressError');
const {campGroundSchema} = require('./utils/schemas');
const {reviewSchema} = require('./utils/schemas');

const validateCampground = (req, res, next) => {
    const {error} = campGroundSchema.validate(req.body);
    if(error){
      const msg = error.details.map(detail => detail.message).join(',');
      throw new ExpressError(msg, 400)
    } else {
      next()
    }
}

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
      req.session.returnTo  = req.originalUrl;
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
    }
    next()
}

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(detail => detail.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports = {
  validateCampground,
  validateReview,
  isLoggedIn
}
