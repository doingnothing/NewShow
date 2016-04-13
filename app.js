var express = require('express');

var app = express();

// 静态
app.use('/public', express.static('public'));

app.use('/api', require('./router'));

app.use(function (err, req, res, next) {
    res.send({
        success: false,
        error: err
    })
});

var config = require('./config');
app.listen(config.port, function () {
    console.log('server run on http://localhost:' + config.port);
});
