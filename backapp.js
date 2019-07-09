

//
// some config stuff
// 

var redis = require('redis');
var client = redis.createClient(); // this creates a new client
var express = require("express");
var app = express();

//
// our app.
//

app.listen(3000, () => {
	console.log("Server running on port 3000");
    });



//
// some redis stuff
//

client.on('connect', function() {
	console.log('Redis client connected');
    });

client.on('error', function (err) {
	console.log('Something went wrong ' + err);
    });
