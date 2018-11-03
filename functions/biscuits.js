//var moment = require('moment'); 

exports.handler = function(event, context, callback) {
  //var d = moment();
  
  callback(null, {
    statusCode: 200,
    body: "Hello, World please"
  });
};