const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

const app = express();

// setting express
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// session setting
const sessionConfig = {
  secret: 'thisisasecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  }
}

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
// connect to database
mongoose.connect('mongodb://localhost:27017/yelpcamp')
  .catch(err => console.log(err));

// Route
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res)=>{
  res.render('home.ejs')
})

app.all('*', (req, res, next)=>{
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
  const { status = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(status).render('error', {err, status});
})

app.listen(3000, ()=>{
  console.log('listening 3000');
})