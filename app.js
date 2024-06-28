"use strict";

var SwaggerExpress = require("swagger-express-mw");
var app = require("express")();
var express = require("express");
var cors = require("cors");
const multer = require('multer')
var path = require('path');
var path = require('path');
app.use(cors());

var http = require('http');
module.exports = app; // for testing
//app.use(checkToken)
var config = {
  appRoot: __dirname 
  // required config
};

// UPLOAD IMAGE

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
        //cb(null,path.join(__dirname,'./uploads/'))

    },

    filename: function (req, file, cb) {
       //b cb(null, new Date().toISOString() + file.originalname)
        cb(null,Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

app.use(upload.fields(
  [
    { name: 'image', maxCount: 1 }
  ]
))

app.use('/uploads',express.static('uploads'))

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }
    // install middleware
    swaggerExpress.register(app);
    var port = process.env.PORT || 8000;
    http.createServer(app).listen(port, function() {
     console.log('Server is running on port', port);
    });
 
});
