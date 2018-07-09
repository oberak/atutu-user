var mongoose = require('mongoose'); // mongodb module
// var bcrypt = require('bcrypt-nodejs');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var AccountSchema = new Schema({
   // define data fields
  balance:{
        credit: {
           type: Number,
           required: true,
           default: 0
       },
       reserved: {
           type: Number,
           required: true,
           default: 0
       },
     },
   user: {
       type: Schema.Types.ObjectId,
       ref: 'Users',
   },
});

module.exports = mongoose.model('Accounts', AccountSchema); // Campaigns: collection
