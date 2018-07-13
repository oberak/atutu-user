var mongoose = require('mongoose'); // mongodb module
// var bcrypt = require('bcrypt-nodejs');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var LocationSchema = new Schema({
    state:{
      type:String,
      required: true
    },
    district:{
      type:String,
      required: true
    }
});
module.exports = mongoose.model('Locations', LocationSchema); // Campaigns: collection
