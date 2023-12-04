var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require("express-flash");
const passport = require('passport');

const initializePassport = require("./passportConfig");
initializePassport(passport);

var app = express();
// var server = http.createServer(app);
// var io = socketIo(server);

var indexRouter = require('./routes/homepage');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup/signup');
var loginRouter = require('./routes/login/login');
var userDashboard = require('./routes/dashboard/dashboard');
var userLogout = require('./routes/logout/logout');
var userChat = require('./routes/chat/chat');

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/signup', signupRouter);
app.use('/users/login', loginRouter);
app.use('/users/logout', userLogout);
app.use('/users/:user_id/dashboard', userDashboard);
app.use('/users/:user_id/chat/:other_user_id', userChat);

// io.on('connection', socket => {
//   console.log("User is connected");
//   socket.emit('chat-message', "hellooo world");
//
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app ;
