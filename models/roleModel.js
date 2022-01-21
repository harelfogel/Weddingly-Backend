const {Schema,model}= require('mongoose');
const jwt=require('jsonwebtoken');
const roleSchema = new Schema ({
   name:{type:String}
},{collection:'roles',strict:false}); // can be done versionKey: false but its not recommended therfore i didnt use it

const Role = model('Role', roleSchema);

module.exports=Role;