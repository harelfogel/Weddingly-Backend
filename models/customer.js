const { Schema, model } = require('mongoose');
const appoitmentSchema = new Schema({
    supplierId: { type: String },
    supplierName: { type: String },
    supplierMeetingId:{type:String},
    date: { type: String },
    type:{type:String},
    approved:{type:Boolean,default:false}
});


const meetingSchema = new Schema ({
    date:{type:String},
    comment:{type:String},
    email:{type:String}
});

const UserSchema = new Schema({
    brideName: { type: String },
    groomName: { type: String },
    email: { type: String },
    budget: { type: String },
    password: { type: String, default: '' },
    role: {type:String},
    phone:{type:String},
    appointment: [appoitmentSchema]
}, { collection: 'Users', strict: false }); 

const UserModel = model('User', UserSchema);

module.exports = UserModel;