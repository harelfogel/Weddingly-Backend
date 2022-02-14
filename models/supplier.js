const {Schema,model}= require('mongoose');

const locationSchema = new Schema ({
    country:{type:String},
    cityId:{type:String},
    city:{type:String},
    address:{type:String}
});

const meetingSchema = new Schema ({
    date:{type:String},
    comment:{type:String},
    email:{type:String}
});

const supplierSchema = new Schema ({
    _id:{type: Schema.Types.ObjectId,auto:true},   // gives a unique id
    approved:{type:Boolean,default:false},
    placeId:{type:String},
    name:{type:String},
    email:{type:String},
    type:{type:String},   
    price: {type: String},
    phone:{type:String},
    location:[locationSchema],
    meeting:[meetingSchema],
    photo:{type:String},
    rating:{type:Number},
    user_ratings_total:{type:Number},
    password: { type: String, default: '' },
    roles:{type:String,default:'moderator'}
} , {collection:'suppliers',strict:false}); // can be done versionKey: false but its not recommended therfore i didnt use it


const Supplier = model('Supplier', supplierSchema);



module.exports=Supplier;