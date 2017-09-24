var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var async = require('async');
// configuration =================

mongoose.connect('mongodb://localhost/newDataBase'); // connect to mongoDB database on modulus.io
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var User = mongoose.model('User', {
    firstName: String,
    lastName: String,
    address: String,
    number: Number,
    taxfile:Boolean,
    suparAdmin: String
});

app.post('/api/users', function(req, res) {
    //save user
    var user = new User(req.body);
       user.save(function(err){
       	if (err)
       		res.send(err);
       	res.json(user);
       });
});

app.get('/api/users', function(req, res) {
    User.find(function(err, users) {
        if (err){
            res.send(err);
        }else{
            var data = [];
            async.each(users, function(user, cb) {
                if (user.suparAdmin == "Admin") {
                    async.each(users, function(us, cbn) {
                        if (us.taxfile != true && us.suparAdmin != "Admin") {
                            data.push(us);
                        }
                    cbn();
                    },function(err){});
                }
                cb();
            }, function(err){});
            return res.json(data);
        }
    });
});

app.delete('/api/user/:userId', function(req, res) {
    User.remove({
        _id: req.params.userId
    }, function(err, user) {
        if (err)
            res.send(err);
        User.find(function(err, users) {
            if (err)
                res.send(err)
            res.json(users);
        });
    });
});

app.put('/api/user/:userId', function(req, res) {
    var newUser = req.body;
    User.update({
        _id: req.params.userId
    }, newUser, function(err, user) {
        if (err)
            res.send(err);
        res.json(user)
    });
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
