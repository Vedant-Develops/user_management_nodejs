
//http libraries
const httpStatus = require('http-status');
const express = require('express');

const app = express();

//middleware
const timeout = require('connect-timeout');
const rateLimit = require('express-rate-limit');

//logging and debugging
const logger = require('morgan');

//security 
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

//autentication & authorization
const passport = require('passport');
const session = require('express-session');

// parsing and form handling
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//routing
const indexRouter = require('../routes/index');
const routes = require('../routes/v1');

//error - handling
const apiError = require('./utils/apiError');
const { errorConverter, errorHandler } = require('./middlewares/error');

//other Utilities
const path = require('path');
const moment = require('moment-timezone');
const cors = require('cors');
const compression = require('compression');
const { jwtStrategy } = require('./config/passport');


const oneDay = 1000 * 60 * 60 * 24;

// view engine serup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
moment.tz.setDefault(process.env.TZ);

app.use(logger('dev'));

//time out for requests
app.use(timeout('1000s'));

//to limit request payload size
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

//to limit too many request from singal ip

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  //limit each ip to 100 req per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// parse json request
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set security HTTP heades
app.use(helmet());

// sanitize request
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

//server session
app.use(session({
    secret: 'SECRET',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true
}));
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
app.use(passport.session());

//enable cors
app.use(cors());

app.use('/', indexRouter, apiLimiter);
app.use('/v1', routes, apiLimiter);

//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new apiError(httpStatus.NOT_FOUND, 'Page Not Found'));
});

// convert error to ApiError if needed
app.use(errorConverter);

//handle error
app.use(errorHandler);

module.exports = app;