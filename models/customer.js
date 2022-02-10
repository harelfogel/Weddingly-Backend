const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const appoitmentSchema = new Schema({
    supplierId: { type: String },
    supplierName: { type: String },
    date: { type: String },
    type:{type:String}
});

const customerSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },   // gives a unique id
    brideName: { type: String },
    groomName: { type: String },
    email: { type: String },
    budget: { type: String },
    password: { type: String, default: '' },
    roles: [
        {
            type:Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    appointment: [appoitmentSchema]
}, { collection: 'customers', strict: false }); // can be done versionKey: false but its not recommended therfore i didnt use it

const Customer = model('Customer', customerSchema);

module.exports = Customer;