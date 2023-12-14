const mongoose=require("mongoose")

const DecryptSchema=new  mongoose.Schema({
    decryptedText:String,

});
const Decrypt=mongoose.model("Decrypt",DecryptSchema)
module.exports=Decrypt