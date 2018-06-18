var mongoose = require('mongoose'); // mongodb module
var bcrypt = require('bcrypt-nodejs');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var CampaignSchema = new Schema({
   // define data fields
   title: {
       type: String,
       required: true,
       trim: true,
   },
   catetory: {
       type: Schema.Types.ObjectId,
       ref: 'Categories',
   },
   imgUrl: {
       type: String,
       required: true,
   },
   brief: {
       type: String,
       required: true,
       trim: true,
   },
   story: {
       text: String,
       html: String,
   },
   address: {
       region: String,
       city: String,
       other: String,
   },
   goal: {
       type: Number,
       required: true,
   },
   dueDate: {
       type: Date,
       required: true,
   },
   tags: [String],
   status: {
       type: String,
       required: true,
       // '00': Preparation
       // '10': Start, '11': close, '19': Canceled
       // '90': temp blocked, '91': blocked
       default: '00',
   },
   raised:{
       credit: {
           amount: {
               type: Number,
               required: true,
               default: 0,
           },
           count: {
               type: Number,
               required: true,
               default: 0,
           },
           // TODO link?
       },
       reserved : {
           amount: {
               type: Number,
               required: true,
               default: 0,
           },
           count: {
               type: Number,
               required: true,
               default: 0,
           },
           // TODO link?
       },
   },
   views:{
       type: Number,
       default: 0,
   },
   // comments:{
   //
   // },
   // likes: {
   //
   // },
   // shares: {
   //
   // },
   // favorites: {
   //
   // },
   // System fields
   isDeleted: {
       type: Boolean,
       default: false
   },
   // Audit fields
   updated: {
       type: Date,
       default: Date.now
   },
   inserted: {
       type: Date,
       default: Date.now
   },
   updatedBy: {
       type: Schema.Types.ObjectId,
       ref: 'Campaigns',
   },
   insertedBy: {
       type: Schema.Types.ObjectId,
       ref: 'Campaigns',
   },
});

CampaignSchema.virtual('updatedDt').get(function() {
   return dateformat(this.updated, 'dd-mm-yyyy');
});

CampaignSchema.virtual('insertedDt').get(function() {
   return dateformat(this.inserted, 'dd-mm-yyyy');
});
module.exports = mongoose.model('Campaigns', CampaignSchema); // Campaigns: collection
