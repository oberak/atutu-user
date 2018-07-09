var mongoose = require('mongoose');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var DonateSchema = new Schema({
   // define data fields
   amount: {
       credit: Number,
       reserved: Number,
       total:Number,
   },
   trans_id: {
       type: Schema.Types.ObjectId,
       ref: 'Transitions',
   },
   campaigns:[{
       cam_id: {
           type: Schema.Types.ObjectId,
           ref: 'Campaigns',
       },
       amount:{
           type: Number,
           required: true,
       }
   }],
   status: String, // reserved, finish ...

   donor_id: {
       type: Schema.Types.ObjectId,
       ref: 'Users',
   },
   // System fields
   isDeleted: {
       type: Boolean,
       default: false,
   },
   // Audit fields
   inserted: {
       type: Date,
       default: Date.now
   },
});

DonateSchema.virtual('insertedDt').get(function() {
   return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});
module.exports = mongoose.model('Donates', DonateSchema); // Donates: collection
