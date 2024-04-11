var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var connectDB = require('./db/main');

var indexRouter = require('./routes/index');
var monitorRouter = require('./routes/monitor');

var app = express();

// db connect
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 解析 application/json 格式的请求体
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/monitor', monitorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
