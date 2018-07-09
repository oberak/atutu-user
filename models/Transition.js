var mongoose = require('mongoose'); // mongodb module
// var bcrypt = require('bcrypt-nodejs');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var TransitionSchema = new Schema({
   // define data fields
   acc_id: {
       type: Schema.Types.ObjectId,
       ref: 'Accounts',
   },
   bank_accname:{
     type: String,
     required: true,
   },
   amount:{
     type: Number,
     required: true,
   },
   type:{
     type:String,
     required: true,
   },
   bank_name:{
     type:String,
     required: true,
   },
   instered:{
     type: Date,
     default:Date.now
   },
  org_ref_id:{
    type: Schema.Types.ObjectId,
    ref: 'Transitions',
    default: null,
  },
  donate_id:{
    type: Schema.Types.ObjectId,
    ref: 'Donates',
    default: null,
  }
});

TransitionSchema.virtual('insertedDt').get(function() {
   return dateformat(this.inserted, 'dd-mm-yyyy');
});

module.exports = mongoose.model('Transitions', TransitionSchema); // Campaigns: collection
