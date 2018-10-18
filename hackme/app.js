let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let path = require('path');

let index = require('./routes/index');
let sqlRoutes = require('./routes/sqlInjection');
let bruteForceRoutes = require('./routes/bruteForce.js');
let mongo = require('./routes/mongo.js');
let xssRoutes = require('./routes/xss.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/sqlInjection', sqlRoutes);
app.use('/bruteForce', bruteForceRoutes);
app.use('/xss', xssRoutes);
app.use('/mongo', mongo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//module.exports = app; //comment this if this runs on aws
 app.listen(3000, () => console.log('Example app listening on port 3000!')); // uncomment this if this runs on aws
